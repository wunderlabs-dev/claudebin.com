import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/supabase/types";

type Cookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

/**
 * For Route Handlers and Server Actions that can write cookies.
 * Use this in: /auth/callback, /auth/logout, middleware
 */
export const createClient = async () => {
  const store = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (cookies: ReadonlyArray<Cookie>) => {
          cookies.forEach((cookie) => {
            store.set(cookie.name, cookie.value, cookie.options);
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
  const store = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: () => {
          // No-op: Server Components cannot write cookies in Next.js 16
        },
      },
    },
  );
};
