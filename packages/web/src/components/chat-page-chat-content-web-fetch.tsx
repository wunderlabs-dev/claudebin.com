import type { WebFetchBlock } from "@/supabase/types/message";

type ChatPageChatContentWebFetchProps = {
  block: WebFetchBlock;
};

const ChatPageChatContentWebFetch = ({ block }: ChatPageChatContentWebFetchProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-gray-600 text-xs">
        <span className="font-medium">Fetch</span>
        <code className="rounded bg-gray-100 px-1.5 py-0.5">{block.url}</code>
      </div>
      {block.result && (
        <pre className="overflow-x-auto rounded bg-gray-50 p-2 text-xs">{block.result}</pre>
      )}
    </div>
  );
};

export { ChatPageChatContentWebFetch };
