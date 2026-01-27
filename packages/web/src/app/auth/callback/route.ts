import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/supabase/server";

export const GET = async (request: NextRequest) => {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirect") || "/";
  const authError = searchParams.get("error");
  const authErrorDescription = searchParams.get("error_description");

  if (authError) {
    const error = encodeURIComponent(authError);
    const description = authErrorDescription ? encodeURIComponent(authErrorDescription) : null;

    return NextResponse.redirect(
      `${origin}/auth/login?error=${error}&error_description=${description}`,
    );
  }

  if (code) {
    const supabase = await createClient();
    const session = await supabase.auth.exchangeCodeForSession(code);

    if (session.error) {
      const description = encodeURIComponent(session.error.message);

      return NextResponse.redirect(
        `${origin}/auth/login?error=exchange_failed&error_description=${description}`,
      );
    }
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  return NextResponse.redirect(`${origin}/auth/login?error=no_code`);
};
