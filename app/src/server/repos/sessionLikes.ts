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

type ToggleResult = {
  liked: boolean;
  likeCount: number;
};

const toggle = async (
  supabase: SupabaseClient<Database>,
  sessionId: string,
  userId: string,
): Promise<ToggleResult> => {
  const liked = await hasLiked(supabase, sessionId, userId);

  if (liked) {
    await supabase.from("session_likes").delete().eq("sessionId", sessionId).eq("userId", userId);
  } else {
    await supabase.from("session_likes").insert({ sessionId, userId });
  }

  const { data } = await supabase.from("sessions").select("likeCount").eq("id", sessionId).single();

  return { liked: !liked, likeCount: data?.likeCount ?? 0 };
};

export const sessionLikes = {
  hasLiked,
  toggle,
};
