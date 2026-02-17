import { connection } from "next/server";

import { createServiceClient } from "@/server/supabase/service";
import { sessions } from "@/server/repos/sessions";

// ABOUTME: Featured threads fetch — bypasses RLS via service client
// Returns public featured threads for the home page carousel
// Uses connection() to defer to request time inside Suspense boundary
export const getCachedFeaturedThreads = async () => {
  await connection();

  const supabase = createServiceClient();
  return sessions.getFeaturedThreads(supabase);
};
