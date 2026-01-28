import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/supabase/types";

const hasLiked = async (
  supabase: SupabaseClient<Database>,
  sessionId: string,
  userId: string,
): Promise<boolean> => {
  const { data } = await supabase
    .from("session_likes")
    .select("id")
    .eq("sessionId", sessionId)
    .eq("userId", userId)
    .single();

  return !!data;
};

const toggle = async (
  supabase: SupabaseClient<Database>,
  sessionId: string,
  userId: string,
): Promise<boolean> => {
  const liked = await hasLiked(supabase, sessionId, userId);

  if (liked) {
    await supabase.from("session_likes").delete().eq("sessionId", sessionId).eq("userId", userId);
    return false;
  }

  await supabase.from("session_likes").insert({ sessionId, userId });
  return true;
};

export const sessionLikes = {
  hasLiked,
  toggle,
};
