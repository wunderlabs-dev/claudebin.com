import { createClient } from "@supabase/supabase-js";

// Service client with admin privileges - bypasses RLS
// Only use for server-side background processing
export const createServiceClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
};
