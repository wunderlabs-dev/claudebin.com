"use server";

import { createClient } from "@/supabase/server";
import { messages, type PaginatedMessages } from "@/supabase/repos/messages";

export const getMessagesBySessionId = async (sessionId: string): Promise<PaginatedMessages> => {
  const supabase = await createClient();

  return messages.getBySessionId(supabase, sessionId);
};
