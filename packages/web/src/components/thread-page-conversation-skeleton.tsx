"use client";

import { Chat, ChatItem, ChatContent } from "@/components/ui/chat";
import { SkeletonAvatar, SkeletonBar } from "@/components/ui/skeleton";

const ThreadPageConversationSkeleton = () => {
  return (
    <Chat className="min-h-screen lg:pr-12">
      <ChatItem variant="user">
        <ChatContent className="w-1/4">
          <SkeletonBar className="w-full" />
        </ChatContent>
        <SkeletonAvatar />
      </ChatItem>

      <ChatItem variant="assistant">
        <SkeletonAvatar />
        <ChatContent className="w-full md:w-3/4">
          <SkeletonBar className="w-full" />
          <SkeletonBar className="w-full" />
          <SkeletonBar className="w-2/3" />
        </ChatContent>
      </ChatItem>

      <ChatItem variant="user">
        <ChatContent className="w-1/3">
          <SkeletonBar className="w-1/3" />
          <SkeletonBar className="w-full" />
        </ChatContent>
        <SkeletonAvatar />
      </ChatItem>

      <ChatItem variant="assistant">
        <SkeletonAvatar />
        <ChatContent className="w-full md:w-2/3">
          <SkeletonBar className="w-full" />
          <SkeletonBar className="w-full" />
          <SkeletonBar className="w-4/5" />
          <SkeletonBar className="w-1/2" />
        </ChatContent>
      </ChatItem>
    </Chat>
  );
};

export { ThreadPageConversationSkeleton };
