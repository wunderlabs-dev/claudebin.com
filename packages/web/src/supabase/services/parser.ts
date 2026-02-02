import type { ContentBlock, TaskItem, TasksBlock, ToolUseBlock } from "@/supabase/types/message";

import type { Json } from "@/supabase/types";

import { z } from "zod";

import { BlockType, MessageRole, isSkippedMessageType } from "@/supabase/types/message";
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

const ToolName = {
  ASK_USER_QUESTION: "AskUserQuestion",
  BASH: "Bash",
  READ: "Read",
  WRITE: "Write",
  EDIT: "Edit",
  GLOB: "Glob",
  GREP: "Grep",
  TASK: "Task",
  WEB_FETCH: "WebFetch",
  WEB_SEARCH: "WebSearch",
  TASK_CREATE: "TaskCreate",
  TASK_UPDATE: "TaskUpdate",
} as const;

const BLOCK_TYPE_TO_TOOL: Record<string, string> = {
  [BlockType.QUESTION]: ToolName.ASK_USER_QUESTION,
  [BlockType.BASH]: ToolName.BASH,
  [BlockType.FILE_READ]: ToolName.READ,
  [BlockType.FILE_WRITE]: ToolName.WRITE,
  [BlockType.FILE_EDIT]: ToolName.EDIT,
  [BlockType.GLOB]: ToolName.GLOB,
  [BlockType.GREP]: ToolName.GREP,
  [BlockType.TASK]: ToolName.TASK,
  [BlockType.WEB_FETCH]: ToolName.WEB_FETCH,
  [BlockType.WEB_SEARCH]: ToolName.WEB_SEARCH,
};

const TASK_TOOLS: string[] = [ToolName.TASK_CREATE, ToolName.TASK_UPDATE];

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

const isTaskToolBlock = (block: ContentBlock, taskToolIds: Set<string>): boolean => {
  if (block.type === BlockType.TOOL_USE) return taskToolIds.has(block.id);
  if (block.type === BlockType.TOOL_RESULT) return taskToolIds.has(block.tool_use_id);
  return false;
};

const parseToolInput = <T>(schema: z.ZodType<T>, input: Record<string, unknown>): T | null => {
  const result = schema.safeParse(input);
  return result.success ? result.data : null;
};

const transformToolUse = (
  id: string,
  name: string,
  input: Record<string, unknown>,
): ContentBlock => {
  const fallback: ContentBlock = { type: BlockType.TOOL_USE, id, name, input };

  switch (name) {
    case ToolName.ASK_USER_QUESTION: {
      const data = parseToolInput(ToolInputSchema.AskUserQuestion, input);
      return { type: BlockType.QUESTION, id, questions: data?.questions ?? [] };
    }
    case ToolName.BASH: {
      const data = parseToolInput(ToolInputSchema.Bash, input);
      return data ? { type: BlockType.BASH, id, ...data } : fallback;
    }
    case ToolName.READ: {
      const data = parseToolInput(ToolInputSchema.Read, input);
      return data ? { type: BlockType.FILE_READ, id, ...data } : fallback;
    }
    case ToolName.WRITE: {
      const data = parseToolInput(ToolInputSchema.Write, input);
      return data ? { type: BlockType.FILE_WRITE, id, ...data } : fallback;
    }
    case ToolName.EDIT: {
      const data = parseToolInput(ToolInputSchema.Edit, input);
      return data ? { type: BlockType.FILE_EDIT, id, ...data } : fallback;
    }
    case ToolName.GLOB: {
      const data = parseToolInput(ToolInputSchema.Glob, input);
      return data ? { type: BlockType.GLOB, id, ...data } : fallback;
    }
    case ToolName.GREP: {
      const data = parseToolInput(ToolInputSchema.Grep, input);
      return data ? { type: BlockType.GREP, id, ...data } : fallback;
    }
    case ToolName.TASK: {
      const data = parseToolInput(ToolInputSchema.Task, input);
      return data ? { type: BlockType.TASK, id, ...data } : fallback;
    }
    case ToolName.WEB_FETCH: {
      const data = parseToolInput(ToolInputSchema.WebFetch, input);
      return data ? { type: BlockType.WEB_FETCH, id, ...data } : fallback;
    }
    case ToolName.WEB_SEARCH: {
      const data = parseToolInput(ToolInputSchema.WebSearch, input);
      return data ? { type: BlockType.WEB_SEARCH, id, ...data } : fallback;
    }
    default:
      return fallback;
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

const normalizeContent = (content: string | RawContentBlock[] | undefined): ContentBlock[] => {
  if (!content) return [];
  if (typeof content === "string") return [{ type: BlockType.TEXT, text: content }];
  return content.map(normalizeBlock);
};

type IntermediateMessage = { raw: RawJsonlMessage; content: ContentBlock[] };

const parse = (rawMessages: RawJsonlMessage[], sessionId: string): ParsedMessage[] => {
  // Phase 1: Coalesce + normalize in single pass
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

  // Phase 2: Build task state
  const tasks = new Map<string, TaskItem>();
  const taskIds = new Map<number, Set<string>>();

  for (const [idx, { content }] of intermediate.entries()) {
    const ids = new Set<string>();
    const toolUseById = new Map<string, ToolUseBlock>();

    for (const block of content) {
      if (block.type === BlockType.TOOL_USE && TASK_TOOLS.includes(block.name)) {
        ids.add(block.id);
        toolUseById.set(block.id, block);
      }

      if (block.type === BlockType.TOOL_RESULT && ids.has(block.tool_use_id)) {
        const taskId = extractTaskId(block.content);
        if (!taskId) continue;

        const toolUse = toolUseById.get(block.tool_use_id);
        if (!toolUse) continue;

        if (toolUse.name === ToolName.TASK_CREATE) {
          const parsed = ToolInputSchema.TaskCreate.safeParse(toolUse.input);
          if (parsed.success) {
            tasks.set(taskId, createTaskFromToolUse(taskId, parsed.data));
          }
        }

        if (toolUse.name === ToolName.TASK_UPDATE) {
          const parsed = ToolInputSchema.TaskUpdate.safeParse(toolUse.input);
          const existingTask = tasks.get(taskId);
          if (parsed.success && existingTask && parsed.data.status) {
            tasks.set(taskId, { ...existingTask, status: parsed.data.status });
          }
        }
      }
    }

    if (ids.size > 0) taskIds.set(idx, ids);
  }

  // Phase 3: Build final messages
  return intermediate.map(({ raw, content }, idx) => {
    let finalContent = content;

    const taskToolIds = taskIds.get(idx);
    if (taskToolIds && tasks.size > 0) {
      const tasksSummary: TasksBlock = { type: BlockType.TASKS, tasks: Array.from(tasks.values()) };
      let summaryInserted = false;

      finalContent = content.reduce<ContentBlock[]>((acc, block) => {
        if (isTaskToolBlock(block, taskToolIds)) {
          if (!summaryInserted) {
            acc.push(tasksSummary);
            summaryInserted = true;
          }
        } else {
          acc.push(block);
        }
        return acc;
      }, []);
    }

    const toolNames = finalContent
      .map((block) =>
        block.type === BlockType.TOOL_USE ? block.name : BLOCK_TYPE_TO_TOOL[block.type],
      )
      .filter((name): name is string => Boolean(name));

    const textPreview = finalContent
      .filter((b): b is { type: "text"; text: string } => b.type === BlockType.TEXT)
      .map((b) => b.text)
      .join("\n")
      .slice(0, 500);

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
    } catch {
      // Skip malformed JSON lines
    }
  }
  return parse(raw, sessionId);
};
