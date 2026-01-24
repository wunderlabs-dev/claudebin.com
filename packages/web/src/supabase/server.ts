import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/supabase/types";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: ReadonlyArray<CookieToSet>) => {
          try {
            cookiesToSet.forEach((cookie) => {
              cookieStore.set(cookie.name, cookie.value, cookie.options);
            });
          } catch {
            // ABOUTME: The `setAll` method is called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    },
  );
};
