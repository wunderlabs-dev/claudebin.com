import type { ComponentProps } from "react";
import truncate from "lodash.truncate";
import { useTranslations } from "next-intl";
import { formatDistanceToNow } from "date-fns";

import type { ThreadWithAuthor } from "@/server/repos/sessions";

import { getProjectName } from "@/utils/helpers";

import { THREAD_GRID_TITLE_TRUNCATE_LENGTH } from "@/utils/constants";

import { SvgIconChat } from "@/components/icon/svg-icon-chat";
import { SvgIconClock } from "@/components/icon/svg-icon-clock";
import { SvgIconEye } from "@/components/icon/svg-icon-eye";
import { SvgIconFile } from "@/components/icon/svg-icon-file";
import { SvgIconFolder } from "@/components/icon/svg-icon-folder";
import { SvgIconHeart } from "@/components/icon/svg-icon-heart";

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardDescription,
  CardSection,
  CardDivider,
  CardActions,
} from "@/components/ui/card";
import { List, ListItem } from "@/components/ui/list";

type ThreadsPageThreadGridItemProps = {
  thread: ThreadWithAuthor;
} & ComponentProps<typeof Card>;

const ThreadsPageThreadGridItem = ({ thread, ...props }: ThreadsPageThreadGridItemProps) => {
  const t = useTranslations();

  return (
    <Card variant="grid" href={`/threads/${thread.id}`} {...props}>
      <CardBody>
        <CardHeader>
          <CardTitle>
            {truncate(thread.title ?? t("common.untitled"), {
              length: THREAD_GRID_TITLE_TRUNCATE_LENGTH,
            })}
          </CardTitle>
          <CardDescription>{thread.profiles?.username ?? t("common.deactivated")}</CardDescription>
        </CardHeader>
      </CardBody>
      <CardBody>
        <CardSection>
          <CardActions />
          <List direction="column">
            {thread.messageCount ? (
              <ListItem icon={<SvgIconChat size="sm" color="neutral" />}>
                {t("common.messages", { count: thread.messageCount })}
              </ListItem>
            ) : null}
            <ListItem icon={<SvgIconFile size="sm" color="neutral" />}>
              {t("common.files", { count: thread.fileCount })}
            </ListItem>
            <ListItem icon={<SvgIconClock size="sm" color="neutral" />}>
              {t("common.ago", { date: formatDistanceToNow(new Date(thread.createdAt)) })}
            </ListItem>
          </List>
        </CardSection>
        <CardDivider />
        <CardSection>
          <List direction="column">
            <ListItem icon={<SvgIconEye size="sm" color="neutral" />}>
              {t("common.views", { count: thread.viewCount })}
            </ListItem>
            <ListItem icon={<SvgIconHeart size="sm" color="neutral" />}>
              {t("common.likes", { count: thread.likeCount })}
            </ListItem>
            <ListItem icon={<SvgIconFolder size="sm" color="neutral" />}>
              {getProjectName(thread.workingDir)}
            </ListItem>
          </List>
        </CardSection>
      </CardBody>
      <CardBody className="min-h-12 bg-dot text-gray-500/40 transition-colors duration-150 ease-out group-hover:text-orange-50 lg:min-h-auto" />
    </Card>
  );
};

export { ThreadsPageThreadGridItem };
