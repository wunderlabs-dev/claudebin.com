// packages/web/app/api/auth/start/route.ts

import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  return "http://localhost:3000";
};

export const POST = async () => {
  const supabase = await createClient();
  const code = nanoid(21);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const { error } = await supabase.from("cli_auth_sessions").insert({
    code,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    console.error("Failed to create auth session:", error);
    return NextResponse.json(
      { error: "Failed to create auth session" },
      { status: 500 },
    );
  }

  const baseUrl = getBaseUrl();

  return NextResponse.json({
    code,
    url: `${baseUrl}/cli/auth?code=${code}`,
    expires_at: expiresAt.toISOString(),
  });
};
