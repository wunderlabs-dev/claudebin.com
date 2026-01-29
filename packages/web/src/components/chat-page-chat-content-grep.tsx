import type { GrepBlock } from "@/supabase/types/message";

type ChatPageChatContentGrepProps = {
  block: GrepBlock;
};

const ChatPageChatContentGrep = ({ block }: ChatPageChatContentGrepProps) => {
  return (
    <div className="flex items-center gap-2 text-gray-600 text-xs">
      <span className="font-medium">Grep</span>
      <code className="rounded bg-gray-100 px-1.5 py-0.5">{block.pattern}</code>
    </div>
  );
};

export { ChatPageChatContentGrep };
