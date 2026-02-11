"use client";

import { useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { isNil, isNotNil } from "ramda";

import { getMessagesBySessionId } from "@/server/actions/messages";

import { AVATAR_ASSISTANT_IMAGE_SRC } from "@/utils/constants";

import { block } from "@/utils/renderers";
import { cn, compactConversation, isIndexWithin } from "@/utils/helpers";

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
  const { view, start, end, candidate, from, to, setStart, setEnd, setCandidate } =
    useThreadEmbed();

  const { data, isLoading } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => getMessagesBySessionId(id),
  });

  const messages = useMemo(() => compactConversation(data?.messages), [data?.messages]);

  if (isLoading) {
    return <ThreadPageConversationSkeleton />;
  }

  const inSelection = (idx: number) => {
    if (isNotNil(from) && isNotNil(to)) {
      return isIndexWithin(idx, from, to);
    }
    if (isNotNil(start) && isNotNil(candidate)) {
      return isIndexWithin(idx, start, candidate);
    }
  };

  const handleClick = (idx: number) => {
    if (view !== "embed") {
      return null;
    }

    if (isNil(start) || isNotNil(end)) {
      setStart(idx);
    } else {
      setEnd(idx);
    }
  };

  return (
    <Chat className="min-h-screen lg:pr-12">
      {messages.map((message) => (
        <ChatItem
          key={message.uuid}
          variant={message.role}
          className={cn(
            view === "embed" ? "cursor-pointer opacity-30 hover:opacity-100" : undefined,
            view === "embed" && inSelection(message.idx) ? "opacity-100" : undefined,
          )}
          onMouseEnter={() => view === "embed" && setCandidate(message.idx)}
          onMouseLeave={() => view === "embed" && setCandidate(undefined)}
          onClick={() => handleClick(message.idx)}
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
              <AvatarFallback name={author} />
            </Avatar>
          ) : null}
        </ChatItem>
      ))}

      <ThreadPageConversationContinue id={id} />
    </Chat>
  );
};

export { ThreadPageConversationContainer };
