"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/utils/helpers";

import { SvgIconBrain } from "@/components/icon/svg-icon-brain";
import { SvgIconCalendar } from "@/components/icon/svg-icon-calendar";
import { SvgIconChat } from "@/components/icon/svg-icon-chat";
import { SvgIconEye } from "@/components/icon/svg-icon-eye";
import { SvgIconFile } from "@/components/icon/svg-icon-file";
import { SvgIconFolder } from "@/components/icon/svg-icon-folder";

import { List, ListItem } from "@/components/ui/list";

import { ThreadPageSidebarLikeContainer } from "@/containers/thread-page-sidebar-like-container";
import { ThreadPageVisibilityContainer } from "@/containers/thread-page-visibility-container";

type ThreadPageThreadMetaProps = {
  id: string;
  createdAt: string;
  fileCount: number;
  viewCount: number;
  likeCount: number;
  workingDir?: string | null;
  modelName?: string | null;
  messageCount?: number | null;
  initialLiked?: boolean;
  isPublic?: boolean;
  isAuthor?: boolean;
  className?: string;
};

const ThreadPageThreadMeta = ({
  id,
  createdAt,
  fileCount,
  viewCount,
  likeCount,
  workingDir,
  modelName,
  messageCount,
  initialLiked,
  isPublic,
  isAuthor,
  className,
}: ThreadPageThreadMetaProps) => {
  const t = useTranslations();

  return (
    <div className={cn("flex flex-col items-start gap-6", className)}>
      <ThreadPageVisibilityContainer id={id} initialIsPublic={isPublic} isAuthor={isAuthor} />

      <List className="w-full gap-3 pb-9 border-b border-gray-250 lg:pb-0 lg:border-b-0">
        <ListItem icon={<SvgIconBrain size="sm" color="neutral" />}>{modelName}</ListItem>
        <ListItem icon={<SvgIconCalendar size="sm" color="neutral" />}>
          {t("thread.created", { date: createdAt })}
        </ListItem>
        <ListItem icon={<SvgIconFolder size="sm" color="neutral" />}>{workingDir}</ListItem>
        {messageCount ? (
          <ListItem icon={<SvgIconChat size="sm" color="neutral" />}>
            {t("common.messages", { count: messageCount })}
          </ListItem>
        ) : null}
        <ListItem icon={<SvgIconFile size="sm" color="neutral" />}>
          {t("common.files", { count: fileCount })}
        </ListItem>
        <ListItem icon={<SvgIconEye size="sm" color="neutral" />}>
          {t("common.views", { count: viewCount })}
        </ListItem>
        <ThreadPageSidebarLikeContainer id={id} initialLiked={initialLiked} likeCount={likeCount} />
      </List>
    </div>
  );
};

export { ThreadPageThreadMeta };
