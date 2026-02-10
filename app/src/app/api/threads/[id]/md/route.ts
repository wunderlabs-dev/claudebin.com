import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/server/supabase/server";
import { sessions } from "@/server/repos/sessions";
import { messages } from "@/server/repos/messages";
import { messagesToMarkdown } from "@/server/utils/message-to-markdown";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = async (_request: NextRequest, context: RouteContext) => {
  const { id } = await context.params;
  const supabase = await createClient();

  const session = await sessions.getById(supabase, id);

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

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

  const title = session.title ?? "Untitled Conversation";

  const output = `<continue-conversation>
<instructions>
You are continuing a previous Claude Code conversation.

1. Read through the conversation below
2. Summarize what was accomplished and the current state
3. Ask the user how they'd like to continue
</instructions>

<conversation title="${title}">
${markdown}
</conversation>
</continue-conversation>`;

  return new NextResponse(output, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `inline; filename="${id}.md"`,
    },
  });
};
