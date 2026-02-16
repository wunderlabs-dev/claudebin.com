"use server";

import type { PaginatedMessages } from "@/server/repos/messages";
import { getCachedMessages } from "@/server/cache/messages";

export const getMessagesBySessionId = async (sessionId: string): Promise<PaginatedMessages> => {
  return getCachedMessages(sessionId);
};
