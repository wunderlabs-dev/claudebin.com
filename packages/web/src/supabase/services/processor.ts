import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/supabase/types";
import type { Json } from "@/supabase/types";
import type { ParsedMessage } from "@/supabase/services/parser";

import { messages } from "@/supabase/repos/messages";
import { parseJsonlStream } from "@/supabase/services/parser";
import { sessions } from "@/supabase/repos/sessions";
import { SessionStatus } from "@/trpc/routers/sessions";
import { BlockType } from "@/supabase/types/message";

const DEFAULT_BATCH_SIZE = 100;
const AUTO_TITLE_MAX_LENGTH = 100;

// =============================================================================
// Metadata Extraction
// =============================================================================

type SessionMetadata = {
  workingDir: string | null;
  fileCount: number;
  autoTitle: string | null;
};

type ContentBlockJson = {
  type: string;
  file_path?: string;
};

// ABOUTME: Extracts cwd from the raw JSONL message for workingDir
const extractWorkingDir = (rawMessage: Json): string | null => {
  if (typeof rawMessage === "object" && rawMessage !== null && "cwd" in rawMessage) {
    const cwd = (rawMessage as Record<string, unknown>).cwd;
    return typeof cwd === "string" ? cwd : null;
  }
  return null;
};

// ABOUTME: Extracts file paths from content blocks (FILE_READ, FILE_WRITE, FILE_EDIT)
const extractFilePaths = (content: Json): string[] => {
  if (!Array.isArray(content)) return [];

  const fileTypes = [BlockType.FILE_READ, BlockType.FILE_WRITE, BlockType.FILE_EDIT];
  const paths: string[] = [];

  for (const block of content as ContentBlockJson[]) {
    if (fileTypes.includes(block.type as typeof BlockType.FILE_READ) && block.file_path) {
      paths.push(block.file_path);
    }
  }

  return paths;
};

// ABOUTME: Generates auto-title from first user message text
const generateAutoTitle = (textPreview: string): string | null => {
  if (!textPreview.trim()) return null;

  // Take first line or first N characters
  const firstLine = textPreview.split("\n")[0].trim();
  if (firstLine.length <= AUTO_TITLE_MAX_LENGTH) {
    return firstLine;
  }

  // Truncate at word boundary
  const truncated = firstLine.slice(0, AUTO_TITLE_MAX_LENGTH);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > 0 ? `${truncated.slice(0, lastSpace)}...` : `${truncated}...`;
};

export const processSession = async (
  supabase: SupabaseClient<Database>,
  sessionId: string,
  batchSize = DEFAULT_BATCH_SIZE,
): Promise<void> => {
  try {
    const session = await sessions.getById(supabase, sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    if (session.status !== SessionStatus.PROCESSING) {
      return; // Already processed
    }

    if (!session.storagePath) {
      throw new Error("Session has no storage_path");
    }

    const stream = await sessions.downloadJsonlStream(supabase, session.storagePath);

    let batch: ParsedMessage[] = [];
    let total = 0;

    // Metadata extraction state
    const metadata: SessionMetadata = {
      workingDir: null,
      fileCount: 0,
      autoTitle: null,
    };
    const seenFilePaths = new Set<string>();
    let foundFirstUserMessage = false;

    for await (const message of parseJsonlStream(stream, sessionId)) {
      // Extract workingDir from first message
      if (metadata.workingDir === null) {
        metadata.workingDir = extractWorkingDir(message.rawMessage);
      }

      // Extract auto-title from first user message
      if (!foundFirstUserMessage && message.role === "user" && message.textPreview) {
        metadata.autoTitle = generateAutoTitle(message.textPreview);
        foundFirstUserMessage = true;
      }

      // Collect unique file paths
      for (const filePath of extractFilePaths(message.content)) {
        seenFilePaths.add(filePath);
      }

      batch.push(message);
      if (batch.length >= batchSize) {
        await messages.insertBatch(supabase, batch);
        total += batch.length;
        batch = [];
      }
    }

    if (batch.length > 0) {
      await messages.insertBatch(supabase, batch);
      total += batch.length;
    }

    metadata.fileCount = seenFilePaths.size;

    // Use auto-title only if session has no title
    const title = session.title || metadata.autoTitle;

    await sessions.update(supabase, sessionId, {
      status: SessionStatus.READY,
      messageCount: total,
      workingDir: metadata.workingDir,
      fileCount: metadata.fileCount,
      title,
    });
  } catch (error) {
    await sessions.update(supabase, sessionId, {
      status: SessionStatus.FAILED,
      errorMessage: error instanceof Error ? error.message : String(error),
    });
  }
};
