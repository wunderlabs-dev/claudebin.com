"use server";

import { createClient } from "@/supabase/server";
import { sessions, type GetPublicThreadsResult } from "@/supabase/repos/sessions";

export const searchThreads = async (
  query: string,
  offset = 0,
  limit = 20,
): Promise<GetPublicThreadsResult> => {
  const supabase = await createClient();
  return sessions.getPublicThreads(supabase, { query, offset, limit });
};
