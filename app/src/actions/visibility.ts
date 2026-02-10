"use server";

import { not, isNil } from "ramda";

import { createClient } from "@/supabase/server";
import { sessions } from "@/supabase/repos/sessions";

export const toggleVisibility = async (sessionId: string) => {
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

  await sessions.update(supabase, sessionId, {
    isPublic: not(session.isPublic),
  });

  return {
    isPublic: not(session.isPublic),
  };
};
