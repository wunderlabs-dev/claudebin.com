"use client";

import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { getMessagesBySessionId } from "@/actions/messages";
import { AVATAR_ASSISTANT_IMAGE_SRC } from "@/utils/constants";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Chat, ChatItem, ChatContent } from "@/components/ui/chat";

type ThreadPageConversationContainerProps = {
  id: string;
  author: string;
  avatarUrl?: string | null;
};

const ThreadPageConversationContainer = ({
  id,
  author,
  avatarUrl,
}: ThreadPageConversationContainerProps): ReactNode => {
  const { data } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => getMessagesBySessionId(id),
  });

  const messages = data?.messages ?? [];
  const [fallback] = [...author];

  return (
    <Chat>
      {messages.map((message) => (
        <ChatItem key={message.id}>
          {message.role === "assistant" ? (
            <Avatar size="sm">
              <AvatarImage src={AVATAR_ASSISTANT_IMAGE_SRC} />
            </Avatar>
          ) : null}
          <ChatContent variant={message.role}>
            {message.id}
          </ChatContent>
          {message.role === "user" ? (
            <Avatar size="sm">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt={author} /> : null}
              <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
          ) : null}
        </ChatItem>
      ))}
    </Chat>
  );
};

export { ThreadPageConversationContainer };
