import { notFound } from "next/navigation";
import { isNil } from "ramda";

import { sessions } from "@/supabase/repos/sessions";
import { messages } from "@/supabase/repos/messages";
import { createClient } from "@/supabase/server";

import { ThreadEmbedContainer } from "@/containers/thread-embed-container";

type EmbedPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
};

const EmbedPage = async ({ params, searchParams }: EmbedPageProps) => {
  const { id } = await params;
  const { from, to } = await searchParams;

  if (!from || !to) {
    notFound();
  }

  const fromIdx = Number.parseInt(from, 10);
  const toIdx = Number.parseInt(to, 10);

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

  if (!session.isPublic && session.userId !== user?.id) {
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
