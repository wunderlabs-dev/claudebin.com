"use client";

import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import type { ContentBlock } from "@/supabase/types/message";
import { BlockType } from "@/supabase/types/message";

import { getMessagesBySessionId } from "@/actions/messages";
import { AVATAR_ASSISTANT_IMAGE_SRC } from "@/utils/constants";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Chat, ChatItem, ChatContent } from "@/components/ui/chat";

import { ChatPageChatContentText } from "@/components/chat-page-chat-content-text";
import { ChatPageChatContentBash } from "@/components/chat-page-chat-content-bash";
import { ChatPageChatContentFileRead } from "@/components/chat-page-chat-content-file-read";
import { ChatPageChatContentFileWrite } from "@/components/chat-page-chat-content-file-write";
import { ChatPageChatContentFileEdit } from "@/components/chat-page-chat-content-file-edit";
import { ChatPageChatContentGlob } from "@/components/chat-page-chat-content-glob";
import { ChatPageChatContentGrep } from "@/components/chat-page-chat-content-grep";
import { ChatPageChatContentTask } from "@/components/chat-page-chat-content-task";
import { ChatPageChatContentQuestion } from "@/components/chat-page-chat-content-question";
import { ChatPageChatContentTodo } from "@/components/chat-page-chat-content-todo";
import { ChatPageChatContentWebFetch } from "@/components/chat-page-chat-content-web-fetch";
import { ChatPageChatContentWebSearch } from "@/components/chat-page-chat-content-web-search";
import { ChatPageChatContentToolResult } from "@/components/chat-page-chat-content-tool-result";
import { ChatPageChatContentToolUse } from "@/components/chat-page-chat-content-tool-use";

type ThreadPageConversationContainerProps = {
  id: string;
  author: string;
  avatarUrl?: string | null;
};

const renderers = {
  block: (block: ContentBlock, index: number): ReactNode => {
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
      case BlockType.QUESTION:
        return <ChatPageChatContentQuestion key={index} block={block} />;
      case BlockType.TODO:
        return <ChatPageChatContentTodo key={index} block={block} />;
      case BlockType.WEB_FETCH:
        return <ChatPageChatContentWebFetch key={index} block={block} />;
      case BlockType.WEB_SEARCH:
        return <ChatPageChatContentWebSearch key={index} block={block} />;
      case BlockType.TOOL_RESULT:
        return <ChatPageChatContentToolResult key={index} block={block} />;
      case BlockType.TOOL_USE:
        return <ChatPageChatContentToolUse key={index} block={block} />;
      default: {
        return null;
      }
    }
  }
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
    <Chat className="pr-14">
      {messages.map((message) => (
        <ChatItem key={message.id} variant={message.role}>
          {message.role === "assistant" ? (
            <Avatar size="sm">
              <AvatarImage src={AVATAR_ASSISTANT_IMAGE_SRC} />
            </Avatar>
          ) : null}
          <ChatContent variant={message.role}>
            {message.content.map(renderers.block)}
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
