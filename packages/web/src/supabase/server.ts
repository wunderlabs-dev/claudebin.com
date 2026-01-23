import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/supabase/types";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

/**
 * For Route Handlers and Server Actions that can write cookies.
 * Use this in: /auth/callback, /auth/logout, middleware
 */
export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: ReadonlyArray<CookieToSet>) => {
          cookiesToSet.forEach((cookie) => {
            cookieStore.set(cookie.name, cookie.value, cookie.options);
          });
        },
      },
    },
  );
};

/**
 * For Server Components that only read auth state.
 * Next.js 16 prohibits cookie writes in Server Components.
 */
export const createReadOnlyClient = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {
          // No-op: Server Components cannot write cookies in Next.js 16
        },
      },
    },
  );
};
