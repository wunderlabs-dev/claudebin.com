import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";

interface Message {
  id: number;
  idx: number;
  type: string;
  message: {
    type?: string;
    content?: unknown;
    [key: string]: unknown;
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

const getSession = async (id: string) => {
  const supabase = createServiceClient();

  const { data: session, error } = await supabase
    .from("sessions")
    .select("id, title, status, message_count, created_at, is_public")
    .eq("id", id)
    .single();

  if (error || !session) {
    return null;
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("id, idx, type, message")
    .eq("session_id", id)
    .order("idx", { ascending: true });

  return { session, messages: messages || [] };
};

const MessageContent = ({ message }: { message: Message }) => {
  const content = message.message;
  const type = message.type || content.type || "unknown";

  // Extract text content based on message structure
  let textContent = "";
  if (typeof content.content === "string") {
    textContent = content.content;
  } else if (Array.isArray(content.content)) {
    textContent = content.content
      .map((c: { text?: string }) => c.text || "")
      .join("\n");
  }

  return (
    <div
      className={`p-4 rounded-lg mb-4 ${
        type === "user"
          ? "bg-blue-50 border border-blue-200"
          : type === "assistant"
            ? "bg-gray-50 border border-gray-200"
            : "bg-yellow-50 border border-yellow-200"
      }`}
    >
      <div className="text-xs font-semibold text-gray-500 mb-2 uppercase">
        {type}
      </div>
      <div className="whitespace-pre-wrap text-sm">{textContent || JSON.stringify(content, null, 2)}</div>
    </div>
  );
};

const SessionPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const data = await getSession(id);

  if (!data) {
    notFound();
  }

  const { session, messages } = data;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {session.title || "Untitled Session"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {session.message_count} messages •{" "}
            {new Date(session.created_at).toLocaleDateString()}
          </p>
        </header>

        <div className="space-y-4">
          {messages.map((msg: Message) => (
            <MessageContent key={msg.id} message={msg} />
          ))}
        </div>

        {messages.length === 0 && (
          <p className="text-gray-500 text-center py-8">No messages found</p>
        )}
      </div>
    </div>
  );
};

export default SessionPage;
