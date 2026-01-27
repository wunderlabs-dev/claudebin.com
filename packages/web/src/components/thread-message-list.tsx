import type { ReactNode } from "react";

import type { Message } from "@/supabase/repos/messages";

import { ThreadMessageItem } from "@/components/thread-message-item";

type ThreadMessageListProps = {
  messages: Message[];
};

const ThreadMessageList = ({ messages }: ThreadMessageListProps): ReactNode => {
  if (messages.length === 0) {
    return <div className="py-8 text-center text-gray-500">No messages in this session</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <ThreadMessageItem key={message.id} message={message} />
      ))}
    </div>
  );
};

export { ThreadMessageList };
