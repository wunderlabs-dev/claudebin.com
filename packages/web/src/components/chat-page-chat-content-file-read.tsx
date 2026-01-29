import type { FileReadBlock } from "@/supabase/types/message";

type ChatPageChatContentFileReadProps = {
  block: FileReadBlock;
};

const ChatPageChatContentFileRead = ({ block }: ChatPageChatContentFileReadProps) => {
  return (
    <div className="flex items-center gap-2 text-gray-600 text-xs">
      <span className="font-medium">Read</span>
      <code className="rounded bg-gray-100 px-1.5 py-0.5">{block.file_path}</code>
    </div>
  );
};

export { ChatPageChatContentFileRead };
