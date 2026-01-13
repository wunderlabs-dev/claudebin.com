// packages/web/app/auth/callback/route.ts
import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const cliCode = requestUrl.searchParams.get("cli_code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/cli/auth?error=auth_failed`,
      );
    }

    // If this was a CLI auth flow, associate the code with the user
    if (cliCode && data.session) {
      const { error: updateError } = await supabase
        .from("cli_auth_sessions")
        .update({
          user_id: data.session.user.id,
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          completed_at: new Date().toISOString(),
        })
        .eq("code", cliCode)
        .is("completed_at", null);

      if (updateError) {
        console.error("Failed to update CLI auth session:", updateError);
      }

      return NextResponse.redirect(
        `${requestUrl.origin}/cli/auth?code=${cliCode}&success=true`,
      );
    }

    return NextResponse.redirect(requestUrl.origin);
  }

  return NextResponse.redirect(requestUrl.origin);
};
