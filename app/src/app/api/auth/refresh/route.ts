import { NextResponse, type NextRequest } from "next/server";

import { createServiceClient } from "@/server/supabase/service";
import { authRefreshInputSchema, type AuthRefreshResponse } from "@/server/api/schemas/auth";

export const POST = async (request: NextRequest): Promise<NextResponse<AuthRefreshResponse>> => {
  const body = await request.json();
  const parsed = authRefreshInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: parsed.data.refresh_token,
  });

  if (error || !data.session) {
    return NextResponse.json({ success: false, error: error?.message ?? "Failed to refresh" });
  }

  return NextResponse.json({
    success: true,
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
  });
};
