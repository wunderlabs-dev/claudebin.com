import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import type {
  ContentBlock,
  RawContentBlock,
  RawJsonlMessage,
  ToolUseBlock,
} from "@/lib/types/message";
import {
  BlockType,
  isSkippedMessageType,
  isToolUseBlock,
} from "@/lib/types/message";

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
      case BlockType.TEXT:
        return { type: BlockType.TEXT, text: block.text };
      case BlockType.TOOL_USE:
        return {
          type: BlockType.TOOL_USE,
          id: block.id,
          name: block.name,
          input: block.input,
        };
      case BlockType.TOOL_RESULT:
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
    .filter((b): b is { type: "text"; text: string } => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  return text.slice(0, TEXT_PREVIEW_LENGTH);
};

/**
 * Extract tool names from content blocks
 */
const extractToolNames = (content: ContentBlock[]): string[] => {
  return content.filter(isToolUseBlock).map((b: ToolUseBlock) => b.name);
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
