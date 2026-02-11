import type { Message } from "@/server/repos/messages";

import { block } from "@/utils/renderers";

import { AVATAR_ASSISTANT_IMAGE_SRC } from "@/utils/constants";

import { ChatItem, ChatContent } from "@/components/ui/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type EmbedPageConversationProps = {
  messages: Message[];
  author: string;
  avatarUrl?: string | null;
};

export const EmbedPageConversation = ({
  messages,
  author,
  avatarUrl,
}: EmbedPageConversationProps) => {
  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => (
        <ChatItem key={message.uuid} variant={message.role} className="pb-0">
          {message.role === "assistant" ? (
            <Avatar size="sm">
              <AvatarImage src={AVATAR_ASSISTANT_IMAGE_SRC} />
            </Avatar>
          ) : null}
          <ChatContent>{message.content.map(block)}</ChatContent>
          {message.role === "user" ? (
            <Avatar size="sm">
              <AvatarImage src={avatarUrl ?? undefined} />
              <AvatarFallback name={author} />
            </Avatar>
          ) : null}
        </ChatItem>
      ))}
    </div>
  );
};
