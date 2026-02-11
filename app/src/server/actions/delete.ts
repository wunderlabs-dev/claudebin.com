"use server";

import { isNil } from "ramda";

import { createClient } from "@/server/supabase/server";
import { sessions } from "@/server/repos/sessions";

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

  // Delete the storage file if it exists
  if (session.storagePath) {
    await sessions.deleteFile(supabase, session.storagePath);
  }

  // Delete the session (messages are cascade deleted via FK)
  await sessions.delete(supabase, sessionId);

  return { success: true };
};
