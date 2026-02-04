import type { ContentBlock, TaskItem } from "@/supabase/types/message";

import type { Json } from "@/supabase/types";

import { z } from "zod";

import {
  BlockType,
  MessageRole,
  RAW_TASK_TOOLS,
  RAW_TOOL_TO_BLOCK_TYPE,
  RawTool,
  isSkippedMessageType,
} from "@/supabase/types/message";
import { contentBlocksToJson, toJson } from "@/supabase/types/json-cast";

const TextBlockSchema = z.object({ type: z.literal("text"), text: z.string() });

const RawContentBlockSchema = z.union([
  TextBlockSchema,
  z.object({ type: z.literal("thinking"), thinking: z.string(), signature: z.string().optional() }),
  z.object({
    type: z.literal("tool_use"),
    id: z.string(),
    name: z.string(),
    input: z.record(z.string(), z.unknown()),
  }),
  z.object({
    type: z.literal("tool_result"),
    tool_use_id: z.string(),
    content: z.unknown(),
    is_error: z.boolean().optional(),
  }),
]);

// Zod schemas for toolUseResult shapes per tool
const ToolUseResultSchema = {
  Read: z.object({
    type: z.literal("text"),
    file: z.object({
      filePath: z.string(),
      content: z.string(),
      numLines: z.number().optional(),
      startLine: z.number().optional(),
      totalLines: z.number().optional(),
    }),
  }),
  Glob: z.object({
    filenames: z.array(z.string()),
    durationMs: z.number().optional(),
    numFiles: z.number(),
    truncated: z.boolean(),
  }),
  Grep: z.object({
    filenames: z.array(z.string()),
    durationMs: z.number().optional(),
    numFiles: z.number(),
    truncated: z.boolean(),
  }),
  Bash: z.object({
    stdout: z.string(),
    stderr: z.string(),
    interrupted: z.boolean(),
    isImage: z.boolean().optional(),
  }),
  Write: z.object({
    type: z.enum(["create", "update"]),
    filePath: z.string(),
    content: z.string().optional(),
  }),
  Edit: z.object({
    type: z.enum(["create", "update"]),
    filePath: z.string(),
    content: z.string().optional(),
    structuredPatch: z
      .array(
        z.object({
          oldStart: z.number(),
          oldLines: z.number(),
          newStart: z.number(),
          newLines: z.number(),
          lines: z.array(z.string()),
        }),
      )
      .optional(),
  }),
  WebFetch: z.object({
    bytes: z.number().optional(),
    code: z.number(),
    codeText: z.string(),
    result: z.string(),
    durationMs: z.number(),
    url: z.string(),
  }),
  AskUserQuestion: z.object({
    questions: z.array(
      z.object({
        question: z.string(),
        header: z.string(),
        options: z.array(z.object({ label: z.string(), description: z.string() })),
        multiSelect: z.boolean(),
      }),
    ),
    answers: z.record(z.string(), z.string()),
  }),
} as const;

const RawJsonlMessageSchema = z.object({
  type: z.enum(["user", "assistant", "file-history-snapshot", "tool_result"]),
  uuid: z.string(),
  timestamp: z.string(),
  sessionId: z.string(),
  parentUuid: z.string().nullable(),
  cwd: z.string().optional(),
  isMeta: z.boolean().optional(),
  isSidechain: z.boolean().optional(),
  toolUseResult: z.unknown().optional(),
  message: z.object({
    id: z.string().optional(),
    role: z.enum(["user", "assistant"]),
    content: z.union([z.string(), z.array(RawContentBlockSchema)]),
    model: z.string().optional(),
  }),
});

type RawContentBlock = z.infer<typeof RawContentBlockSchema>;
type RawJsonlMessage = z.infer<typeof RawJsonlMessageSchema>;

type McpToolInfo = { server: string; tool: string };

type TrackedTaskTool = {
  id: string;
  name: string;
  input: Record<string, unknown>;
};

type PendingTool = {
  name: string;
  block: ContentBlock;
};

type IntermediateMessage = {
  raw: RawJsonlMessage;
  content: ContentBlock[];
  toolNames: string[];
  textParts: string[];
};

export interface ParsedMessage {
  sessionId: string;
  idx: number;
  uuid: string;
  parentUuid: string | null;
  type: string;
  role: string | null;
  model: string | null;
  timestamp: string;
  isMeta: boolean;
  isSidechain: boolean;
  content: Json;
  hasToolCalls: boolean;
  toolNames: string[];
  textPreview: string;
  rawMessage: Json;
}

const BLOCK_TYPE_TO_RAW_TOOL: Record<string, string> = Object.fromEntries(
  Object.entries(RAW_TOOL_TO_BLOCK_TYPE).map(([raw, internal]) => [internal, raw]),
);

const ToolInputSchema = {
  AskUserQuestion: z.object({
    questions: z
      .array(
        z.object({
          question: z.string(),
          header: z.string(),
          options: z.array(z.object({ label: z.string(), description: z.string() })),
          multiSelect: z.boolean(),
        }),
      )
      .default([]),
  }),
  Bash: z.object({
    command: z.string(),
    description: z.string().optional(),
    timeout: z.number().optional(),
  }),
  Read: z.object({
    file_path: z.string(),
    offset: z.number().optional(),
    limit: z.number().optional(),
  }),
  Write: z.object({ file_path: z.string(), content: z.string() }),
  Edit: z.object({ file_path: z.string(), old_string: z.string(), new_string: z.string() }),
  Glob: z.object({ pattern: z.string(), path: z.string().optional() }),
  Grep: z.object({ pattern: z.string(), path: z.string().optional(), glob: z.string().optional() }),
  Task: z.object({ description: z.string(), prompt: z.string(), subagent_type: z.string() }),
  WebFetch: z.object({ url: z.string(), prompt: z.string() }),
  WebSearch: z.object({ query: z.string() }),
  TaskCreate: z.object({ subject: z.string(), description: z.string().optional() }),
  TaskUpdate: z.object({
    taskId: z.string(),
    status: z.enum(["pending", "in_progress", "completed"]).optional(),
  }),
} as const;

const extractTaskId = (content: string): string | null => {
  const match = content.match(/(?:Task |task )#(\d+)/i);
  return match ? match[1] : null;
};

const parseToolInput = <T>(schema: z.ZodType<T>, input: Record<string, unknown>): T | null => {
  const result = schema.safeParse(input);
  return result.success ? result.data : null;
};

const parseMcpToolName = (name: string): McpToolInfo | null => {
  const match = name.match(/^mcp__(.+)__(\w+)$/);
  if (!match) return null;
  return {
    server: match[1].replace(/_/g, " "),
    tool: match[2].replace(/_/g, " "),
  };
};

const toRelativePath = (absolutePath: string): string => {
  const patterns = [
    /.*\/(packages\/.*)/,
    /.*\/(src\/.*)/,
    /.*\/([^/]+\.(ts|tsx|js|jsx|json|md|css|html))$/,
  ];

  for (const pattern of patterns) {
    const match = absolutePath.match(pattern);
    if (match) return match[1];
  }

  return absolutePath.replace(/^\/Users\/[^/]+\/[^/]+\/[^/]+\//, "");
};

const stripAbsolutePaths = (text: string): string =>
  text.replace(/\/Users\/[^\s:]+/g, (match) => toRelativePath(match));

const transformToolUse = (
  id: string,
  name: string,
  input: Record<string, unknown>,
): ContentBlock => {
  const fallback: ContentBlock = { type: BlockType.GENERIC, id, name, input };

  switch (name) {
    case RawTool.ASK_USER_QUESTION: {
      const data = parseToolInput(ToolInputSchema.AskUserQuestion, input);
      return { type: BlockType.QUESTION, id, questions: data?.questions ?? [] };
    }
    case RawTool.BASH: {
      const data = parseToolInput(ToolInputSchema.Bash, input);
      return data ? { type: BlockType.BASH, id, ...data } : fallback;
    }
    case RawTool.READ: {
      const data = parseToolInput(ToolInputSchema.Read, input);
      return data
        ? { type: BlockType.FILE_READ, id, ...data, file_path: toRelativePath(data.file_path) }
        : fallback;
    }
    case RawTool.WRITE: {
      const data = parseToolInput(ToolInputSchema.Write, input);
      return data
        ? { type: BlockType.FILE_WRITE, id, ...data, file_path: toRelativePath(data.file_path) }
        : fallback;
    }
    case RawTool.EDIT: {
      const data = parseToolInput(ToolInputSchema.Edit, input);
      return data
        ? { type: BlockType.FILE_EDIT, id, ...data, file_path: toRelativePath(data.file_path) }
        : fallback;
    }
    case RawTool.GLOB: {
      const data = parseToolInput(ToolInputSchema.Glob, input);
      return data ? { type: BlockType.GLOB, id, ...data } : fallback;
    }
    case RawTool.GREP: {
      const data = parseToolInput(ToolInputSchema.Grep, input);
      return data ? { type: BlockType.GREP, id, ...data } : fallback;
    }
    case RawTool.TASK: {
      const data = parseToolInput(ToolInputSchema.Task, input);
      return data ? { type: BlockType.TASK, id, ...data } : fallback;
    }
    case RawTool.WEB_FETCH: {
      const data = parseToolInput(ToolInputSchema.WebFetch, input);
      return data ? { type: BlockType.WEB_FETCH, id, ...data } : fallback;
    }
    case RawTool.WEB_SEARCH: {
      const data = parseToolInput(ToolInputSchema.WebSearch, input);
      return data ? { type: BlockType.WEB_SEARCH, id, ...data } : fallback;
    }
    default: {
      const mcpInfo = parseMcpToolName(name);
      if (mcpInfo) {
        return { type: BlockType.MCP, id, ...mcpInfo, input };
      }
      return fallback;
    }
  }
};

const extractText = (content: unknown): string => {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map(extractText).join("\n");
  const parsed = TextBlockSchema.safeParse(content);
  return parsed.success ? parsed.data.text : JSON.stringify(content);
};

const stripSystemReminders = (text: string): string =>
  text.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "").trim();

const stripLineNumbers = (text: string): string => text.replace(/^ *\d+→/gm, "");

// biome-ignore lint/suspicious/noControlCharactersInRegex: ANSI escape codes require control characters
const stripAnsiCodes = (text: string): string => text.replace(/\x1b\[[0-9;]*m/g, "");

const sanitize = (text: string): string => stripAbsolutePaths(stripSystemReminders(text));

const sanitizers: Partial<Record<string, (result: string) => string>> = {
  [RawTool.READ]: (result) => sanitize(stripLineNumbers(result)),
  [RawTool.BASH]: (result) => sanitize(stripAnsiCodes(result)),
  [RawTool.GLOB]: sanitize,
  [RawTool.GREP]: sanitize,
  [RawTool.WRITE]: sanitize,
  [RawTool.EDIT]: sanitize,
  [RawTool.TASK]: sanitize,
  [RawTool.WEB_FETCH]: sanitize,
  [RawTool.WEB_SEARCH]: sanitize,
};

const sanitizeResult = (toolName: string, result: string): string => {
  const sanitizer = sanitizers[toolName];
  return sanitizer ? sanitizer(result) : sanitize(result);
};

// Output enhancers - pure functions that return output fields
const enhanceRead = (data: z.infer<typeof ToolUseResultSchema.Read>) => ({
  content: sanitize(stripLineNumbers(data.file.content)),
  numLines: data.file.numLines,
  totalLines: data.file.totalLines,
});

const enhanceGlob = (data: z.infer<typeof ToolUseResultSchema.Glob>) => ({
  filenames: data.filenames.map(toRelativePath),
  numFiles: data.numFiles,
  truncated: data.truncated,
  durationMs: data.durationMs,
});

const enhanceGrep = (data: z.infer<typeof ToolUseResultSchema.Grep>) => ({
  filenames: data.filenames.map(toRelativePath),
  numFiles: data.numFiles,
  truncated: data.truncated,
  durationMs: data.durationMs,
});

const enhanceBash = (data: z.infer<typeof ToolUseResultSchema.Bash>) => ({
  stdout: sanitize(stripAnsiCodes(data.stdout)),
  stderr: sanitize(stripAnsiCodes(data.stderr)),
  interrupted: data.interrupted,
});

const enhanceWrite = (_data: z.infer<typeof ToolUseResultSchema.Write>) => ({
  success: true,
});

const enhanceEdit = (_data: z.infer<typeof ToolUseResultSchema.Edit>) => ({
  success: true,
});

const enhanceWebFetch = (data: z.infer<typeof ToolUseResultSchema.WebFetch>) => ({
  content: sanitize(data.result),
  statusCode: data.code,
  statusText: data.codeText,
  bytes: data.bytes,
  durationMs: data.durationMs,
});

const enhanceQuestion = (data: z.infer<typeof ToolUseResultSchema.AskUserQuestion>) => ({
  answers: data.answers,
});

// Registry mapping tool name -> schema + enhancer
const outputEnhancers = {
  [RawTool.READ]: { schema: ToolUseResultSchema.Read, enhance: enhanceRead },
  [RawTool.GLOB]: { schema: ToolUseResultSchema.Glob, enhance: enhanceGlob },
  [RawTool.GREP]: { schema: ToolUseResultSchema.Grep, enhance: enhanceGrep },
  [RawTool.BASH]: { schema: ToolUseResultSchema.Bash, enhance: enhanceBash },
  [RawTool.WRITE]: { schema: ToolUseResultSchema.Write, enhance: enhanceWrite },
  [RawTool.EDIT]: { schema: ToolUseResultSchema.Edit, enhance: enhanceEdit },
  [RawTool.WEB_FETCH]: { schema: ToolUseResultSchema.WebFetch, enhance: enhanceWebFetch },
  [RawTool.ASK_USER_QUESTION]: {
    schema: ToolUseResultSchema.AskUserQuestion,
    enhance: enhanceQuestion,
  },
} as const;

// Returns enhanced output fields or null if parsing fails
const enhanceToolOutput = (
  toolName: string,
  toolUseResult: unknown,
): Record<string, unknown> | null => {
  const enhancer = outputEnhancers[toolName as keyof typeof outputEnhancers];
  if (!enhancer) return null;

  const parsed = enhancer.schema.safeParse(toolUseResult);
  if (!parsed.success) return null;

  // biome-ignore lint/suspicious/noExplicitAny: enhancer types are matched by registry key
  return (enhancer.enhance as (data: any) => Record<string, unknown>)(parsed.data);
};

const normalizeBlock = (block: RawContentBlock): ContentBlock | null => {
  switch (block.type) {
    case "text":
      return { type: BlockType.TEXT, text: block.text };
    case "thinking":
      return { type: BlockType.THINKING, thinking: block.thinking, signature: block.signature };
    default:
      return { type: BlockType.TEXT, text: JSON.stringify(block) };
  }
};

const isFilteredBlock = (block: ContentBlock): boolean => {
  if (block.type === BlockType.TEXT) return !block.text.trim();
  return block.type === BlockType.THINKING;
};

const isTaskTool = (name: string): boolean => RAW_TASK_TOOLS.includes(name);

const createPipeline = () => {
  let blocks: ContentBlock[] = [];
  let toolNames: string[] = [];
  let textParts: string[] = [];
  let hasToolResult = false;
  let currentToolUseResult: unknown;
  const pendingTools = new Map<string, PendingTool>();
  const taskToolMap = new Map<string, TrackedTaskTool>();
  const currentTasks: TaskItem[] = [];

  const messages: IntermediateMessage[] = [];
  let current: IntermediateMessage | null = null;
  let currentMsgId: string | null = null;
  let currentIsAssistant = false;

  const emit = (block: ContentBlock): void => {
    blocks.push(block);
    const toolName =
      block.type === BlockType.GENERIC ? block.name : BLOCK_TYPE_TO_RAW_TOOL[block.type];
    if (toolName) toolNames.push(toolName);
    if (block.type === BlockType.TEXT) textParts.push(block.text);
  };

  const emitTasksSnapshot = (taskTool: TrackedTaskTool, result: string): void => {
    const taskId = extractTaskId(result);
    if (!taskId) return;

    let changed = false;

    if (taskTool.name === RawTool.TASK_CREATE) {
      const parsed = ToolInputSchema.TaskCreate.safeParse(taskTool.input);
      if (parsed.success) {
        currentTasks.push({
          id: taskId,
          subject: parsed.data.subject,
          description: parsed.data.description,
          status: "pending",
        });
        changed = true;
      }
    }

    if (taskTool.name === RawTool.TASK_UPDATE) {
      const parsed = ToolInputSchema.TaskUpdate.safeParse(taskTool.input);
      const task = currentTasks.find((t) => t.id === parsed.data?.taskId);
      if (parsed.success && task && parsed.data.status && task.status !== parsed.data.status) {
        task.status = parsed.data.status;
        changed = true;
      }
    }

    if (changed) {
      emit({ type: BlockType.TASKS, tasks: [...currentTasks] });
    }
  };

  const ingestToolResult = (raw: Extract<RawContentBlock, { type: "tool_result" }>): void => {
    hasToolResult = true;
    const rawText = extractText(raw.content);

    // Handle task tools separately
    const taskTool = taskToolMap.get(raw.tool_use_id);
    if (taskTool) {
      emitTasksSnapshot(taskTool, sanitizeResult(taskTool.name, rawText));
      return;
    }

    // Get pending tool and remove from map
    const pending = pendingTools.get(raw.tool_use_id);
    if (!pending) return;
    pendingTools.delete(raw.tool_use_id);

    // Build complete block with output
    const buildBlock = (extraFields: Record<string, unknown>): ContentBlock =>
      ({ ...pending.block, ...extraFields, is_error: raw.is_error }) as ContentBlock;

    // Handle MCP/Generic - store raw output
    if (pending.block.type === BlockType.MCP || pending.block.type === BlockType.GENERIC) {
      emit(buildBlock({ output: currentToolUseResult }));
      return;
    }

    // Try to enhance with rich output
    const outputFields = currentToolUseResult
      ? enhanceToolOutput(pending.name, currentToolUseResult)
      : null;

    if (outputFields) {
      emit(buildBlock(outputFields));
    } else {
      // No rich output - emit with error if present
      const errorFields = raw.is_error ? { error: sanitizeResult(pending.name, rawText) } : {};
      emit(buildBlock(errorFields));
    }
  };

  const ingestTaskTool = (raw: Extract<RawContentBlock, { type: "tool_use" }>): void => {
    taskToolMap.set(raw.id, { id: raw.id, name: raw.name, input: raw.input });
  };

  const ingestToolUse = (raw: Extract<RawContentBlock, { type: "tool_use" }>): void => {
    const block = transformToolUse(raw.id, raw.name, raw.input);
    pendingTools.set(raw.id, { name: raw.name, block });
    toolNames.push(raw.name);
  };

  const ingestDefault = (raw: RawContentBlock): void => {
    const block = normalizeBlock(raw);
    if (!block || isFilteredBlock(block)) return;
    emit(block);
  };

  const ingestBlock = (raw: RawContentBlock): void => {
    if (raw.type === "tool_result") {
      ingestToolResult(raw);
      return;
    }
    if (raw.type === "tool_use" && isTaskTool(raw.name)) {
      ingestTaskTool(raw);
      return;
    }
    if (raw.type === "tool_use") {
      ingestToolUse(raw);
      return;
    }
    ingestDefault(raw);
  };

  const ingestContent = (content: string | RawContentBlock[] | undefined): void => {
    blocks = [];
    toolNames = [];
    textParts = [];
    hasToolResult = false;
    if (!content) return;
    if (typeof content === "string") {
      emit({ type: BlockType.TEXT, text: content });
      return;
    }
    for (const raw of content) ingestBlock(raw);
  };

  const ingest = (r: RawJsonlMessage): void => {
    if (isSkippedMessageType(r.type)) return;

    // Store toolUseResult for use when processing tool_result blocks
    currentToolUseResult = r.toolUseResult;

    ingestContent(r.message.content);
    const msgId = r.message.id ?? null;

    const isSameAssistantMessage =
      r.type === MessageRole.ASSISTANT && msgId && msgId === currentMsgId;
    const isToolResultAfterAssistant = hasToolResult && currentIsAssistant;
    const shouldMerge = current && (isSameAssistantMessage || isToolResultAfterAssistant);

    if (shouldMerge && current) {
      current.content.push(...blocks);
      current.toolNames.push(...toolNames);
      current.textParts.push(...textParts);
    } else {
      if (current) messages.push(current);
      current = { raw: r, content: blocks, toolNames, textParts };
      currentMsgId = msgId;
      currentIsAssistant = r.type === MessageRole.ASSISTANT;
    }
  };

  const flush = (): void => {
    // Emit any pending tools that never got results
    for (const { block } of pendingTools.values()) {
      emit(block);
    }
    pendingTools.clear();

    if (current) messages.push(current);
    current = null;
  };

  return {
    ingest,
    flush,
    getMessages: () => messages,
  };
};

export const parseJsonl = (jsonl: string, sessionId: string): ParsedMessage[] => {
  const pipeline = createPipeline();

  for (const line of jsonl.split("\n")) {
    if (!line.trim()) continue;
    try {
      const result = RawJsonlMessageSchema.safeParse(JSON.parse(line));
      if (result.success) pipeline.ingest(result.data);
    } catch {}
  }
  pipeline.flush();

  return pipeline.getMessages().flatMap(({ raw, content, toolNames, textParts }, idx) => {
    if (content.length === 0) return [];

    return {
      sessionId,
      idx,
      uuid: raw.uuid,
      parentUuid: raw.parentUuid,
      type: raw.type,
      role: raw.type === MessageRole.USER ? MessageRole.USER : MessageRole.ASSISTANT,
      model: raw.message.model ?? null,
      timestamp: raw.timestamp,
      isMeta: raw.isMeta ?? false,
      isSidechain: raw.isSidechain ?? false,
      content: contentBlocksToJson(content),
      hasToolCalls: toolNames.length > 0,
      toolNames,
      textPreview: textParts.join("\n").slice(0, 500),
      rawMessage: toJson(raw),
    };
  });
};
