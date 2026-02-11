"use client";

import { useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { getMessagesBySessionId } from "@/server/actions/messages";

import { AVATAR_ASSISTANT_IMAGE_SRC } from "@/utils/constants";

import { block } from "@/utils/renderers";
import { cn, compactConversation, getAvatarChar } from "@/utils/helpers";

import { useThreadEmbed } from "@/context/thread-embed";

import { Chat, ChatItem, ChatContent } from "@/components/ui/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ThreadPageConversationSkeleton } from "@/components/thread-page-conversation-skeleton";
import { ThreadPageConversationContinue } from "@/components/thread-page-conversation-continue";

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
  const { isEmbedMode, selectEmbedIndex, setEmbedPreviewTo, isInEmbedSelection } = useThreadEmbed();

  const { data, isLoading } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => getMessagesBySessionId(id),
  });

  const fallback = getAvatarChar(author);
  const messages = useMemo(() => compactConversation(data?.messages), [data?.messages]);

  if (isLoading) {
    return <ThreadPageConversationSkeleton />;
  }

  const handleChatClick = (idx: number) => {
    if (isEmbedMode) {
      selectEmbedIndex(idx);
    }
  };

  return (
    <Chat className="min-h-screen lg:pr-12">
      {messages.map((message) => (
        <ChatItem
          key={message.uuid}
          variant={message.role}
          className={cn(
            isEmbedMode && "cursor-pointer opacity-30 hover:opacity-100",
            isEmbedMode && isInEmbedSelection(message.idx) && "opacity-100",
          )}
          onClick={() => handleChatClick(message.idx)}
          onMouseEnter={() => isEmbedMode && setEmbedPreviewTo(message.idx)}
          onMouseLeave={() => isEmbedMode && setEmbedPreviewTo(undefined)}
        >
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
      ))}

      <ThreadPageConversationContinue id={id} />
    </Chat>
  );
};

export { ThreadPageConversationContainer };
