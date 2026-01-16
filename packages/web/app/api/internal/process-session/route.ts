import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import type {
  ContentBlock,
  RawContentBlock,
  RawJsonlMessage,
} from "@/lib/types/message";
import { BlockType, isSkippedMessageType } from "@/lib/types/message";

const BATCH_SIZE = 100;
const TEXT_PREVIEW_LENGTH = 500;

interface NormalizedMessage {
  session_id: string;
  idx: number;
  uuid: string;
  parent_uuid: string | null;
  type: string;
  role: string | null;
  model: string | null;
  timestamp: string;
  is_meta: boolean;
  is_sidechain: boolean;
  content: ContentBlock[];
  has_tool_calls: boolean;
  tool_names: string[];
  text_preview: string;
  raw_message: RawJsonlMessage;
}

/**
 * Transform a raw tool_use block into a specific typed block
 */
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
      // Fallback for unknown/MCP tools
      return { type: BlockType.TOOL_USE, id, name, input };
  }
};

// Input types for type casting
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

/**
 * Normalize raw content to ContentBlock array
 */
const normalizeContent = (
  content: string | RawContentBlock[] | undefined,
): ContentBlock[] => {
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

/**
 * Extract text content for preview
 */
const extractTextPreview = (content: ContentBlock[]): string => {
  const text = content
    .filter(
      (b): b is { type: "text"; text: string } => b.type === BlockType.TEXT,
    )
    .map((b) => b.text)
    .join("\n");

  return text.slice(0, TEXT_PREVIEW_LENGTH);
};

/**
 * Map block type back to tool name for indexing
 */
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

/**
 * Extract tool names from content blocks
 */
const extractToolNames = (content: ContentBlock[]): string[] => {
  return content
    .map((b) => {
      if (b.type === BlockType.TOOL_USE) return b.name;
      return BLOCK_TYPE_TO_TOOL[b.type];
    })
    .filter((name): name is string => !!name);
};

/**
 * Parse and normalize a raw JSONL message
 */
const normalizeMessage = (
  raw: RawJsonlMessage,
  sessionId: string,
  idx: number,
): NormalizedMessage | null => {
  // Skip non-conversation message types
  if (isSkippedMessageType(raw.type)) {
    return null;
  }

  const inner = raw.message;
  if (!inner) return null;

  const content = normalizeContent(inner.message?.content);
  const toolNames = extractToolNames(content);

  return {
    session_id: sessionId,
    idx,
    uuid: inner.uuid,
    parent_uuid: inner.parentUuid,
    type: raw.type,
    role: inner.message?.role || null,
    model: inner.model || null,
    timestamp: inner.timestamp,
    is_meta: inner.isMeta || false,
    is_sidechain: inner.isSidechain || false,
    content,
    has_tool_calls: toolNames.length > 0,
    tool_names: toolNames,
    text_preview: extractTextPreview(content),
    raw_message: raw,
  };
};

export const POST = async (request: Request): Promise<Response> => {
  // Verify internal request
  const secret = request.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { session_id } = await request.json();

  if (!session_id || typeof session_id !== "string") {
    return NextResponse.json({ error: "Invalid session_id" }, { status: 400 });
  }

  const supabase = createServiceClient();

  try {
    // Fetch session metadata
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("storage_path, status")
      .eq("id", session_id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.status !== "processing") {
      return NextResponse.json(
        { error: "Session already processed" },
        { status: 400 },
      );
    }

    if (!session.storage_path) {
      throw new Error("Session has no storage_path");
    }

    // Download JSONL from Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("sessions")
      .download(session.storage_path);

    if (downloadError || !fileData) {
      throw new Error(`Download failed: ${downloadError?.message}`);
    }

    const jsonlContent = await fileData.text();
    const lines = jsonlContent.split("\n").filter((line) => line.trim());

    // Parse and normalize messages
    const messages: NormalizedMessage[] = [];

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      try {
        const parsed = JSON.parse(line) as RawJsonlMessage;
        const normalized = normalizeMessage(parsed, session_id, idx);
        if (normalized) {
          messages.push(normalized);
        }
      } catch (parseError) {
        // Log but continue - don't fail entire session for one bad line
        console.error(`Line ${idx} parse error:`, parseError);
      }
    }

    // Insert in batches
    for (let i = 0; i < messages.length; i += BATCH_SIZE) {
      const batch = messages.slice(i, i + BATCH_SIZE);
      const { error: batchError } = await supabase
        .from("messages")
        .insert(batch);

      if (batchError) {
        throw new Error(`Batch insert failed at ${i}: ${batchError.message}`);
      }
    }

    // Update session to ready
    const { error: updateError } = await supabase
      .from("sessions")
      .update({
        status: "ready",
        message_count: messages.length,
      })
      .eq("id", session_id);

    if (updateError) {
      throw new Error(`Failed to update session: ${updateError.message}`);
    }

    return NextResponse.json({
      success: true,
      message_count: messages.length,
    });
  } catch (error) {
    // Mark session as failed
    const { error: updateError } = await supabase
      .from("sessions")
      .update({
        status: "failed",
        error_message: error instanceof Error ? error.message : String(error),
      })
      .eq("id", session_id);

    if (updateError) {
      console.error(
        `Failed to mark session ${session_id} as failed:`,
        updateError,
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
};
