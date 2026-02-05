"use client";

import { useTranslations } from "next-intl";

import {
  SvgIconBrain,
  SvgIconCalendar,
  SvgIconChat,
  SvgIconEye,
  SvgIconFile,
  SvgIconFolder,
} from "@/components/icon";

import { List, ListItem } from "@/components/ui/list";

import { ThreadPageSidebarLikeContainer } from "@/containers/thread-page-sidebar-like-container";

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
}: ThreadPageThreadMetaProps) => {
  const t = useTranslations();

  return (
    <List className="w-full gap-3 pb-9 lg:pb-0 border-b lg:border-b-0 border-gray-250">
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
  );
};

export { ThreadPageThreadMeta };
