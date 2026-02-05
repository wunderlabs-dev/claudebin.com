"use client";

import { useTranslations } from "next-intl";

import { breakpoints } from "@/utils/breakpoints";
import { APP_THREADS_URL } from "@/utils/constants";

import { SvgIconGlobe } from "@/components/icon";
import { CopyInput } from "@/components/ui/copy-input";
import { Badge } from "@/components/ui/badge";

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
  const t = useTranslations();
  const lg = useMediaQuery(breakpoints.lg, { initializeWithValue: isServer });

  return (
    <div className="flex flex-col items-start gap-6">
      <Badge variant="neutral">
        <SvgIconGlobe size="sm" />
        {isPublic ? t("common.public") : t("common.private")}
      </Badge>

      <ThreadPageThreadMeta
        id={id}
        createdAt={createdAt}
        fileCount={fileCount}
        viewCount={viewCount}
        likeCount={likeCount}
        workingDir={workingDir}
        modelName={modelName}
        messageCount={messageCount}
        initialLiked={initialLiked}
      />

      <div className="flex flex-col w-full gap-8">
        <CopyInput variant="link" value={`${APP_THREADS_URL}/${id}`} />
        <CopyInput variant="snippet" value="npx claudebin publish" />
        <ThreadPageSidebarContinueConversation />
      </div>
    </div>
  );
};

export { ThreadPageSidebarContainer };
