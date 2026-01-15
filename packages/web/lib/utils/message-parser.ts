import type {
  ContentBlock,
  Message,
  RawContentBlock,
  RawJsonlMessage,
  Role,
} from "../types/message";
import { isSkippedMessageType } from "../types/message";

/**
 * Parse raw JSONL message into normalized Message format
 */
export const parseRawMessage = (raw: RawJsonlMessage): Message | null => {
  // Skip non-conversation messages
  if (isSkippedMessageType(raw.type)) {
    return null;
  }

  const inner = raw.message;

  // Skip meta messages (system instructions injected by plugins)
  if (inner.isMeta) {
    return null;
  }

  // Skip sidechain messages (internal branching)
  if (inner.isSidechain) {
    return null;
  }

  const role = inner.message?.role as Role;
  if (!role || (role !== "user" && role !== "assistant")) {
    return null;
  }

  return {
    id: inner.uuid,
    role,
    content: normalizeContent(inner.message.content),
    timestamp: new Date(inner.timestamp),
    model: inner.model,
    isMeta: inner.isMeta,
  };
};

/**
 * Normalize content to always be an array of ContentBlocks
 */
const normalizeContent = (
  content: string | RawContentBlock[] | undefined,
): ContentBlock[] => {
  if (!content) {
    return [];
  }

  if (typeof content === "string") {
    return [{ type: "text", text: content }];
  }

  return content.map(normalizeContentBlock);
};

/**
 * Normalize a single content block
 */
const normalizeContentBlock = (block: RawContentBlock): ContentBlock => {
  switch (block.type) {
    case "text":
      return { type: "text", text: block.text };

    case "tool_use":
      return {
        type: "tool_use",
        id: block.id,
        name: block.name,
        input: block.input,
      };

    case "tool_result":
      return {
        type: "tool_result",
        tool_use_id: block.tool_use_id,
        content: block.content,
        is_error: block.is_error,
      };

    default:
      // Unknown block type, treat as text
      return { type: "text", text: JSON.stringify(block) };
  }
};

/**
 * Extract plain text from content blocks (for search/preview)
 */
export const extractTextContent = (content: ContentBlock[]): string => {
  return content
    .filter(
      (block): block is { type: "text"; text: string } => block.type === "text",
    )
    .map((block) => block.text)
    .join("\n");
};

/**
 * Get tool calls from content blocks
 */
export const extractToolCalls = (
  content: ContentBlock[],
): Array<{ id: string; name: string; input: Record<string, unknown> }> => {
  return content
    .filter(
      (
        block,
      ): block is {
        type: "tool_use";
        id: string;
        name: string;
        input: Record<string, unknown>;
      } => block.type === "tool_use",
    )
    .map((block) => ({
      id: block.id,
      name: block.name,
      input: block.input,
    }));
};

/**
 * Parse multiple JSONL lines into Messages
 */
export const parseJsonlLines = (lines: string[]): Message[] => {
  const messages: Message[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    try {
      const raw = JSON.parse(line) as RawJsonlMessage;
      const message = parseRawMessage(raw);
      if (message) {
        messages.push(message);
      }
    } catch {
      // Skip malformed lines
      console.warn("Failed to parse JSONL line:", line.slice(0, 100));
    }
  }

  return messages;
};
