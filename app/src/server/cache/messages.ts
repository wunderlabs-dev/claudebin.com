import { createServiceClient } from "@/server/supabase/service";
import { messages, type PaginatedMessages } from "@/server/repos/messages";

// ABOUTME: Messages fetch — messages are immutable after session processing
// Uses service client to bypass RLS (access control happens at page level)
// TODO: Re-add "use cache" caching once cacheComponents is stable
export const getCachedMessages = async (sessionId: string): Promise<PaginatedMessages> => {
  const supabase = createServiceClient();
  return messages.getBySessionId(supabase, sessionId);
};
