"use client";

import type { ReactNode } from "react";

import { useTranslations } from "next-intl";

import {
  SvgIconChat,
  SvgIconEye,
  SvgIconFile,
  SvgIconFolder,
  SvgIconGlobe,
  SvgIconCalendar,
} from "@/components/icon";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyInput } from "@/components/ui/copy-input";
import { List, ListItem } from "@/components/ui/list";

type ThreadPageSidebarContainerProps = {
  id: string;
  createdAt: string;
  workingDir: string;
  fileCount: number;
  viewCount: number;
  likeCount: number;
  messageCount: number;
  isPublic: boolean;
};

const ThreadPageSidebarContainer = ({
  isPublic,
  createdAt,
  workingDir,
  viewCount,
  fileCount,
  likeCount,
  messageCount,
}: ThreadPageSidebarContainerProps): ReactNode => {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-start gap-6">
      <Badge variant="neutral">
        <SvgIconGlobe size="sm" />
        {isPublic ? t("common.public") : t("common.private")}
      </Badge>

      <List className="w-full gap-3">
        <ListItem icon={<SvgIconCalendar size="sm" color="neutral" />}>
          {t("thread.created", { date: createdAt })}
        </ListItem>
        <ListItem icon={<SvgIconFolder size="sm" color="neutral" />}>{workingDir}</ListItem>
        <ListItem icon={<SvgIconChat size="sm" color="neutral" />}>
          {t("common.prompts", { count: messageCount })}
        </ListItem>
        <ListItem icon={<SvgIconFile size="sm" color="neutral" />}>
          {t("common.files", { count: fileCount })}
        </ListItem>
        <ListItem icon={<SvgIconEye size="sm" color="neutral" />}>
          {t("common.views", { count: viewCount })}
        </ListItem>
      </List>

      <div className="flex w-full flex-col gap-8">
        <CopyInput variant="link" />
        <CopyInput variant="snippet" />
        <Button variant="secondary">
          <SvgIconChat />
          {t("thread.continueConversation")}
        </Button>
      </div>
    </div>
  );
};

export { ThreadPageSidebarContainer };
