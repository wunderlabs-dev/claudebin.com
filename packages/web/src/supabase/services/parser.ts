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

type TaskCreateInput = z.infer<typeof ToolInputSchema.TaskCreate>;

const extractTaskId = (content: string): string | null => {
  const match = content.match(/(?:Task |task )#(\d+)/i);
  return match ? match[1] : null;
};

const createTaskFromToolUse = (taskId: string, input: TaskCreateInput): TaskItem => ({
  id: taskId,
  subject: input.subject,
  description: input.description,
  status: "pending",
});

const isTaskToolBlock = (block: ContentBlock, taskToolIds: Set<string>): boolean =>
  block.type === BlockType.TOOL_USE && taskToolIds.has(block.id);

type TaskState = {
  tasks: Map<string, TaskItem>;
  taskToolIdsByMessage: Map<number, Set<string>>;
};

const buildTaskState = (intermediate: IntermediateMessage[]): TaskState => {
  const tasks = new Map<string, TaskItem>();
  const taskToolIdsByMessage = new Map<number, Set<string>>();

  for (const [idx, { content }] of intermediate.entries()) {
    const taskToolIds = new Set<string>();

    for (const block of content) {
      if (block.type !== BlockType.TOOL_USE) continue;
      if (!RAW_TASK_TOOLS.includes(block.name)) continue;

      taskToolIds.add(block.id);

      if (!block.result) continue;
      const taskId = extractTaskId(block.result);
      if (!taskId) continue;

      if (block.name === RawTool.TASK_CREATE) {
        const parsed = ToolInputSchema.TaskCreate.safeParse(block.input);
        if (parsed.success) {
          tasks.set(taskId, createTaskFromToolUse(taskId, parsed.data));
        }
      }

      if (block.name === RawTool.TASK_UPDATE) {
        const parsed = ToolInputSchema.TaskUpdate.safeParse(block.input);
        const existingTask = tasks.get(taskId);
        if (parsed.success && existingTask && parsed.data.status) {
          tasks.set(taskId, { ...existingTask, status: parsed.data.status });
        }
      }
    }

    if (taskToolIds.size > 0) {
      taskToolIdsByMessage.set(idx, taskToolIds);
    }
  }

  return { tasks, taskToolIdsByMessage };
};

const replaceTaskBlocksWithSummary = (
  content: ContentBlock[],
  taskToolIds: Set<string>,
  tasks: TaskItem[],
): ContentBlock[] => {
  const result: ContentBlock[] = [];
  let summaryInserted = false;

  for (const block of content) {
    if (isTaskToolBlock(block, taskToolIds)) {
      if (!summaryInserted) {
        result.push({ type: BlockType.TASKS, tasks });
        summaryInserted = true;
      }
    } else {
      result.push(block);
    }
  }

  return result;
};

const processTaskBlocks = (
  content: ContentBlock[],
  taskToolIds: Set<string> | undefined,
  isLastTaskMessage: boolean,
  tasksList: TaskItem[],
): ContentBlock[] => {
  if (!taskToolIds) return content;
  if (isLastTaskMessage) return replaceTaskBlocksWithSummary(content, taskToolIds, tasksList);
  return content.filter((block) => !isTaskToolBlock(block, taskToolIds));
};

const mergeToolResults = (blocks: ContentBlock[]): ContentBlock[] => {
  const resultMap = new Map<string, { content: string; is_error?: boolean }>();

  for (const block of blocks) {
    if (block.type === BlockType.TOOL_RESULT) {
      resultMap.set(block.tool_use_id, {
        content: block.content,
        is_error: block.is_error,
      });
    }
  }

  return blocks.flatMap((block) => {
    if (block.type === BlockType.TOOL_RESULT) return [];
    if (
      block.type === BlockType.TEXT ||
      block.type === BlockType.THINKING ||
      block.type === BlockType.TASKS
    ) {
      return block;
    }
    const resultData = resultMap.get(block.id);
    if (resultData) {
      return { ...block, result: resultData.content, is_error: resultData.is_error };
    }
    return block;
  });
};

type ContentSummary = {
  toolNames: string[];
  textPreview: string;
};

const summarizeContent = (content: ContentBlock[]): ContentSummary => {
  const toolNames: string[] = [];
  const textParts: string[] = [];

  for (const block of content) {
    const toolName =
      block.type === BlockType.TOOL_USE ? block.name : BLOCK_TYPE_TO_RAW_TOOL[block.type];
    if (toolName) toolNames.push(toolName);

    if (block.type === BlockType.TEXT) {
      textParts.push(block.text);
    }
  }

  return {
    toolNames,
    textPreview: textParts.join("\n").slice(0, 500),
  };
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

const normalizeBlock = (block: RawContentBlock): ContentBlock => {
  switch (block.type) {
    case "text":
      return { type: BlockType.TEXT, text: block.text };
    case "tool_use":
      return transformToolUse(block.id, block.name, block.input);
    case "tool_result":
      return {
        type: BlockType.TOOL_RESULT,
        tool_use_id: block.tool_use_id,
        content: extractText(block.content),
        is_error: block.is_error,
      };
    case "thinking":
      return { type: BlockType.THINKING, thinking: block.thinking, signature: block.signature };
    default:
      return { type: BlockType.TEXT, text: JSON.stringify(block) };
  }
};

const isFilteredBlock = (block: ContentBlock): boolean => {
  if (block.type === BlockType.TEXT) return !block.text.trim();
  if (block.type === BlockType.THINKING) return true;
  return false;
};

const normalizeContent = (content: string | RawContentBlock[] | undefined): ContentBlock[] => {
  if (!content) return [];
  if (typeof content === "string") return [{ type: BlockType.TEXT, text: content }];
  return content.map(normalizeBlock).filter((block) => !isFilteredBlock(block));
};

type IntermediateMessage = { raw: RawJsonlMessage; content: ContentBlock[] };

const parse = (rawMessages: RawJsonlMessage[], sessionId: string): ParsedMessage[] => {
  const intermediate: IntermediateMessage[] = [];
  let current: IntermediateMessage | null = null;
  let currentMsgId: string | null = null;
  let currentIsAssistant = false;

  for (const r of rawMessages) {
    if (isSkippedMessageType(r.type)) continue;

    const msgId = r.message.id ?? null;
    const content = normalizeContent(r.message.content);

    const isToolResult = content.length > 0 && content[0].type === BlockType.TOOL_RESULT;
    const isSameAssistantMessage =
      r.type === MessageRole.ASSISTANT && msgId && msgId === currentMsgId;
    const isToolResultAfterAssistant = isToolResult && currentIsAssistant;
    const shouldMerge = current && (isSameAssistantMessage || isToolResultAfterAssistant);

    if (shouldMerge && current) {
      current.content.push(...content);
    } else {
      if (current) intermediate.push(current);
      current = { raw: r, content };
      currentMsgId = msgId;
      currentIsAssistant = r.type === MessageRole.ASSISTANT;
    }
  }
  if (current) intermediate.push(current);

  for (const msg of intermediate) {
    msg.content = mergeToolResults(msg.content);
  }

  const { tasks, taskToolIdsByMessage } = buildTaskState(intermediate);
  const lastTaskMessageIdx = Math.max(...Array.from(taskToolIdsByMessage.keys()), -1);
  const tasksList = Array.from(tasks.values());

  return intermediate.flatMap(({ raw, content }, idx) => {
    const taskToolIds = taskToolIdsByMessage.get(idx);
    const isLastTaskMessage = idx === lastTaskMessageIdx && tasks.size > 0;
    const finalContent = processTaskBlocks(content, taskToolIds, isLastTaskMessage, tasksList);

    if (finalContent.length === 0) return [];

    const { toolNames, textPreview } = summarizeContent(finalContent);

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
      content: contentBlocksToJson(finalContent),
      hasToolCalls: toolNames.length > 0,
      toolNames,
      textPreview,
      rawMessage: toJson(raw),
    };
  });
};

export const parseJsonl = (jsonl: string, sessionId: string): ParsedMessage[] => {
  const raw: RawJsonlMessage[] = [];
  for (const line of jsonl.split("\n")) {
    if (!line.trim()) continue;
    try {
      const result = RawJsonlMessageSchema.safeParse(JSON.parse(line));
      if (result.success && !isSkippedMessageType(result.data.type)) {
        raw.push(result.data);
      }
    } catch {}
  }
  return parse(raw, sessionId);
};
