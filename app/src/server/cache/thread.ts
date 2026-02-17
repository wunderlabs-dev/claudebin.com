import { unstable_cache } from "next/cache";

import { createServiceClient } from "@/server/supabase/service";
import { sessions } from "@/server/repos/sessions";

// ABOUTME: Thread data fetch — bypasses RLS via service client, cached with on-demand revalidation
// Returns thread + author profile without like status (hasLiked is fetched client-side)
// Private threads are returned too — access control happens in the page component
// Invalidated via revalidateTag("thread-{id}") when likes or visibility change
export const getCachedThread = (id: string) =>
  unstable_cache(
    async () => {
      const supabase = createServiceClient();
      return sessions.getByIdWithProfile(supabase, id);
    },
    ["thread", id],
    { tags: [`thread-${id}`] },
  )();
