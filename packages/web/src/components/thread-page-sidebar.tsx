import type { ReactNode } from "react";

import { useTranslations } from "next-intl";

import {
  SvgIconArrowLink,
  SvgIconCalendar,
  SvgIconChat,
  SvgIconEye,
  SvgIconFile,
  SvgIconFolder,
  SvgIconFork,
  SvgIconGlobe,
  SvgIconJauge,
  SvgIconLine,
} from "@/components/icon";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { List, ListItem } from "@/components/ui/list";
import { Progress } from "@/components/ui/progress";
import { Typography } from "@/components/ui/typography";

type ThreadPageSidebarProps = {
  public: boolean;
  createdAt: string;
  project: string;
  prompts: number;
  linesWritten: number;
  additions: number;
  deletions: number;
  modifications: number;
  files: number;
  views: number;
  forks: number;
  progress: number;
};

const ThreadPageSidebar = ({
  public: isPublic,
  createdAt,
  project,
  prompts,
  linesWritten,
  additions,
  deletions,
  modifications,
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
        {isPublic ? t("common.public") : t("common.private")}
      </Badge>

      <List className="gap-3">
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
        <ListItem icon={<SvgIconJauge size="sm" color="neutral" />}>{progress}</ListItem>
      </List>

      <div className="flex flex-col gap-4">
        <Button variant="secondary">
          <SvgIconArrowLink />
          {t("thread.openSharing")}
        </Button>
        <Button variant="secondary">
          <SvgIconFork />
          {t("thread.fork")}
        </Button>
        <Button variant="secondary">
          <SvgIconChat />
          {t("thread.continueConversation")}
        </Button>
      </div>
    </div>
  );
};

export { ThreadPageSidebar };
