import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/supabase/server";
import { sessions } from "@/supabase/repos/sessions";
import { createContinueToken } from "@/utils/jwt";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const POST = async (_request: NextRequest, context: RouteContext) => {
  const { id } = await context.params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await sessions.getById(supabase, id);

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.userId !== user.id) {
    return NextResponse.json(
      { error: "Only the thread author can generate continue tokens" },
      { status: 403 },
    );
  }

  // Only allow token generation for public sessions to prevent private content leakage
  if (!session.isPublic) {
    return NextResponse.json(
      { error: "Continue tokens can only be generated for public sessions" },
      { status: 403 },
    );
  }

  const token = await createContinueToken({
    sessionId: id,
    userId: user.id,
  });

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  return NextResponse.json({
    token,
    expiresAt,
    curlCommand: `curl -s "https://claudebin.com/api/threads/${id}/md?token=${token}" | claude`,
  });
};
