import { createServiceClient } from "@/server/supabase/service";
import { sessions } from "@/server/repos/sessions";

// ABOUTME: Thread data fetch — bypasses RLS via service client
// Returns thread + author profile without like status (hasLiked is fetched client-side)
// Private threads are returned too — access control happens in the page component
// TODO: Re-add "use cache" caching once cacheComponents is stable
export const getCachedThread = async (id: string) => {
  const supabase = createServiceClient();
  return sessions.getByIdWithProfile(supabase, id);
};
