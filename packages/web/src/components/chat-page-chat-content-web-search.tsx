import type { WebSearchBlock } from "@/supabase/types/message";

type ChatPageChatContentWebSearchProps = {
  block: WebSearchBlock;
};

const ChatPageChatContentWebSearch = ({ block }: ChatPageChatContentWebSearchProps) => {
  return (
    <div className="flex items-center gap-2 text-gray-600 text-xs">
      <span className="font-medium">Search</span>
      <code className="rounded bg-gray-100 px-1.5 py-0.5">{block.query}</code>
    </div>
  );
};

export { ChatPageChatContentWebSearch };
