import type { ReactNode } from "react";

import { useTranslations } from "next-intl";

import {
  SvgIconChat,
  SvgIconEye,
  SvgIconFile,
  SvgIconFolder,
  SvgIconGlobe,
  SvgIconLine,
  SvgIconCalendar,
} from "@/components/icon";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyInput } from "@/components/ui/copy-input";
import { Typography } from "@/components/ui/typography";
import { List, ListItem } from "@/components/ui/list";

type ThreadPageSidebarProps = {
  visibility: "public" | "private";
  createdAt: string;
  project: string;
  prompts: number;
  linesWritten: number;
  files: number;
  views: number;
};

const ThreadPageSidebar = ({
  visibility,
  createdAt,
  project,
  prompts,
  linesWritten,
  files,
  views,
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

        <div className="flex flex-col gap-1">
          <ListItem icon={<SvgIconLine size="sm" color="neutral" />}>
            {t("thread.linesWritten", { count: linesWritten })}
          </ListItem>
          <div className="flex items-center gap-2 pl-5">
            <Typography variant="caption" className="text-green-50">
              +32
            </Typography>
            <Typography variant="caption" className="text-red-50">
              -26
            </Typography>
            <Typography variant="caption" className="text-orange-250">
              ~11
            </Typography>
          </div>
        </div>

        <ListItem icon={<SvgIconFile size="sm" color="neutral" />}>
          {t("common.files", { count: files })}
        </ListItem>
        <ListItem icon={<SvgIconEye size="sm" color="neutral" />}>
          {t("common.views", { count: views })}
        </ListItem>
      </List>

      <div className="flex w-full flex-col gap-8">
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
