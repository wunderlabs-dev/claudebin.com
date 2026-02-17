import { unstable_cache } from "next/cache";

import { createServiceClient } from "@/server/supabase/service";
import { messages, type PaginatedMessages } from "@/server/repos/messages";

// ABOUTME: Messages fetch — messages are immutable after session processing
// Uses service client to bypass RLS (access control happens at page level)
// Cached indefinitely — messages never change after processing
export const getCachedMessages = (sessionId: string): Promise<PaginatedMessages> =>
  unstable_cache(
    async () => {
      const supabase = createServiceClient();
      return messages.getBySessionId(supabase, sessionId);
    },
    ["messages", sessionId],
  )();
