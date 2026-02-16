"use cache";

import { cacheLife, cacheTag } from "next/cache";

import { createServiceClient } from "@/server/supabase/service";
import { sessions } from "@/server/repos/sessions";

// ABOUTME: Cached thread data fetch — bypasses RLS via service client
// Returns thread + author profile without like status (hasLiked is fetched client-side)
// Private threads are returned too — access control happens in the page component
export const getCachedThread = async (id: string) => {
  cacheLife("max");
  cacheTag(`thread:${id}`);

  const supabase = createServiceClient();
  return sessions.getByIdWithProfile(supabase, id);
};
