"use server";

import { isNil } from "ramda";

import { createClient } from "@/supabase/server";
import { sessionLikes } from "@/supabase/repos/sessionLikes";

export const like = async (sessionId: string) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isNil(user)) {
    throw new Error("Unauthorized");
  }

  return sessionLikes.toggle(supabase, sessionId, user.id);
};
