"use server";

import { isNil } from "ramda";
import { revalidateTag } from "next/cache";

import { createClient } from "@/server/supabase/server";
import { sessionLikes } from "@/server/repos/sessionLikes";

export const getLikeStatus = async (sessionId: string): Promise<boolean> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isNil(user)) return false;

  return sessionLikes.hasLiked(supabase, sessionId, user.id);
};

export const like = async (sessionId: string) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isNil(user)) {
    throw new Error("Unauthorized");
  }

  const result = await sessionLikes.toggle(supabase, sessionId, user.id);
  revalidateTag(`thread:${sessionId}`, "max");
  return result;
};
