"use client";

import type { ReactNode } from "react";

import { BlockType } from "@/supabase/types/message";
import type { ContentBlock } from "@/supabase/types/message";
import type { Message } from "@/supabase/repos/messages";

import { APP_THREADS_URL, AVATAR_ASSISTANT_IMAGE_SRC } from "@/utils/constants";

import { Chat, ChatItem, ChatContent } from "@/components/ui/chat";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";

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

type ThreadEmbedContainerProps = {
  sessionId: string;
  title: string | null;
  messages: Message[];
  range: { from: number; to: number };
};

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

const ThreadEmbedContainer = ({
  sessionId,
  title,
  messages,
  range,
}: ThreadEmbedContainerProps): ReactNode => {
  const threadUrl = `${APP_THREADS_URL}/${sessionId}`;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <Typography variant="small" color="muted">
          {title ?? "Untitled"} · Messages {range.from}-{range.to}
        </Typography>
        <a
          href={threadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-orange-50 hover:underline"
        >
          View full thread →
        </a>
      </div>

      <Chat>
        {messages.map((message) => (
          <ChatItem key={message.uuid} variant={message.role}>
            {message.role === "assistant" ? (
              <Avatar size="sm">
                <AvatarImage src={AVATAR_ASSISTANT_IMAGE_SRC} />
              </Avatar>
            ) : null}
            <ChatContent>{message.content.map(renderer.message)}</ChatContent>
          </ChatItem>
        ))}
      </Chat>

      <div className="flex justify-center pt-2 border-t border-gray-200">
        <a
          href="https://claudebin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Powered by Claudebin
        </a>
      </div>
    </div>
  );
};

export { ThreadEmbedContainer };
