import { unstable_cache } from "next/cache";

import { createServiceClient } from "@/server/supabase/service";
import { sessions } from "@/server/repos/sessions";

// ABOUTME: Featured threads fetch — bypasses RLS via service client, cached with on-demand revalidation
// Returns public featured threads for the home page carousel
// Invalidated via revalidateTag("featured-threads") when featured list changes
export const getCachedFeaturedThreads = () =>
  unstable_cache(
    async () => {
      const supabase = createServiceClient();
      return sessions.getFeaturedThreads(supabase);
    },
    ["featured-threads"],
    { tags: ["featured-threads"] },
  )();
