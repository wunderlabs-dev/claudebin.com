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
import { SessionLikeButton } from "@/components/session-like-button";

type ThreadPageSidebarProps = {
  sessionId: string;
  visibility: "public" | "private";
  createdAt: string;
  project: string;
  prompts: number;
  files: number;
  views: number;
  likes: number;
  hasLiked: boolean;
  isAuthenticated: boolean;
};

const ThreadPageSidebar = ({
  sessionId,
  visibility,
  createdAt,
  project,
  prompts,
  files,
  views,
  likes,
  hasLiked,
  isAuthenticated,
}: ThreadPageSidebarProps): ReactNode => {
  const t = useTranslations();

  const threadUrl = `https://claudebin.com/threads/${sessionId}`;

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
        <ListItem icon={<SvgIconFile size="sm" color="neutral" />}>
          {t("common.files", { count: files })}
        </ListItem>
        <ListItem icon={<SvgIconEye size="sm" color="neutral" />}>
          {t("common.views", { count: views })}
        </ListItem>
        <SessionLikeButton
          sessionId={sessionId}
          initialLiked={hasLiked}
          likeCount={likes}
          isAuthenticated={isAuthenticated}
        />
      </List>

      <div className="flex w-full flex-col gap-8">
        <CopyInput variant="link" value={threadUrl} />
        <CopyInput variant="snippet" value={threadUrl} />
        <Button variant="secondary">
          <SvgIconChat />
          {t("thread.continueConversation")}
        </Button>
      </div>
    </div>
  );
};

export { ThreadPageSidebar };
