import type { TaskBlock } from "@/supabase/types/message";

type ChatPageChatContentTaskProps = {
  block: TaskBlock;
};

const ChatPageChatContentTask = ({ block }: ChatPageChatContentTaskProps) => {
  return (
    <div className="flex flex-col gap-1 text-gray-600 text-xs">
      <span className="font-medium">Task ({block.subagent_type})</span>
      <p>{block.description}</p>
    </div>
  );
};

export { ChatPageChatContentTask };
