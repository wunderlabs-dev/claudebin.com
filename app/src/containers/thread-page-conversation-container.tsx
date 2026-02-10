"use client";

import { useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { block } from "@/utils/renderers";
import { getMessagesBySessionId } from "@/server/actions/messages";

import { compactConversation, getAvatarChar } from "@/utils/helpers";
import { APP_THREADS_URL, AVATAR_ASSISTANT_IMAGE_SRC } from "@/utils/constants";

import { Chat, ChatItem, ChatContent } from "@/components/ui/chat";
import { CopyInput } from "@/components/ui/copy-input";
import { Typography } from "@/components/ui/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ThreadPageConversationSkeleton } from "@/components/thread-page-conversation-skeleton";

type ThreadPageConversationContainerProps = {
  id: string;
  author: string;
  avatarUrl?: string | null;
  isAuthor?: boolean;
  isPublic?: boolean;
};

const ThreadPageConversationContainer = ({
  id,
  author,
  avatarUrl,
}: ThreadPageConversationContainerProps): ReactNode => {
  const { data, isLoading } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => getMessagesBySessionId(id),
  });

  const t = useTranslations();
  const fallback = getAvatarChar(author);
  const messages = useMemo(() => compactConversation(data?.messages), [data?.messages]);

  if (isLoading) {
    return <ThreadPageConversationSkeleton />;
  }

  return (
    <Chat className="min-h-screen lg:pr-12">
      {messages.map((message) => (
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
      ))}

      <ChatItem variant="assistant">
        <Avatar size="sm">
          <AvatarImage src={AVATAR_ASSISTANT_IMAGE_SRC} />
        </Avatar>

        <ChatContent className="w-auto" data-continue-conversation>
          <div className="flex flex-col gap-2">
            <Typography variant="h4">{t("thread.continueTitle")}</Typography>
            <Typography variant="small" color="muted">
              {t("thread.continueDescription")}
            </Typography>
          </div>

          <CopyInput variant="link" value={`${APP_THREADS_URL}/${id}`} />
        </ChatContent>
      </ChatItem>
    </Chat>
  );
};

export { ThreadPageConversationContainer };
