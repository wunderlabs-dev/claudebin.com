"use server";

import { isNil } from "ramda";

import { createClient } from "@/server/supabase/server";
import { sessionLikes } from "@/server/repos/sessionLikes";

export const getLikeStatus = async (sessionId: string) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isNil(user)) {
    return null;
  }

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

  // TODO: Re-add revalidateTag once cacheComponents is re-enabled
  return result;
};
