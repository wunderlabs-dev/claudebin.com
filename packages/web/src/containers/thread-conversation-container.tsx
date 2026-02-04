"use client";

import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { BlockType, MessageRole } from "@/supabase/types/message";
import type { ContentBlock } from "@/supabase/types/message";
import type { Message } from "@/supabase/repos/messages";

import { getMessagesBySessionId } from "@/actions/messages";
import { AVATAR_ASSISTANT_IMAGE_SRC } from "@/utils/constants";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Chat, ChatItem, ChatContent } from "@/components/ui/chat";

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
import { ChatPageChatContentToolUse } from "@/components/chat-page-chat-content-tool-use";
import { ChatPageChatContentMcp } from "@/components/chat-page-chat-content-mcp";

type ThreadConversationContainerProps = {
  id: string;
  author: string;
  avatarUrl?: string | null;
};

const renderBlock = (block: ContentBlock, index: number): ReactNode => {
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
    case BlockType.TOOL_USE:
      return <ChatPageChatContentToolUse key={index} block={block} />;
    case BlockType.MCP:
      return <ChatPageChatContentMcp key={index} block={block} />;
    default:
      return null;
  }
};

const renderMessage = (
  message: Message,
  author: string,
  avatarUrl: string | null | undefined,
): ReactNode => {
  const isUser = message.role === MessageRole.USER;
  const fallback = author.charAt(0).toUpperCase();

  return (
    <ChatItem key={message.uuid} variant={isUser ? "user" : "assistant"}>
      <Avatar size="sm">
        {isUser ? (
          <>
            <AvatarImage src={avatarUrl ?? undefined} />
            <AvatarFallback>{fallback}</AvatarFallback>
          </>
        ) : (
          <AvatarImage src={AVATAR_ASSISTANT_IMAGE_SRC} />
        )}
      </Avatar>

      <ChatContent>{message.content.map(renderBlock)}</ChatContent>
    </ChatItem>
  );
};

const ThreadConversationContainer = ({
  id,
  author,
  avatarUrl,
}: ThreadConversationContainerProps): ReactNode => {
  const { data, isLoading } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => getMessagesBySessionId(id),
  });

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  if (!data || data.messages.length === 0) {
    return <div className="p-4 text-gray-500">No messages found.</div>;
  }

  return (
    <Chat className="pr-14">
      {data.messages.map((message) => renderMessage(message, author, avatarUrl))}
    </Chat>
  );
};

export { ThreadConversationContainer };
