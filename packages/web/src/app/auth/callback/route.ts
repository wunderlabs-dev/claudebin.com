import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/database.types";

export const GET = async (request: NextRequest) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/dashboard";
  const errorParam = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle OAuth error from provider
  if (errorParam) {
    console.error("OAuth error:", errorParam, errorDescription);
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(errorParam)}&error_description=${encodeURIComponent(errorDescription || "")}`,
    );
  }

  if (code) {
    const cookieStore = await cookies();

    // Create response first so we can set cookies on it
    const response = NextResponse.redirect(`${origin}${redirect}`);

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
            console.log(
              "[auth/callback] Setting cookies on response:",
              cookiesToSet.map((c) => c.name).join(", "),
            );
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    console.log("[auth/callback] Exchanging code for session...");
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      console.log("[auth/callback] Exchange successful, user:", data.session.user.email);
      console.log("[auth/callback] Redirecting to:", redirect);
      return response;
    }

    console.error("[auth/callback] Session exchange error:", error?.message);
    console.error("[auth/callback] Data:", data);
    return NextResponse.redirect(
      `${origin}/auth/login?error=exchange_failed&error_description=${encodeURIComponent(error?.message || "No session returned")}`,
    );
  }

  return NextResponse.redirect(`${origin}/auth/login?error=no_code`);
};
