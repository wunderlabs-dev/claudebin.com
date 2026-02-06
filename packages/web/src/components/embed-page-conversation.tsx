import type { Message } from "@/supabase/repos/messages";

import { AVATAR_ASSISTANT_IMAGE_SRC } from "@/utils/constants";
import { renderBlock } from "@/utils/renderers";

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
  const [fallback] = [...author];

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => (
        <ChatItem key={message.uuid} variant={message.role} className="pb-0">
          {message.role === "assistant" ? (
            <Avatar size="sm">
              <AvatarImage src={AVATAR_ASSISTANT_IMAGE_SRC} />
            </Avatar>
          ) : null}
          <ChatContent>{message.content.map(renderBlock)}</ChatContent>
          {message.role === "user" ? (
            <Avatar size="sm">
              <AvatarImage src={avatarUrl ?? undefined} />
              <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
          ) : null}
        </ChatItem>
      ))}
    </div>
  );
};
