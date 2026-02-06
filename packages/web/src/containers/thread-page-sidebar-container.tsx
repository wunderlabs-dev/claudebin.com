"use client";

import { isServer } from "@tanstack/react-query";
import { useMediaQuery } from "usehooks-ts";

import { breakpoints } from "@/utils/breakpoints";
import { APP_THREADS_URL } from "@/utils/constants";

import { CopyInput } from "@/components/ui/copy-input";

import { ThreadPageThreadMeta } from "@/components/thread-page-thread-meta";
import { ThreadPageSidebarContinueConversation } from "@/components/thread-page-sidebar-continue-conversation";

type ThreadPageSidebarContainerProps = {
  id: string;
  createdAt: string;
  fileCount: number;
  viewCount: number;
  likeCount: number;
  workingDir?: string | null;
  modelName?: string | null;
  messageCount?: number | null;
  isPublic: boolean;
  initialLiked?: boolean;
};

const ThreadPageSidebarContainer = ({
  id,
  isPublic,
  initialLiked,
  createdAt,
  workingDir,
  modelName,
  viewCount,
  fileCount,
  likeCount,
  messageCount,
}: ThreadPageSidebarContainerProps) => {
  const lg = useMediaQuery(breakpoints.lg, { initializeWithValue: isServer });

  return (
    <div className="flex flex-col items-start gap-6">
      {lg ? (
        <ThreadPageThreadMeta
          id={id}
          isPublic={isPublic}
          createdAt={createdAt}
          fileCount={fileCount}
          viewCount={viewCount}
          likeCount={likeCount}
          workingDir={workingDir}
          modelName={modelName}
          messageCount={messageCount}
          initialLiked={initialLiked}
        />
      ) : null}

      <div className="flex flex-col w-full gap-8">
        <CopyInput variant="link" value={`${APP_THREADS_URL}/${id}`} />
        <ThreadPageSidebarContinueConversation />
      </div>
    </div>
  );
};

export { ThreadPageSidebarContainer };
