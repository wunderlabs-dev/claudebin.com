import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Service client with admin privileges - bypasses RLS
// Only use for server-side background processing
export const createServiceClient = () => {
  return createClient<Database>(
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
