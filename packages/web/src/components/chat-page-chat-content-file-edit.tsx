import type { FileEditBlock } from "@/supabase/types/message";

type ChatPageChatContentFileEditProps = {
  block: FileEditBlock;
};

const ChatPageChatContentFileEdit = ({ block }: ChatPageChatContentFileEditProps) => {
  return (
    <div className="flex items-center gap-2 text-gray-600 text-xs">
      <span className="font-medium">Edit</span>
      <code className="rounded bg-gray-100 px-1.5 py-0.5">{block.file_path}</code>
    </div>
  );
};

export { ChatPageChatContentFileEdit };
