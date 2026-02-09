import { NextResponse, type NextRequest } from "next/server";

import { config } from "@/supabase/config/env";
import { sessions } from "@/supabase/repos/sessions";
import { createServiceClient } from "@/supabase/service";
import { sessionsPollInputSchema, SessionStatus, type SessionsPollResponse } from "@/api/schemas/sessions";

export const GET = async (request: NextRequest): Promise<NextResponse<SessionsPollResponse>> => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const parsed = sessionsPollInputSchema.safeParse({ id });
  if (!parsed.success) {
    return NextResponse.json({ status: SessionStatus.FAILED, error: "Invalid input" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const session = await sessions.getById(supabase, parsed.data.id);

  if (!session) {
    return NextResponse.json({
      status: SessionStatus.FAILED,
      error: "Session not found",
    });
  }

  if (session.status === SessionStatus.PROCESSING) {
    return NextResponse.json({ status: SessionStatus.PROCESSING });
  }

  if (session.status === SessionStatus.FAILED) {
    return NextResponse.json({
      status: SessionStatus.FAILED,
      error: session.errorMessage || "Processing failed",
    });
  }

  return NextResponse.json({
    status: SessionStatus.READY,
    url: `${config.appUrl}/threads/${parsed.data.id}`,
  });
};
