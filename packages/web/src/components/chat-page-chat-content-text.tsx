import type { TextBlock } from "@/supabase/types/message";

type ChatPageChatContentTextProps = {
  block: TextBlock;
};

const ChatPageChatContentText = ({ block }: ChatPageChatContentTextProps) => {
  return <p className="whitespace-pre-wrap text-sm">{block.text}</p>;
};

export { ChatPageChatContentText };
