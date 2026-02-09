import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/supabase/server";
import { sessions } from "@/supabase/repos/sessions";
import { messages } from "@/supabase/repos/messages";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = async (request: NextRequest, context: RouteContext) => {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json({ error: "Missing 'from' and 'to' parameters" }, { status: 400 });
  }

  const fromIdx = Number.parseInt(from, 10);
  const toIdx = Number.parseInt(to, 10);

  if (Number.isNaN(fromIdx) || Number.isNaN(toIdx)) {
    return NextResponse.json({ error: "Invalid 'from' or 'to' parameter" }, { status: 400 });
  }

  if (fromIdx > toIdx) {
    return NextResponse.json(
      { error: "'from' must be less than or equal to 'to'" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const session = await sessions.getById(supabase, id);

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (!session.isPublic && session.userId !== user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await messages.getByRange(supabase, id, fromIdx, toIdx);

  return NextResponse.json({
    sessionId: id,
    title: session.title,
    messages: result.messages,
    range: {
      from: fromIdx,
      to: toIdx,
      count: result.total,
    },
  });
};
