"use server";

import { createClient } from "@/supabase/server";
import { sessionLikes } from "@/supabase/repos/sessionLikes";

export const toggleLike = async (sessionId: string): Promise<{ liked: boolean } | { error: string }> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const liked = await sessionLikes.toggle(supabase, sessionId, user.id);
  return { liked };
};
