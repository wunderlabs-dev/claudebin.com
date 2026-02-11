"use server";

import { isNil } from "ramda";

import { createClient } from "@/server/supabase/server";
import { sessions, type GetPublicThreadsResult } from "@/server/repos/sessions";

import { THREADS_PAGE_SIZE, THREADS_PAGE_INITIAL } from "@/utils/constants";

export const getPublicThreads = async (
  query?: string,
  offset = THREADS_PAGE_INITIAL,
  limit = THREADS_PAGE_SIZE,
): Promise<GetPublicThreadsResult> => {
  const supabase = await createClient();

  return sessions.getPublicThreads(supabase, {
    query,
    offset,
    limit,
  });
};

export const deleteThread = async (sessionId: string) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isNil(user)) {
    throw new Error("Unauthorized");
  }

  const session = await sessions.getByIdForUser(supabase, sessionId, user.id);

  if (isNil(session)) {
    throw new Error("Session not found or not owned by user");
  }

  if (session.storagePath) {
    await sessions.deleteFile(supabase, session.storagePath);
  }

  await sessions.delete(supabase, sessionId);
};
