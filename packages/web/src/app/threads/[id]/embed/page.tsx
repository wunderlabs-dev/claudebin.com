import { notFound } from "next/navigation";
import { isNil, not } from "ramda";

import { createClient } from "@/supabase/server";

import { sessions } from "@/supabase/repos/sessions";
import { messages } from "@/supabase/repos/messages";

import { ThreadEmbedContainer } from "@/containers/thread-embed-container";

type EmbedPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
};

const EmbedPage = async ({ params, searchParams }: EmbedPageProps) => {
  const { id } = await params;
  const { from, to } = await searchParams;

  if (isNil(from) || isNil(to)) {
    notFound();
  }

  const fromIdx = Number.parseInt(from);
  const toIdx = Number.parseInt(to);

  if (Number.isNaN(fromIdx) || Number.isNaN(toIdx) || fromIdx > toIdx) {
    notFound();
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const session = await sessions.getById(supabase, id);

  if (isNil(session)) {
    notFound();
  }
  if (not(session.isPublic) && session.userId !== user?.id) {
    notFound();
  }

  const result = await messages.getByRange(supabase, id, fromIdx, toIdx);

  return (
    <ThreadEmbedContainer
      sessionId={id}
      title={session.title}
      messages={result.messages}
      range={{ from: fromIdx, to: toIdx }}
    />
  );
};

export default EmbedPage;
