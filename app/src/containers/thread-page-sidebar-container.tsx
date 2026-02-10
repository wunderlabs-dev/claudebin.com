"use client";

import { Fragment } from "react";
import { isServer } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "usehooks-ts";

import { useThreadEmbed } from "@/context/thread-embed";

import { breakpoints } from "@/utils/breakpoints";
import { APP_THREADS_URL } from "@/utils/constants";

import { SvgIconArrowLink } from "@/components/icon/svg-icon-arrow-link";
import { Button } from "@/components/ui/button";
import { CopyInput } from "@/components/ui/copy-input";

import { ThreadPageThreadMeta } from "@/components/thread-page-thread-meta";
import { ThreadPageThreadEmbed } from "@/components/thread-page-thread-embed";
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
  isAuthor: boolean;
  initialLiked?: boolean;
};

const ThreadPageSidebarContainer = ({
  id,
  isPublic,
  isAuthor,
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

  const { view, onChangeEmbedMode } = useThreadEmbed();

  return (
    <div className="flex flex-col items-start gap-6">
      {view === "view" ? (
        <Fragment>
          {lg ? (
            <ThreadPageThreadMeta
              id={id}
              isPublic={isPublic}
              isAuthor={isAuthor}
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

            <div className="flex flex-col gap-4">
              <Button variant="secondary" onClick={onChangeEmbedMode}>
                <SvgIconArrowLink />
                {t("thread.embedConversation")}
              </Button>

              <ThreadPageSidebarContinueConversation />
            </div>
          </div>
        </Fragment>
      ) : (
        <ThreadPageThreadEmbed id={id} onClose={onChangeEmbedMode} />
      )}
    </div>
  );
};

export { ThreadPageSidebarContainer };
