import { NextResponse, type NextRequest } from "next/server";

import { createServiceClient } from "@/server/supabase/service";
import { authValidateInputSchema, type AuthValidateResponse } from "@/server/api/schemas/auth";

export const GET = async (request: NextRequest): Promise<NextResponse<AuthValidateResponse>> => {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  const parsed = authValidateInputSchema.safeParse({ token });
  if (!parsed.success) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase.auth.getUser(parsed.data.token);

  return NextResponse.json({ valid: !error && !!data.user });
};
