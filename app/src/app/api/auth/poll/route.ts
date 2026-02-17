import { NextResponse, type NextRequest } from "next/server";

import { cliAuth } from "@/server/repos/cli-auth";
import { createServiceClient } from "@/server/supabase/service";
import { authPollInputSchema, PollStatus, type AuthPollResponse } from "@/server/api/schemas/auth";

export const GET = async (request: NextRequest): Promise<NextResponse<AuthPollResponse>> => {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  const parsed = authPollInputSchema.safeParse({ code });
  if (!parsed.success) {
    return NextResponse.json({ status: PollStatus.EXPIRED }, { status: 400 });
  }

  const supabase = createServiceClient();
  const session = await cliAuth.getByToken(supabase, parsed.data.code);

  if (!session) {
    return NextResponse.json({ status: PollStatus.EXPIRED });
  }

  if (!session.expiresAt || new Date(session.expiresAt) < new Date()) {
    return NextResponse.json({ status: PollStatus.EXPIRED });
  }

  if (session.completedAt) {
    if (!session.accessToken || !session.refreshToken || !session.userId) {
      return NextResponse.json({ status: PollStatus.EXPIRED });
    }

    return NextResponse.json({
      status: PollStatus.SUCCESS,
      token: session.accessToken,
      refresh_token: session.refreshToken,
      user: {
        id: session.profile?.id ?? session.userId,
        name: session.profile?.name ?? null,
        avatar_url: session.profile?.avatarUrl ?? null,
      },
    });
  }

  return NextResponse.json({ status: PollStatus.PENDING });
};
