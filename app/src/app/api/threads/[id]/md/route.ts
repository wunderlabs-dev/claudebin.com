import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/supabase/server";
import { sessions } from "@/supabase/repos/sessions";
import { messages } from "@/supabase/repos/messages";
import { verifyContinueToken } from "@/utils/jwt";
import { messagesToMarkdown } from "@/utils/messageToMarkdown";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = async (request: NextRequest, context: RouteContext) => {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);

  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token parameter" }, { status: 400 });
  }

  const payload = await verifyContinueToken(token);

  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  if (payload.sessionId !== id) {
    return NextResponse.json({ error: "Token does not match session" }, { status: 403 });
  }

  const supabase = await createClient();

  const session = await sessions.getById(supabase, id);

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  // Only allow markdown export for public sessions to prevent private content leakage
  // via shared/leaked token URLs
  if (!session.isPublic) {
    return NextResponse.json(
      { error: "Markdown export is only available for public sessions" },
      { status: 403 },
    );
  }

  const result = await messages.getBySessionId(supabase, id, {
    excludeMeta: true,
    excludeSidechain: true,
  });

  const markdown = messagesToMarkdown(result.messages);

  const header = `# ${session.title ?? "Untitled Conversation"}\n\n---\n\n`;

  return new NextResponse(header + markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `inline; filename="${id}.md"`,
    },
  });
};
