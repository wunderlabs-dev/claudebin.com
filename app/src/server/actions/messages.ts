"use server";

import { createClient } from "@/server/supabase/server";
import { messages, type PaginatedMessages } from "@/server/repos/messages";

export const getMessagesBySessionId = async (sessionId: string): Promise<PaginatedMessages> => {
  const supabase = await createClient();

  return messages.getBySessionId(supabase, sessionId);
};
