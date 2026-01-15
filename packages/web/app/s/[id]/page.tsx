import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";
import type { ContentBlock } from "@/lib/types/message";

interface DbMessage {
  id: number;
  idx: number;
  role: string | null;
  model: string | null;
  is_meta: boolean;
  is_sidechain: boolean;
  content: ContentBlock[];
  has_tool_calls: boolean;
  tool_names: string[];
  text_preview: string;
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

  // Fetch normalized messages, excluding meta and sidechain
  const { data: messages } = await supabase
    .from("messages")
    .select(
      "id, idx, role, model, is_meta, is_sidechain, content, has_tool_calls, tool_names, text_preview",
    )
    .eq("session_id", id)
    .eq("is_meta", false)
    .eq("is_sidechain", false)
    .order("idx", { ascending: true });

  return { session, messages: (messages || []) as DbMessage[] };
};

const TextContent = ({ text }: { text: string }) => (
  <div className="whitespace-pre-wrap text-sm">{text}</div>
);

const ToolUseContent = ({
  name,
  input,
}: {
  name: string;
  input: Record<string, unknown>;
}) => (
  <div className="mt-2 p-3 bg-gray-100 rounded border border-gray-200">
    <div className="text-xs font-mono text-purple-600 mb-1">{name}</div>
    <pre className="text-xs overflow-x-auto">
      {JSON.stringify(input, null, 2)}
    </pre>
  </div>
);

const ToolResultContent = ({
  content,
  isError,
}: {
  content: string;
  isError?: boolean;
}) => (
  <div
    className={`mt-2 p-3 rounded border ${
      isError
        ? "bg-red-50 border-red-200 text-red-800"
        : "bg-green-50 border-green-200 text-green-800"
    }`}
  >
    <pre className="text-xs whitespace-pre-wrap overflow-x-auto">
      {content.slice(0, 1000)}
      {content.length > 1000 && "..."}
    </pre>
  </div>
);

const MessageContent = ({ message }: { message: DbMessage }) => {
  const { role, content, model } = message;

  return (
    <div
      className={`p-4 rounded-lg mb-4 ${
        role === "user"
          ? "bg-blue-50 border border-blue-200"
          : "bg-gray-50 border border-gray-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase">
          {role || "unknown"}
        </span>
        {model && (
          <span className="text-xs text-gray-400 font-mono">{model}</span>
        )}
      </div>

      {content.map((block, i) => {
        const key = block.type === "tool_use" ? block.id : `${block.type}-${i}`;
        switch (block.type) {
          case "text":
            return <TextContent key={key} text={block.text} />;
          case "tool_use":
            return (
              <ToolUseContent
                key={key}
                name={block.name}
                input={block.input as Record<string, unknown>}
              />
            );
          case "tool_result":
            return (
              <ToolResultContent
                key={key}
                content={block.content}
                isError={block.is_error}
              />
            );
          default:
            return null;
        }
      })}
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
          {messages.map((msg) => (
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
