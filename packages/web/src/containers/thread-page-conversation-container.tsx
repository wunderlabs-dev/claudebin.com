"use client";

import { useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { last, concat, init, reduce } from "ramda";
import { Virtuoso } from "react-virtuoso";

import { BlockType, MessageRole } from "@/supabase/types/message";
import type { Message } from "@/supabase/repos/messages";
import type { ContentBlock } from "@/supabase/types/message";

import { getMessagesBySessionId } from "@/actions/messages";
import { AVATAR_ASSISTANT_IMAGE_SRC } from "@/utils/constants";

import { ChatItem, ChatContent } from "@/components/ui/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ThreadPageConversationText } from "@/components/thread-page-conversation-text";
import { ThreadPageConversationBash } from "@/components/thread-page-conversation-bash";
import { ThreadPageConversationFileRead } from "@/components/thread-page-conversation-file-read";
import { ThreadPageConversationFileWrite } from "@/components/thread-page-conversation-file-write";
import { ThreadPageConversationFileEdit } from "@/components/thread-page-conversation-file-edit";
import { ThreadPageConversationGlob } from "@/components/thread-page-conversation-glob";
import { ThreadPageConversationGrep } from "@/components/thread-page-conversation-grep";
import { ThreadPageConversationTask } from "@/components/thread-page-conversation-task";
import { ThreadPageConversationTaskOutput } from "@/components/thread-page-conversation-task-output";
import { ThreadPageConversationTaskStop } from "@/components/thread-page-conversation-task-stop";
import { ThreadPageConversationTasks } from "@/components/thread-page-conversation-tasks";
import { ThreadPageConversationQuestions } from "@/components/thread-page-conversation-questions";
import { ThreadPageConversationWebFetch } from "@/components/thread-page-conversation-web-fetch";
import { ThreadPageConversationWebSearch } from "@/components/thread-page-conversation-web-search";
import { ThreadPageConversationMcp } from "@/components/thread-page-conversation-mcp";
import { ThreadPageConversationGeneric } from "@/components/thread-page-conversation-generic";
import { ThreadPageConversationSkill } from "@/components/thread-page-conversation-skill";
import { ThreadPageConversationSkeleton } from "@/components/thread-page-conversation-skeleton";
import { ThreadPageConversationContinue } from "@/components/thread-page-conversation-continue";

type ThreadPageConversationContainerProps = {
  id: string;
  author: string;
  avatarUrl?: string | null;
  isAuthor: boolean;
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
        return <ThreadPageConversationText key={index} block={block} />;
      case BlockType.BASH:
        return <ThreadPageConversationBash key={index} block={block} />;
      case BlockType.FILE_READ:
        return <ThreadPageConversationFileRead key={index} block={block} />;
      case BlockType.FILE_WRITE:
        return <ThreadPageConversationFileWrite key={index} block={block} />;
      case BlockType.FILE_EDIT:
        return <ThreadPageConversationFileEdit key={index} block={block} />;
      case BlockType.GLOB:
        return <ThreadPageConversationGlob key={index} block={block} />;
      case BlockType.GREP:
        return <ThreadPageConversationGrep key={index} block={block} />;
      case BlockType.TASK:
        return <ThreadPageConversationTask key={index} block={block} />;
      case BlockType.TASK_OUTPUT:
        return <ThreadPageConversationTaskOutput key={index} block={block} />;
      case BlockType.TASK_STOP:
        return <ThreadPageConversationTaskStop key={index} block={block} />;
      case BlockType.TASKS:
        return <ThreadPageConversationTasks key={index} block={block} />;
      case BlockType.QUESTION:
        return <ThreadPageConversationQuestions key={index} block={block} />;
      case BlockType.WEB_FETCH:
        return <ThreadPageConversationWebFetch key={index} block={block} />;
      case BlockType.WEB_SEARCH:
        return <ThreadPageConversationWebSearch key={index} block={block} />;
      case BlockType.MCP:
        return <ThreadPageConversationMcp key={index} block={block} />;
      case BlockType.GENERIC:
        return <ThreadPageConversationGeneric key={index} block={block} />;
      case BlockType.SKILL:
        return <ThreadPageConversationSkill key={index} block={block} />;
      default:
        return null;
    }
  },
};

const ThreadPageConversationContainer = ({
  id,
  author,
  avatarUrl,
  isAuthor,
}: ThreadPageConversationContainerProps): ReactNode => {
  const { data, isLoading } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => getMessagesBySessionId(id),
  });

  const [fallback] = [...author];
  const messages = useMemo(() => compact(data?.messages), [data?.messages]);

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
            <ChatContent>{message.content.map(renderer.message)}</ChatContent>
            {message.role === "user" ? (
              <Avatar size="sm">
                <AvatarImage src={avatarUrl ?? undefined} />
                <AvatarFallback>{fallback}</AvatarFallback>
              </Avatar>
            ) : null}
          </ChatItem>
        )}
        components={{
          Footer: () => <ThreadPageConversationContinue id={id} isAuthor={isAuthor} />,
        }}
      />
    </div>
  );
};

export { ThreadPageConversationContainer };
