import type { WebFetchBlock } from "@/supabase/types/message";

type ChatPageChatContentWebFetchProps = {
  block: WebFetchBlock;
};

const ChatPageChatContentWebFetch = ({ block }: ChatPageChatContentWebFetchProps) => {
  return (
    <div className="flex items-center gap-2 text-gray-600 text-xs">
      <span className="font-medium">Fetch</span>
      <code className="rounded bg-gray-100 px-1.5 py-0.5">{block.url}</code>
    </div>
  );
};

export { ChatPageChatContentWebFetch };
