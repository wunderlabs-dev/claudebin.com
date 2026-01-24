import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/supabase/types";

type SessionLikesRow = Database["public"]["Tables"]["session_likes"]["Row"];

export type SessionLike = SessionLikesRow;

const hasUserLiked = async (
  supabase: SupabaseClient<Database>,
  sessionId: string,
  userId: string,
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("session_likes")
    .select("id")
    .eq("sessionId", sessionId)
    .eq("userId", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to check like status: ${error.message}`);
  }

  return data !== null;
};

const like = async (
  supabase: SupabaseClient<Database>,
  sessionId: string,
  userId: string,
): Promise<void> => {
  const { error } = await supabase.from("session_likes").insert({
    sessionId,
    userId,
  });

  // Ignore unique constraint violation (already liked)
  if (error && !error.message.includes("duplicate key")) {
    throw new Error(`Failed to like session: ${error.message}`);
  }
};

const unlike = async (
  supabase: SupabaseClient<Database>,
  sessionId: string,
  userId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("session_likes")
    .delete()
    .eq("sessionId", sessionId)
    .eq("userId", userId);

  if (error) {
    throw new Error(`Failed to unlike session: ${error.message}`);
  }
};

export const sessionLikes = { hasUserLiked, like, unlike };
