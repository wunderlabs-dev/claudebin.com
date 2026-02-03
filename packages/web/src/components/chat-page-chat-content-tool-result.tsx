import type { ToolResultBlock } from "@/supabase/types/message";

import { cn } from "@/utils/helpers";

type ChatPageChatContentToolResultProps = {
  block: ToolResultBlock;
};

const ChatPageChatContentToolResult = ({ block }: ChatPageChatContentToolResultProps) => {
  return (
    <pre
      className={cn(
        "overflow-x-auto p-2 rounded-md text-xs",
        block.is_error ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-700",
      )}
    >
      <code>{block.content}</code>
    </pre>
  );
};

export { ChatPageChatContentToolResult };
