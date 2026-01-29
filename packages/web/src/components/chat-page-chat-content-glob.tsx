import type { GlobBlock } from "@/supabase/types/message";

type ChatPageChatContentGlobProps = {
  block: GlobBlock;
};

const ChatPageChatContentGlob = ({ block }: ChatPageChatContentGlobProps) => {
  return (
    <div className="flex items-center gap-2 text-gray-600 text-xs">
      <span className="font-medium">Glob</span>
      <code className="rounded bg-gray-100 px-1.5 py-0.5">{block.pattern}</code>
    </div>
  );
};

export { ChatPageChatContentGlob };
