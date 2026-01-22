import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/supabase/types";
import type { ParsedMessage } from "@/supabase/services/parser";

import { messages } from "@/supabase/repos/messages";
import { parseJsonlStream } from "@/supabase/services/parser";
import { sessions } from "@/supabase/repos/sessions";
import { SessionStatus } from "@/trpc/routers/sessions";

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

    const stream = await sessions.downloadJsonlStream(supabase, session.storagePath);

    let batch: ParsedMessage[] = [];
    let total = 0;

    for await (const message of parseJsonlStream(stream, sessionId)) {
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

    await sessions.update(supabase, sessionId, {
      status: SessionStatus.READY,
      messageCount: total,
    });
  } catch (error) {
    await sessions.update(supabase, sessionId, {
      status: SessionStatus.FAILED,
      errorMessage: error instanceof Error ? error.message : String(error),
    });
  }
};
