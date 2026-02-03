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

const RawJsonlMessageSchema = z.object({
  type: z.enum(["user", "assistant", "file-history-snapshot", "tool_result"]),
  uuid: z.string(),
  timestamp: z.string(),
  sessionId: z.string(),
  parentUuid: z.string().nullable(),
  isMeta: z.boolean().optional(),
  isSidechain: z.boolean().optional(),
  message: z.object({
    id: z.string().optional(),
    role: z.enum(["user", "assistant"]),
    content: z.union([z.string(), z.array(RawContentBlockSchema)]),
    model: z.string().optional(),
  }),
});

type RawContentBlock = z.infer<typeof RawContentBlockSchema>;
type RawJsonlMessage = z.infer<typeof RawJsonlMessageSchema>;

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

type McpToolInfo = { server: string; tool: string };

const parseMcpToolName = (name: string): McpToolInfo | null => {
  const match = name.match(/^mcp__(.+)__(\w+)$/);
  if (!match) return null;
  return {
    server: match[1].replace(/_/g, " "),
    tool: match[2].replace(/_/g, " "),
  };
};

const transformToolUse = (
  id: string,
  name: string,
  input: Record<string, unknown>,
): ContentBlock => {
  const fallback: ContentBlock = { type: BlockType.TOOL_USE, id, name, input };

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
      return data ? { type: BlockType.FILE_READ, id, ...data } : fallback;
    }
    case RawTool.WRITE: {
      const data = parseToolInput(ToolInputSchema.Write, input);
      return data ? { type: BlockType.FILE_WRITE, id, ...data } : fallback;
    }
    case RawTool.EDIT: {
      const data = parseToolInput(ToolInputSchema.Edit, input);
      return data ? { type: BlockType.FILE_EDIT, id, ...data } : fallback;
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

// biome-ignore lint/suspicious/noControlCharactersInRegex: ANSI escape codes use control characters
const stripAnsiCodes = (text: string): string => text.replace(/\x1b\[[0-9;]*m/g, "");

const sanitizers: Partial<Record<string, (result: string) => string>> = {
  [RawTool.READ]: (result) => stripSystemReminders(stripLineNumbers(result)),
  [RawTool.BASH]: (result) => stripSystemReminders(stripAnsiCodes(result)),
  [RawTool.GLOB]: stripSystemReminders,
  [RawTool.GREP]: stripSystemReminders,
  [RawTool.WRITE]: stripSystemReminders,
  [RawTool.EDIT]: stripSystemReminders,
  [RawTool.TASK]: stripSystemReminders,
  [RawTool.WEB_FETCH]: stripSystemReminders,
  [RawTool.WEB_SEARCH]: stripSystemReminders,
};

const sanitizeResult = (toolName: string, result: string): string => {
  const sanitizer = sanitizers[toolName];
  return sanitizer ? sanitizer(result) : stripSystemReminders(result);
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

type TrackedTaskTool = {
  id: string;
  name: string;
  input: Record<string, unknown>;
  group: string;
  result?: string;
  is_error?: boolean;
};

type ToolBlockWithId = ContentBlock & { id: string; result?: string; is_error?: boolean };

type TasksAnchor = { type: typeof BlockType.TASKS; tasks: TaskItem[] };

const Group = { TASKS: "tasks" } as const;

const isTaskTool = (name: string): boolean => RAW_TASK_TOOLS.includes(name);

type IntermediateMessage = {
  raw: RawJsonlMessage;
  content: ContentBlock[];
  toolNames: string[];
  textParts: string[];
};

const createPipeline = () => {
  let blocks: ContentBlock[] = [];
  let toolNames: string[] = [];
  let textParts: string[] = [];
  let hasToolResult = false;
  const toolBlockMap = new Map<string, ToolBlockWithId>();
  const toolNameMap = new Map<string, string>();
  const taskToolMap = new Map<string, TrackedTaskTool>();
  const groups = new Map<string, TasksAnchor>();

  const messages: IntermediateMessage[] = [];
  let current: IntermediateMessage | null = null;
  let currentMsgId: string | null = null;
  let currentIsAssistant = false;

  const emit = (block: ContentBlock): void => {
    blocks.push(block);
    const toolName =
      block.type === BlockType.TOOL_USE ? block.name : BLOCK_TYPE_TO_RAW_TOOL[block.type];
    if (toolName) toolNames.push(toolName);
    if (block.type === BlockType.TEXT) textParts.push(block.text);
  };

  const updateTaskAnchor = (taskTool: TrackedTaskTool): void => {
    const anchor = groups.get(Group.TASKS);
    if (!anchor || !taskTool.result) return;

    const taskId = extractTaskId(taskTool.result);
    if (!taskId) return;

    if (taskTool.name === RawTool.TASK_CREATE) {
      const parsed = ToolInputSchema.TaskCreate.safeParse(taskTool.input);
      if (parsed.success) {
        anchor.tasks.push({
          id: taskId,
          subject: parsed.data.subject,
          description: parsed.data.description,
          status: "pending",
        });
      }
    }

    if (taskTool.name === RawTool.TASK_UPDATE) {
      const parsed = ToolInputSchema.TaskUpdate.safeParse(taskTool.input);
      const task = anchor.tasks.find((t) => t.id === taskId);
      if (parsed.success && task && parsed.data.status) {
        task.status = parsed.data.status;
      }
    }
  };

  const ingestToolResult = (raw: Extract<RawContentBlock, { type: "tool_result" }>): void => {
    hasToolResult = true;
    const rawText = extractText(raw.content);

    // Attach result to task tool if applicable
    const taskTool = taskToolMap.get(raw.tool_use_id);
    if (taskTool) {
      taskTool.result = sanitizeResult(taskTool.name, rawText);
      taskTool.is_error = raw.is_error;
      updateTaskAnchor(taskTool);
      return;
    }

    // Attach result to regular tool block
    const toolBlock = toolBlockMap.get(raw.tool_use_id);
    if (toolBlock) {
      const toolName = toolNameMap.get(raw.tool_use_id) ?? "";
      toolBlock.result = sanitizeResult(toolName, rawText);
      toolBlock.is_error = raw.is_error;
    }
  };

  const ingestTaskTool = (raw: Extract<RawContentBlock, { type: "tool_use" }>): void => {
    taskToolMap.set(raw.id, {
      id: raw.id,
      name: raw.name,
      input: raw.input,
      group: Group.TASKS,
    });
    if (groups.has(Group.TASKS)) return;
    const anchor: TasksAnchor = { type: BlockType.TASKS, tasks: [] };
    groups.set(Group.TASKS, anchor);
    emit(anchor);
  };

  const ingestToolUse = (raw: Extract<RawContentBlock, { type: "tool_use" }>): void => {
    const block = transformToolUse(raw.id, raw.name, raw.input) as ToolBlockWithId;
    toolBlockMap.set(raw.id, block);
    toolNameMap.set(raw.id, raw.name);
    emit(block);
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
