"use client";

import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { last, concat, init, reduce } from "ramda";

import { BlockType, MessageRole } from "@/supabase/types/message";
import type { ContentBlock } from "@/supabase/types/message";
import type { Message } from "@/supabase/repos/messages";
import { getMessagesBySessionId } from "@/actions/messages";

import { APP_THREADS_URL, AVATAR_ASSISTANT_IMAGE_SRC } from "@/utils/constants";

import { Chat, ChatItem, ChatContent } from "@/components/ui/chat";
import { CopyInput } from "@/components/ui/copy-input";
import { Typography } from "@/components/ui/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ChatPageChatContentText } from "@/components/chat-page-chat-content-text";
import { ChatPageChatContentBash } from "@/components/chat-page-chat-content-bash";
import { ChatPageChatContentFileRead } from "@/components/chat-page-chat-content-file-read";
import { ChatPageChatContentFileWrite } from "@/components/chat-page-chat-content-file-write";
import { ChatPageChatContentFileEdit } from "@/components/chat-page-chat-content-file-edit";
import { ChatPageChatContentGlob } from "@/components/chat-page-chat-content-glob";
import { ChatPageChatContentGrep } from "@/components/chat-page-chat-content-grep";
import { ChatPageChatContentTask } from "@/components/chat-page-chat-content-task";
import { ChatPageChatContentTasks } from "@/components/chat-page-chat-content-tasks";
import { ChatPageChatContentQuestions } from "@/components/chat-page-chat-content-questions";
import { ChatPageChatContentWebFetch } from "@/components/chat-page-chat-content-web-fetch";
import { ChatPageChatContentWebSearch } from "@/components/chat-page-chat-content-web-search";
import { ChatPageChatContentMcp } from "@/components/chat-page-chat-content-mcp";
import { ChatPageChatContentGeneric } from "@/components/chat-page-chat-content-generic";
import { ChatPageChatContentSkill } from "@/components/chat-page-chat-content-skill";

type ThreadPageConversationContainerProps = {
  id: string;
  author: string;
  avatarUrl?: string | null;
};

const compact = (messages: ReadonlyArray<Message> = []): Message[] =>
  reduce<Message, Message[]>(
    (accumulator, message) => {
      const previous = last(accumulator);
      const assistant =
        previous?.role === MessageRole.ASSISTANT && message.role === MessageRole.ASSISTANT;

      return assistant
        ? concat(init(accumulator), [
            { ...previous, content: concat(previous.content, message.content) },
          ])
        : concat(accumulator, [{ ...message }]);
    },
    [],
    [...messages],
  );

const renderer = {
  message: (block: ContentBlock, index: number): ReactNode => {
    switch (block.type) {
      case BlockType.TEXT:
        return <ChatPageChatContentText key={index} block={block} />;
      case BlockType.BASH:
        return <ChatPageChatContentBash key={index} block={block} />;
      case BlockType.FILE_READ:
        return <ChatPageChatContentFileRead key={index} block={block} />;
      case BlockType.FILE_WRITE:
        return <ChatPageChatContentFileWrite key={index} block={block} />;
      case BlockType.FILE_EDIT:
        return <ChatPageChatContentFileEdit key={index} block={block} />;
      case BlockType.GLOB:
        return <ChatPageChatContentGlob key={index} block={block} />;
      case BlockType.GREP:
        return <ChatPageChatContentGrep key={index} block={block} />;
      case BlockType.TASK:
        return <ChatPageChatContentTask key={index} block={block} />;
      case BlockType.TASKS:
        return <ChatPageChatContentTasks key={index} block={block} />;
      case BlockType.QUESTION:
        return <ChatPageChatContentQuestions key={index} block={block} />;
      case BlockType.WEB_FETCH:
        return <ChatPageChatContentWebFetch key={index} block={block} />;
      case BlockType.WEB_SEARCH:
        return <ChatPageChatContentWebSearch key={index} block={block} />;
      case BlockType.MCP:
        return <ChatPageChatContentMcp key={index} block={block} />;
      case BlockType.GENERIC:
        return <ChatPageChatContentGeneric key={index} block={block} />;
      case BlockType.SKILL:
        return <ChatPageChatContentSkill key={index} block={block} />;
      default:
        return null;
    }
  },
};

const ThreadPageConversationContainer = ({
  id,
  author,
  avatarUrl,
}: ThreadPageConversationContainerProps): ReactNode => {
  const t = useTranslations();

  const { data, isLoading } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => getMessagesBySessionId(id),
  });

  if (isLoading) {
    return null;
  }

  const [fallback] = [...author];
  const messages = compact(data?.messages);

  return (
    <Chat className="min-h-screen pr-12">
      {messages.map((message) => (
        <ChatItem key={message.uuid} variant={message.role}>
          {message.role === "assistant" ? (
            <Avatar size="sm">
              <AvatarImage src={AVATAR_ASSISTANT_IMAGE_SRC} />
            </Avatar>
          ) : null}

          <ChatContent>{message.content.map(renderer.message)}</ChatContent>

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
