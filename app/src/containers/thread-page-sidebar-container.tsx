"use client";

import { Fragment } from "react";
import { isServer } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "usehooks-ts";

import { APP_URL } from "@/utils/constants";
import { mediaQueries } from "@/utils/mediaQueries";

import { useThreadEmbed } from "@/context/thread-embed";

import { SvgIconArrowLink } from "@/components/icon/svg-icon-arrow-link";
import { Button } from "@/components/ui/button";
import { CopyInput } from "@/components/ui/copy-input";

import { ThreadPageThreadMeta } from "@/components/thread-page-thread-meta";
import { ThreadPageThreadEmbed } from "@/components/thread-page-thread-embed";
import { ThreadPageSidebarContinueConversation } from "@/components/thread-page-sidebar-continue-conversation";
import { ThreadPageSidebarDeleteContainer } from "@/containers/thread-page-sidebar-delete-container";

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
  const lg = useMediaQuery(mediaQueries.lg, { initializeWithValue: isServer });

  const { view, from, to, start, setView } = useThreadEmbed();

  return (
    <div className="flex flex-col items-start gap-6">
      {view === "default" ? (
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
            <CopyInput variant="link" value={`${APP_URL}/threads/${id}`} />

            <div className="flex flex-col gap-4">
              <Button variant="secondary" onClick={() => setView("embed")}>
                <SvgIconArrowLink />
                {t("thread.embedConversation")}
              </Button>

              <ThreadPageSidebarContinueConversation />
              {isAuthor ? <ThreadPageSidebarDeleteContainer /> : null}
            </div>
          </div>
        </Fragment>
      ) : (
        <ThreadPageThreadEmbed
          id={id}
          from={from}
          to={to}
          start={start}
          onClose={() => setView("default")}
        />
      )}
    </div>
  );
};

export { ThreadPageSidebarContainer };
