"use server";

import { createClient } from "@/supabase/server";
import { sessions, type GetPublicThreadsResult } from "@/supabase/repos/sessions";
import { THREADS_PAGE_SIZE } from "@/utils/constants";

export const getPublicThreads = async (
  query: string,
  offset = 0,
  limit = THREADS_PAGE_SIZE,
): Promise<GetPublicThreadsResult> => {
  const supabase = await createClient();
  return sessions.getPublicThreads(supabase, { query, offset, limit });
};
