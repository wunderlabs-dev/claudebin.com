import { createServiceClient } from "@/server/supabase/service";
import { sessions } from "@/server/repos/sessions";

// ABOUTME: Featured threads fetch — bypasses RLS via service client
// Returns public featured threads for the home page carousel
// TODO: Re-add "use cache" caching once cacheComponents is stable
export const getCachedFeaturedThreads = async () => {
  const supabase = createServiceClient();
  return sessions.getFeaturedThreads(supabase);
};
