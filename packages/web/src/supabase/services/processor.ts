import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/supabase/types";
import type { Json } from "@/supabase/types";
import type { ParsedMessage } from "@/supabase/services/parser";

import { messages } from "@/supabase/repos/messages";
import { parseJsonl } from "@/supabase/services/parser";
import { sessions } from "@/supabase/repos/sessions";
import { SessionStatus } from "@/trpc/routers/sessions";
import { BlockType } from "@/supabase/types/message";
import { generateTitle } from "@/utils/openrouter";

const DEFAULT_BATCH_SIZE = 100;
const AUTO_TITLE_MAX_LENGTH = 100;
const FILE_BLOCK_TYPES = [BlockType.FILE_READ, BlockType.FILE_WRITE, BlockType.FILE_EDIT];

type SessionMetadata = {
  workingDir: string | null;
  fileCount: number;
  messageCount: number;
  title: string | null;
};

type ContentBlockJson = {
  type: string;
  file_path?: string;
};

const getWorkingDir = (rawMessage: Json): string | null => {
  if (typeof rawMessage === "object" && rawMessage !== null && "cwd" in rawMessage) {
    const cwd = (rawMessage as Record<string, unknown>).cwd;
    return typeof cwd === "string" ? cwd : null;
  }
  return null;
};

const getFilePaths = (content: Json): string[] => {
  if (!Array.isArray(content)) return [];

  const paths: string[] = [];
  for (const block of content as ContentBlockJson[]) {
    if (FILE_BLOCK_TYPES.includes(block.type as typeof BlockType.FILE_READ) && block.file_path) {
      paths.push(block.file_path);
    }
  }
  return paths;
};

const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > 0 ? `${truncated.slice(0, lastSpace)}...` : `${truncated}...`;
};

const fallbackTitle = (text: string): string | null => {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const firstLine = trimmed.split("\n")[0].trim();
  return truncate(firstLine, AUTO_TITLE_MAX_LENGTH);
};

const createAccumulator = (existingTitle: string | null) => {
  let workingDir: string | null = null;
  let firstMessageText: string | null = null;
  let messageCount = 0;
  const filePaths = new Set<string>();

  const resolveTitle = async (): Promise<string | null> => {
    if (existingTitle) return existingTitle;

    if (firstMessageText) {
      const llmTitle = await generateTitle(firstMessageText);
      if (llmTitle) return llmTitle;
      return fallbackTitle(firstMessageText);
    }

    return null;
  };

  return {
    process: (message: ParsedMessage) => {
      if (workingDir === null) {
        workingDir = getWorkingDir(message.rawMessage);
      }

      for (const path of getFilePaths(message.content)) {
        filePaths.add(path);
      }

      const isCountable = !message.isMeta && !message.isSidechain;
      if (isCountable) {
        if (firstMessageText === null) {
          firstMessageText = message.textPreview;
        }
        messageCount += 1;
      }
    },

    getResult: async (): Promise<SessionMetadata> => ({
      workingDir,
      fileCount: filePaths.size,
      messageCount,
      title: await resolveTitle(),
    }),
  };
};

type ValidatedSession = {
  title: string | null;
  storagePath: string;
};

const validate = async (
  supabase: SupabaseClient<Database>,
  sessionId: string,
): Promise<ValidatedSession | null> => {
  const session = await sessions.getById(supabase, sessionId);

  if (!session) {
    console.error(`Session ${sessionId} not found`);
    return null;
  }

  if (session.status !== SessionStatus.PROCESSING) {
    return null;
  }

  if (!session.storagePath) {
    console.error(`Session ${sessionId} has no storage_path`);
    return null;
  }

  return {
    title: session.title,
    storagePath: session.storagePath,
  };
};

export const processSession = async (
  supabase: SupabaseClient<Database>,
  sessionId: string,
  batchSize = DEFAULT_BATCH_SIZE,
): Promise<void> => {
  const session = await validate(supabase, sessionId);
  if (!session) return;

  try {
    const jsonl = await sessions.downloadJsonl(supabase, session.storagePath);
    const allMessages = parseJsonl(jsonl, sessionId);
    const accumulator = createAccumulator(session.title);

    for (const message of allMessages) {
      accumulator.process(message);
    }

    for (let i = 0; i < allMessages.length; i += batchSize) {
      await messages.insertBatch(supabase, allMessages.slice(i, i + batchSize));
    }

    const metadata = await accumulator.getResult();

    await sessions.update(supabase, sessionId, {
      status: SessionStatus.READY,
      messageCount: metadata.messageCount,
      workingDir: metadata.workingDir,
      fileCount: metadata.fileCount,
      title: metadata.title,
    });
  } catch (error) {
    await sessions.update(supabase, sessionId, {
      status: SessionStatus.FAILED,
      errorMessage: error instanceof Error ? error.message : String(error),
    });
  }
};
