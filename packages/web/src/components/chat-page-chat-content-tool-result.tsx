import type { ToolResultBlock } from "@/supabase/types/message";

type ChatPageChatContentToolResultProps = {
  block: ToolResultBlock;
};

const ChatPageChatContentToolResult = ({ block }: ChatPageChatContentToolResultProps) => {
  return (
    <pre
      className={`overflow-x-auto p-2 ${block.is_error ? "bg-red-50" : "bg-gray-100"} rounded-md text-xs ${block.is_error ? "text-red-700" : "text-gray-700"}`}
    >
      <code>{block.content}</code>
    </pre>
  );
};

export { ChatPageChatContentToolResult };
