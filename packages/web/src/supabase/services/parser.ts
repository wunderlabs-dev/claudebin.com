import type { Json } from "@/supabase/types";
import { contentBlocksToJson, toJson } from "@/supabase/types/json-cast";
import type { ContentBlock, RawContentBlock, RawJsonlMessage } from "@/supabase/types/message";
import { BlockType, isSkippedMessageType } from "@/supabase/types/message";

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

interface TodoInput {
  content: string;
  status: "pending" | "in_progress" | "completed";
  activeForm: string;
}

// =============================================================================
// Tool Transformation
// =============================================================================

const BLOCK_TYPE_TO_TOOL: Record<string, string> = {
  [BlockType.QUESTION]: "AskUserQuestion",
  [BlockType.TODO]: "TodoWrite",
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
    case "TodoWrite":
      return {
        type: BlockType.TODO,
        id,
        todos: (input.todos as TodoInput[]) || [],
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
// Content Normalization
// =============================================================================

const normalizeContent = (content: string | RawContentBlock[] | undefined): ContentBlock[] => {
  if (!content) return [];

  if (typeof content === "string") {
    return [{ type: BlockType.TEXT, text: content }];
  }

  return content.map((block): ContentBlock => {
    switch (block.type) {
      case "text":
        return { type: BlockType.TEXT, text: block.text };
      case "tool_use":
        return transformToolUse(block.id, block.name, block.input);
      case "tool_result":
        return {
          type: BlockType.TOOL_RESULT,
          tool_use_id: block.tool_use_id,
          content: block.content,
          is_error: block.is_error,
        };
      default:
        return { type: BlockType.TEXT, text: JSON.stringify(block) };
    }
  });
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
    role: raw.message.role || null,
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
// Public API
// =============================================================================

export const parseJsonlMessages = (jsonlContent: string, sessionId: string): ParsedMessage[] => {
  const lines = jsonlContent.split("\n").filter((line) => line.trim());
  const messages: ParsedMessage[] = [];

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    try {
      const parsed = JSON.parse(line) as RawJsonlMessage;
      const normalized = normalizeMessage(parsed, sessionId, idx);
      if (normalized) {
        messages.push(normalized);
      }
    } catch (parseError) {
      console.error(`Line ${idx} parse error:`, parseError);
    }
  }

  return messages;
};

export async function* parseJsonlStream(
  stream: ReadableStream<Uint8Array>,
  sessionId: string,
): AsyncGenerator<ParsedMessage> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let idx = 0;

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
          const normalized = normalizeMessage(raw, sessionId, idx++);
          if (normalized) yield normalized;
        } catch (e) {
          console.error(`Line ${idx} parse error:`, e);
        }
      }
    }

    if (buffer.trim()) {
      try {
        const raw = JSON.parse(buffer) as RawJsonlMessage;
        const normalized = normalizeMessage(raw, sessionId, idx);
        if (normalized) yield normalized;
      } catch (e) {
        console.error(`Final line parse error:`, e);
      }
    }
  } finally {
    reader.releaseLock();
  }
}
