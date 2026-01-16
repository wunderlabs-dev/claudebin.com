import { notFound } from "next/navigation";
import { messages } from "@/lib/repos/messages.repo";
import { sessions } from "@/lib/repos/sessions.repo";
import { createServiceClient } from "@/lib/supabase/service";
import { Message } from "./_components/message";

interface PageProps {
  params: Promise<{ id: string }>;
}

const getSession = async (id: string) => {
  const supabase = createServiceClient();
  const session = await sessions.getById(supabase, id);

  if (!session) {
    return null;
  }

  const sessionMessages = await messages.getBySessionId(supabase, id, {
    excludeMeta: true,
    excludeSidechain: true,
  });

  return { session, messages: sessionMessages };
};

const SessionPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const data = await getSession(id);

  if (!data) {
    notFound();
  }

  const { session, messages: sessionMessages } = data;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {session.title || "Untitled Session"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {session.messageCount} messages •{" "}
            {new Date(session.createdAt).toLocaleDateString()}
          </p>
        </header>

        <div className="space-y-4">
          {sessionMessages.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}
        </div>

        {sessionMessages.length === 0 && (
          <p className="text-gray-500 text-center py-8">No messages found</p>
        )}
      </div>
    </div>
  );
};

export default SessionPage;
