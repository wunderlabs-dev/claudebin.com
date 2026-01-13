// packages/web/app/api/auth/poll/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const GET = async (request: NextRequest) => {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Missing code parameter" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { data: session, error } = await supabase
    .from("cli_auth_sessions")
    .select("*, profiles(*)")
    .eq("code", code)
    .single();

  if (error || !session) {
    return NextResponse.json({ status: "expired" });
  }

  // Check if code expired
  if (new Date(session.expires_at) < new Date()) {
    return NextResponse.json({ status: "expired" });
  }

  // Check if auth completed
  if (session.completed_at && session.user_id && session.access_token) {
    return NextResponse.json({
      status: "success",
      token: session.access_token,
      user: {
        id: session.profiles.id,
        username: session.profiles.username,
        avatar_url: session.profiles.avatar_url,
      },
    });
  }

  return NextResponse.json({ status: "pending" });
};
