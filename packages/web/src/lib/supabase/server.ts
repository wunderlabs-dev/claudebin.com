import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          const all = cookieStore.getAll();
          console.log(
            "[supabase/server] getAll cookies:",
            all.map((c) => c.name).join(", ") || "none",
          );
          return all;
        },
        setAll: (
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[],
        ) => {
          console.log(
            "[supabase/server] setAll cookies:",
            cookiesToSet.map((c) => c.name).join(", "),
          );
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
            console.log("[supabase/server] Cookies set successfully");
          } catch (error) {
            console.error("[supabase/server] Failed to set cookies:", error);
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    },
  );
};
