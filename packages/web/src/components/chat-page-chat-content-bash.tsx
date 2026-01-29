import type { BashBlock } from "@/supabase/types/message";

type ChatPageChatContentBashProps = {
  block: BashBlock;
};

const ChatPageChatContentBash = ({ block }: ChatPageChatContentBashProps) => {
  return (
    <div className="flex flex-col gap-1">
      {block.description ? (
        <span className="text-gray-500 text-xs">{block.description}</span>
      ) : null}
      <pre className="overflow-x-auto rounded-md bg-gray-100 p-2 text-xs">
        <code>{block.command}</code>
      </pre>
    </div>
  );
};

export { ChatPageChatContentBash };
