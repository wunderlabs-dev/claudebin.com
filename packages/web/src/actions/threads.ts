"use server";

import { createClient } from "@/supabase/server";
import { sessions, type GetPublicThreadsResult } from "@/supabase/repos/sessions";

import { THREADS_DEFAULT_OFFSET, THREADS_PAGE_SIZE } from "@/utils/constants";

export const getPublicThreads = async (
  query: string,
  offset = THREADS_DEFAULT_OFFSET,
  limit = THREADS_PAGE_SIZE,
): Promise<GetPublicThreadsResult> => {
  const supabase = await createClient();
  return sessions.getPublicThreads(supabase, { query, offset, limit });
};
