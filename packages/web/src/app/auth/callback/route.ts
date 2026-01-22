import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    const supabase = await createClient();
    console.log("[auth/callback] Exchanging code for session...");
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      console.log("[auth/callback] Exchange successful, user:", data.session.user.email);
      console.log("[auth/callback] Redirecting to:", redirect);
      return NextResponse.redirect(`${origin}${redirect}`);
    }

    console.error("[auth/callback] Session exchange error:", error?.message);
    console.error("[auth/callback] Data:", data);
    return NextResponse.redirect(
      `${origin}/auth/login?error=exchange_failed&error_description=${encodeURIComponent(error?.message || "No session returned")}`,
    );
  }

  return NextResponse.redirect(`${origin}/auth/login?error=no_code`);
};
