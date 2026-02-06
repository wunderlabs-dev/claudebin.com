"use client";

import { useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Virtuoso } from "react-virtuoso";

import { getMessagesBySessionId } from "@/actions/messages";

import { block } from "@/utils/renderers";
import { compactConversation } from "@/utils/helpers";

import { AVATAR_ASSISTANT_IMAGE_SRC } from "@/utils/constants";

import { ChatItem, ChatContent } from "@/components/ui/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThreadPageConversationSkeleton } from "@/components/thread-page-conversation-skeleton";
import { ThreadPageConversationContinue } from "@/components/thread-page-conversation-continue";

type ThreadPageConversationContainerProps = {
  id: string;
  author: string;
  avatarUrl?: string | null;
  isAuthor: boolean;
  isPublic: boolean;
};

const ThreadPageConversationContainer = ({
  id,
  author,
  avatarUrl,
  isAuthor,
  isPublic,
}: ThreadPageConversationContainerProps): ReactNode => {
  const { data, isLoading } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => getMessagesBySessionId(id),
  });

  const messages = useMemo(() => compactConversation(data?.messages), [data?.messages]);
  const [fallback] = [...author];

  if (isLoading) {
    return <ThreadPageConversationSkeleton />;
  }

  return (
    <div className="lg:pr-12">
      <Virtuoso
        useWindowScroll
        data={messages}
        itemContent={(_, message) => (
          <ChatItem key={message.uuid} variant={message.role}>
            {message.role === "assistant" ? (
              <Avatar size="sm">
                <AvatarImage src={AVATAR_ASSISTANT_IMAGE_SRC} />
              </Avatar>
            ) : null}
            <ChatContent>{message.content.map(block)}</ChatContent>
            {message.role === "user" ? (
              <Avatar size="sm">
                <AvatarImage src={avatarUrl ?? undefined} />
                <AvatarFallback>{fallback}</AvatarFallback>
              </Avatar>
            ) : null}
          </ChatItem>
        )}
        components={{
          Footer: () => (
            <ThreadPageConversationContinue id={id} isAuthor={isAuthor} isPublic={isPublic} />
          ),
        }}
      />
    </div>
  );
};

export { ThreadPageConversationContainer };
