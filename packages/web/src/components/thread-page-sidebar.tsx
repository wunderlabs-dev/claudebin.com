import type { ReactNode } from "react";

import { useTranslations } from "next-intl";

import {
  SvgIconChat,
  SvgIconEye,
  SvgIconFile,
  SvgIconFolder,
  SvgIconFork,
  SvgIconGlobe,
  SvgIconJauge,
  SvgIconLine,
  SvgIconCalendar,
} from "@/components/icon";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyInput } from "@/components/ui/copy-input";
import { List, ListItem } from "@/components/ui/list";

type ThreadPageSidebarProps = {
  id: string;
  visibility: "public" | "private";
  createdAt: string;
  project: string;
  prompts: number;
  linesWritten: number;
  files: number;
  views: number;
  forks: number;
  progress: number;
};

const ThreadPageSidebar = ({
  id,
  visibility,
  createdAt,
  project,
  prompts,
  linesWritten,
  files,
  views,
  forks,
  progress,
}: ThreadPageSidebarProps): ReactNode => {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-start gap-6">
      <Badge variant="neutral">
        <SvgIconGlobe size="sm" />
        {visibility === "public" ? t("common.public") : t("common.private")}
      </Badge>

      <List className="w-full gap-3">
        <ListItem icon={<SvgIconCalendar size="sm" color="neutral" />}>
          {t("thread.created", { date: createdAt })}
        </ListItem>
        <ListItem icon={<SvgIconFolder size="sm" color="neutral" />}>{project}</ListItem>
        <ListItem icon={<SvgIconChat size="sm" color="neutral" />}>
          {t("common.prompts", { count: prompts })}
        </ListItem>
        <ListItem icon={<SvgIconLine size="sm" color="neutral" />}>
          {t("thread.linesWritten", { count: linesWritten })}
        </ListItem>
        <ListItem icon={<SvgIconFile size="sm" color="neutral" />}>
          {t("common.files", { count: files })}
        </ListItem>
        <ListItem icon={<SvgIconEye size="sm" color="neutral" />}>
          {t("common.views", { count: views })}
        </ListItem>
        <ListItem icon={<SvgIconFork size="sm" color="neutral" />}>
          {t("common.forks", { count: forks })}
        </ListItem>
        <ListItem icon={<SvgIconJauge size="sm" color="neutral" />}>
          {progress}
        </ListItem>
      </List>

      <div className="w-full flex flex-col gap-8">
        <CopyInput variant="link" value="https://claudebin.com/threads/" />
        <CopyInput variant="snippet" value="https://claudebin.com/threads/V1StGXR8_Z5jdHi6B-myT" />
        <Button variant="secondary">
          <SvgIconChat />
          {t("thread.continueConversation")}
        </Button>
      </div>
    </div>
  );
};

export { ThreadPageSidebar };
