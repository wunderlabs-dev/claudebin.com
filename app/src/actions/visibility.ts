"use server";

import { isNil } from "ramda";

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

  // Verify ownership
  const session = await sessions.getByIdForUser(supabase, sessionId, user.id);

  if (isNil(session)) {
    throw new Error("Session not found or not owned by user");
  }

  const newVisibility = !session.isPublic;

  await sessions.update(supabase, sessionId, { isPublic: newVisibility });

  return { isPublic: newVisibility };
};
