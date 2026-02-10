import { cache } from "react";
import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/supabase/types";

type Cookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

export const createClient = cache(async () => {
  const store = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (cookies: ReadonlyArray<Cookie>) => {
          try {
            cookies.forEach((cookie) => {
              store.set(cookie.name, cookie.value, cookie.options);
            });
          } catch {}
        },
      },
    },
  );
});
