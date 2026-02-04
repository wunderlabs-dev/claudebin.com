import type { GenericBlock } from "@/supabase/types/message";

type ChatPageChatContentGenericProps = {
  block: GenericBlock;
};

const ChatPageChatContentGeneric = ({ block }: ChatPageChatContentGenericProps) => {
  return (
    <div className="flex items-center gap-2 text-gray-600 text-xs">
      <span className="font-medium">{block.name}</span>
      <pre className="overflow-x-auto scrollbar-hidden rounded bg-gray-100 px-1.5 py-0.5">
        <code>{JSON.stringify(block.input, null, 2)}</code>
      </pre>
    </div>
  );
};

export { ChatPageChatContentGeneric };
