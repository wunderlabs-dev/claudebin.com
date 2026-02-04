import { useTranslations } from "next-intl";

import {
  SvgIconChat,
  SvgIconEye,
  SvgIconFile,
  SvgIconFolder,
  SvgIconGlobe,
  SvgIconCalendar,
} from "@/components/icon";

import { APP_THREADS_URL } from "@/utils/constants";

import { Badge } from "@/components/ui/badge";
import { CopyInput } from "@/components/ui/copy-input";
import { List, ListItem } from "@/components/ui/list";

import { ThreadPageSidebarLikeContainer } from "@/containers/thread-page-sidebar-like-container";
import { ThreadPageSidebarContinueConversation } from "@/components/thread-page-sidebar-continue-conversation";

type ThreadPageSidebarContainerProps = {
  id: string;
  createdAt: string;
  fileCount: number;
  viewCount: number;
  likeCount: number;
  workingDir?: string | null;
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
  viewCount,
  fileCount,
  likeCount,
  messageCount,
}: ThreadPageSidebarContainerProps) => {
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
        {messageCount ? (
          <ListItem icon={<SvgIconChat size="sm" color="neutral" />}>
            {t("common.prompts", { count: messageCount })}
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

      <div className="flex w-full flex-col gap-8">
        <CopyInput variant="link" value={`${APP_THREADS_URL}/${id}`} />
        <CopyInput variant="snippet" value="npx claudebin publish" />
        <ThreadPageSidebarContinueConversation />
      </div>
    </div>
  );
};

export { ThreadPageSidebarContainer };
