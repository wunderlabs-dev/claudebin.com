"use server";

import { createClient } from "@/supabase/server";
import { sessions, type GetPublicThreadsResult } from "@/supabase/repos/sessions";

const THREADS_PAGE_SIZE = 20;
const THREADS_DEFAULT_OFFSET = 0;

export const getPublicThreads = async (
  query: string,
  offset = THREADS_DEFAULT_OFFSET,
  limit = THREADS_PAGE_SIZE,
): Promise<GetPublicThreadsResult> => {
  const supabase = await createClient();

  return sessions.getPublicThreads(supabase, {
    query,
    offset,
    limit,
  });
};
