import type { ThinkingBlock } from "@/supabase/types/message";

type ChatPageChatContentThinkingProps = {
  block: ThinkingBlock;
};

const ChatPageChatContentThinking = ({ block }: ChatPageChatContentThinkingProps) => {
  return (
    <details className="rounded-md border border-gray-200 bg-gray-50 p-2">
      <summary className="cursor-pointer text-gray-500 text-sm">Thinking...</summary>
      <pre className="mt-2 whitespace-pre-wrap text-gray-600 text-xs">{block.thinking}</pre>
    </details>
  );
};

export { ChatPageChatContentThinking };
