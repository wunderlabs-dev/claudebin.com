import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { messages } from "@/lib/repos/messages.repo";
import { sessions } from "@/lib/repos/sessions.repo";
import type { Database } from "@/lib/supabase/database.types";
import { SessionStatus } from "@/src/trpc/routers/sessions";
import { parseJsonlMessages } from "./parser";

const DEFAULT_BATCH_SIZE = 100;

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

    const jsonlContent = await sessions.downloadJsonl(
      supabase,
      session.storagePath,
    );

    const parsedMessages = parseJsonlMessages(jsonlContent, sessionId);

    // Insert in parallel batches
    const inserts = [];
    for (let i = 0; i < parsedMessages.length; i += batchSize) {
      inserts.push(
        messages.insertBatch(supabase, parsedMessages.slice(i, i + batchSize)),
      );
    }
    await Promise.all(inserts);

    await sessions.update(supabase, sessionId, {
      status: SessionStatus.READY,
      messageCount: parsedMessages.length,
    });
  } catch (error) {
    await sessions.update(supabase, sessionId, {
      status: SessionStatus.FAILED,
      errorMessage: error instanceof Error ? error.message : String(error),
    });
  }
};
