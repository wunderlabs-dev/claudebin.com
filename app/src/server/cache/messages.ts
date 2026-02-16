"use cache";

import { cacheLife, cacheTag } from "next/cache";

import { createServiceClient } from "@/server/supabase/service";
import { messages, type PaginatedMessages } from "@/server/repos/messages";

// ABOUTME: Cached messages fetch — messages are immutable after session processing
// Uses service client to bypass RLS (access control happens at page level)
export const getCachedMessages = async (sessionId: string): Promise<PaginatedMessages> => {
  cacheLife("max");
  cacheTag(`messages:${sessionId}`);

  const supabase = createServiceClient();
  return messages.getBySessionId(supabase, sessionId);
};
