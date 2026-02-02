import type {
  ContentBlock,
  RawContentBlock,
  RawJsonlMessage,
  TaskItem,
  TasksBlock,
  ToolUseBlock,
} from "@/supabase/types/message";
import type { Json } from "@/supabase/types";

import { BlockType, isSkippedMessageType } from "@/supabase/types/message";
import { contentBlocksToJson, toJson } from "@/supabase/types/json-cast";
import { logger } from "@/utils/logger";

const TEXT_PREVIEW_LENGTH = 500;

// =============================================================================
// Types
// =============================================================================

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

interface QuestionInput {
  question: string;
  header: string;
  options: Array<{ label: string; description: string }>;
  multiSelect: boolean;
}

// =============================================================================
// Tool Transformation
// =============================================================================

const BLOCK_TYPE_TO_TOOL: Record<string, string> = {
  [BlockType.QUESTION]: "AskUserQuestion",
  [BlockType.BASH]: "Bash",
  [BlockType.FILE_READ]: "Read",
  [BlockType.FILE_WRITE]: "Write",
  [BlockType.FILE_EDIT]: "Edit",
  [BlockType.GLOB]: "Glob",
  [BlockType.GREP]: "Grep",
  [BlockType.TASK]: "Task",
  [BlockType.WEB_FETCH]: "WebFetch",
  [BlockType.WEB_SEARCH]: "WebSearch",
};

const transformToolUse = (
  id: string,
  name: string,
  input: Record<string, unknown>,
): ContentBlock => {
  switch (name) {
    case "AskUserQuestion":
      return {
        type: BlockType.QUESTION,
        id,
        questions: (input.questions as QuestionInput[]) || [],
      };
    case "Bash":
      return {
        type: BlockType.BASH,
        id,
        command: (input.command as string) || "",
        description: input.description as string | undefined,
        timeout: input.timeout as number | undefined,
      };
    case "Read":
      return {
        type: BlockType.FILE_READ,
        id,
        file_path: (input.file_path as string) || "",
        offset: input.offset as number | undefined,
        limit: input.limit as number | undefined,
      };
    case "Write":
      return {
        type: BlockType.FILE_WRITE,
        id,
        file_path: (input.file_path as string) || "",
        content: (input.content as string) || "",
      };
    case "Edit":
      return {
        type: BlockType.FILE_EDIT,
        id,
        file_path: (input.file_path as string) || "",
        old_string: (input.old_string as string) || "",
        new_string: (input.new_string as string) || "",
      };
    case "Glob":
      return {
        type: BlockType.GLOB,
        id,
        pattern: (input.pattern as string) || "",
        path: input.path as string | undefined,
      };
    case "Grep":
      return {
        type: BlockType.GREP,
        id,
        pattern: (input.pattern as string) || "",
        path: input.path as string | undefined,
        glob: input.glob as string | undefined,
      };
    case "Task":
      return {
        type: BlockType.TASK,
        id,
        description: (input.description as string) || "",
        prompt: (input.prompt as string) || "",
        subagent_type: (input.subagent_type as string) || "",
      };
    case "WebFetch":
      return {
        type: BlockType.WEB_FETCH,
        id,
        url: (input.url as string) || "",
        prompt: (input.prompt as string) || "",
      };
    case "WebSearch":
      return {
        type: BlockType.WEB_SEARCH,
        id,
        query: (input.query as string) || "",
      };
    default:
      return { type: BlockType.TOOL_USE, id, name, input };
  }
};

// =============================================================================
// Task Aggregation Helpers
// =============================================================================

const extractTaskId = (content: string): string | null => {
  const match = content.match(/(?:Task |task )#(\d+)/i);
  return match ? match[1] : null;
};

const isTaskTool = (name: string): boolean =>
  ["TaskCreate", "TaskUpdate", "TaskGet", "TaskList"].includes(name);

// =============================================================================
// Content Normalization
// =============================================================================

const normalizeContent = (content: string | RawContentBlock[] | undefined): ContentBlock[] => {
  if (!content) return [];

  if (typeof content === "string") {
    return [{ type: BlockType.TEXT, text: content }];
  }

  const normalized = content.map((block): ContentBlock => {
    switch (block.type) {
      case "text":
        return { type: BlockType.TEXT, text: block.text };
      case "tool_use":
        return transformToolUse(block.id, block.name, block.input);
      case "tool_result": {
        // Content can be string, array of content blocks, or single content block
        const extractText = (c: unknown): string => {
          if (typeof c === "string") return c;
          if (Array.isArray(c)) return c.map(extractText).join("\n");
          if (c && typeof c === "object" && "type" in c) {
            const contentBlock = c as { type: string; text?: string };
            return contentBlock.type === "text" && contentBlock.text
              ? contentBlock.text
              : JSON.stringify(c);
          }
          return JSON.stringify(c);
        };
        return {
          type: BlockType.TOOL_RESULT,
          tool_use_id: block.tool_use_id,
          content: extractText(block.content),
          is_error: block.is_error,
        };
      }
      case "thinking": {
        const thinkingBlock = block as { type: "thinking"; thinking: string; signature?: string };
        return {
          type: BlockType.THINKING,
          thinking: thinkingBlock.thinking,
          signature: thinkingBlock.signature,
        };
      }
      default:
        return { type: BlockType.TEXT, text: JSON.stringify(block) };
    }
  });

  return aggregateTaskBlocks(normalized);
};

// =============================================================================
// Task Block Aggregation
// =============================================================================

const aggregateTaskBlocks = (content: ContentBlock[]): ContentBlock[] => {
  const result: ContentBlock[] = [];
  const taskMap = new Map<string, TaskItem>();
  const taskToolUseIds = new Set<string>();

  // First pass: identify task tool_use blocks
  for (const block of content) {
    if (block.type === BlockType.TOOL_USE && isTaskTool(block.name)) {
      taskToolUseIds.add(block.id);
    }
  }

  // If no task tools, return content unchanged
  if (taskToolUseIds.size === 0) return content;

  // Second pass: match tool_results to tool_uses, build task state
  for (const block of content) {
    if (block.type === BlockType.TOOL_RESULT && taskToolUseIds.has(block.tool_use_id)) {
      const taskId = extractTaskId(block.content);
      if (!taskId) continue;

      // Find corresponding tool_use
      const toolUse = content.find(
        (b): b is ToolUseBlock => b.type === BlockType.TOOL_USE && b.id === block.tool_use_id,
      );

      if (toolUse) {
        if (toolUse.name === "TaskCreate") {
          taskMap.set(taskId, {
            id: taskId,
            subject: (toolUse.input.subject as string) || "",
            description: toolUse.input.description as string | undefined,
            status: "pending",
          });
        } else if (toolUse.name === "TaskUpdate") {
          const existing = taskMap.get(taskId);
          if (existing && toolUse.input.status) {
            taskMap.set(taskId, {
              ...existing,
              status: toolUse.input.status as TaskItem["status"],
            });
          }
        }
      }
    }
  }

  // Third pass: build result, replacing task tools with TASKS block
  let tasksBlockInserted = false;

  for (const block of content) {
    const isTaskToolUse = block.type === BlockType.TOOL_USE && taskToolUseIds.has(block.id);
    const isTaskResult =
      block.type === BlockType.TOOL_RESULT && taskToolUseIds.has(block.tool_use_id);

    if (isTaskToolUse || isTaskResult) {
      if (!tasksBlockInserted && taskMap.size > 0) {
        result.push({
          type: BlockType.TASKS,
          tasks: Array.from(taskMap.values()),
        } as TasksBlock);
        tasksBlockInserted = true;
      }
      // Skip - aggregated into TASKS block
    } else {
      result.push(block);
    }
  }

  return result;
};

// =============================================================================
// Extraction Helpers
// =============================================================================

const extractTextPreview = (content: ContentBlock[]): string => {
  const text = content
    .filter((b): b is { type: "text"; text: string } => b.type === BlockType.TEXT)
    .map((b) => b.text)
    .join("\n");

  return text.slice(0, TEXT_PREVIEW_LENGTH);
};

const extractToolNames = (content: ContentBlock[]): string[] => {
  return content
    .map((b) => {
      if (b.type === BlockType.TOOL_USE) return b.name;
      return BLOCK_TYPE_TO_TOOL[b.type];
    })
    .filter((name): name is string => !!name);
};

// =============================================================================
// Message Normalization
// =============================================================================

const normalizeMessage = (
  raw: RawJsonlMessage,
  sessionId: string,
  idx: number,
): ParsedMessage | null => {
  if (isSkippedMessageType(raw.type)) {
    return null;
  }

  if (!raw.message) return null;

  const content = normalizeContent(raw.message.content);
  const toolNames = extractToolNames(content);

  return {
    sessionId,
    idx,
    uuid: raw.uuid,
    parentUuid: raw.parentUuid,
    type: raw.type,
    role: raw.type === "user" ? "user" : "assistant",
    model: raw.message.model || null,
    timestamp: raw.timestamp,
    isMeta: raw.isMeta || false,
    isSidechain: raw.isSidechain || false,
    content: contentBlocksToJson(content),
    hasToolCalls: toolNames.length > 0,
    toolNames,
    textPreview: extractTextPreview(content),
    rawMessage: toJson(raw),
  };
};

// =============================================================================
// Message Coalescing
// =============================================================================

const isToolResultContent = (content: string | RawContentBlock[] | undefined): boolean => {
  if (!content || typeof content === "string") return false;
  return content.length > 0 && content[0].type === "tool_result";
};

const mergeRawContent = (
  base: string | RawContentBlock[] | undefined,
  addition: string | RawContentBlock[] | undefined,
): RawContentBlock[] => {
  const toBlocks = (c: string | RawContentBlock[] | undefined): RawContentBlock[] => {
    if (!c) return [];
    if (typeof c === "string") return [{ type: "text", text: c }];
    return c;
  };
  return [...toBlocks(base), ...toBlocks(addition)];
};

const coalesceMessages = (rawMessages: RawJsonlMessage[]): RawJsonlMessage[] => {
  if (rawMessages.length === 0) return [];

  const result: RawJsonlMessage[] = [];
  let current: RawJsonlMessage | null = null;
  let currentMsgId: string | null = null;
  let currentIsAssistant = false;

  for (const raw of rawMessages) {
    const rawMessage = raw.message;
    const msgId = rawMessage.id ?? null;
    const isToolResult = isToolResultContent(rawMessage.content);

    // Merge conditions:
    // 1. Same assistant message.id (streaming chunks)
    // 2. Tool results following an assistant message (tool call + result = one turn)
    const shouldMerge =
      current !== null &&
      ((raw.type === "assistant" && msgId && msgId === currentMsgId) ||
        (isToolResult && currentIsAssistant));

    if (shouldMerge) {
      const prev = current as RawJsonlMessage;
      const mergedContent = mergeRawContent(prev.message.content, rawMessage.content);
      current = {
        ...prev,
        message: {
          ...prev.message,
          content: mergedContent,
        },
      };
      // Keep currentIsAssistant true so more tool_results can merge
    } else {
      if (current !== null) result.push(current);
      current = { ...raw, message: { ...rawMessage } };
      currentMsgId = msgId;
      currentIsAssistant = raw.type === "assistant";
    }
  }

  if (current !== null) result.push(current);
  return result;
};

// =============================================================================
// Public API
// =============================================================================

export const parseJsonlMessages = (jsonlContent: string, sessionId: string): ParsedMessage[] => {
  const lines = jsonlContent.split("\n").filter((line) => line.trim());
  const rawMessages: RawJsonlMessage[] = [];

  for (const line of lines) {
    try {
      const parsed = JSON.parse(line) as RawJsonlMessage;
      if (!isSkippedMessageType(parsed.type) && parsed.message) {
        rawMessages.push(parsed);
      }
    } catch (parseError) {
      logger.parser.error("Parse error", parseError);
    }
  }

  const coalesced = coalesceMessages(rawMessages);

  return coalesced
    .map((raw, idx) => normalizeMessage(raw, sessionId, idx))
    .filter((msg): msg is ParsedMessage => msg !== null);
};

export async function* parseJsonlStream(
  stream: ReadableStream<Uint8Array>,
  sessionId: string,
): AsyncGenerator<ParsedMessage> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const rawMessages: RawJsonlMessage[] = [];

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const raw = JSON.parse(line) as RawJsonlMessage;
          if (!isSkippedMessageType(raw.type) && raw.message) {
            rawMessages.push(raw);
          }
        } catch (e) {
          logger.parser.error("Line parse error", e);
        }
      }
    }

    if (buffer.trim()) {
      try {
        const raw = JSON.parse(buffer) as RawJsonlMessage;
        if (!isSkippedMessageType(raw.type) && raw.message) {
          rawMessages.push(raw);
        }
      } catch (e) {
        logger.parser.error("Final line parse error", e);
      }
    }

    const coalesced = coalesceMessages(rawMessages);
    for (let idx = 0; idx < coalesced.length; idx++) {
      const normalized = normalizeMessage(coalesced[idx], sessionId, idx);
      if (normalized) yield normalized;
    }
  } finally {
    reader.releaseLock();
  }
}
