import type { ComponentProps } from "react";
import truncate from "lodash.truncate";
import { useTranslations } from "next-intl";
import { formatDistanceToNow } from "date-fns";

import type { ThreadWithAuthor } from "@/supabase/repos/sessions";

import { THREAD_TITLE_TRUNCATE_LENGTH } from "@/utils/constants";

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardDescription,
  CardActions,
} from "@/components/ui/card";
import { List, ListItem } from "@/components/ui/list";

import { SvgIconChat, SvgIconClock, SvgIconFile, SvgIconHeart } from "@/components/icon";

type HomePageRecentThreadsListItemProps = {
  thread: ThreadWithAuthor;
} & ComponentProps<typeof Card>;

const HomePageRecentThreadsListItem = ({
  thread,
  ...props
}: HomePageRecentThreadsListItemProps) => {
  const t = useTranslations();

  return (
    <Card variant="card" href={`/threads/${thread.id}`} {...props}>
      <CardBody className="self-end">
        <List direction="row">
          <ListItem icon={<SvgIconClock size="sm" color="neutral" />}>
            {t("common.ago", { date: formatDistanceToNow(new Date(thread.createdAt)) })}
          </ListItem>
          <CardActions />
        </List>
      </CardBody>
      <CardBody>
        <CardHeader>
          <CardTitle>
            {truncate(thread.title ?? t("common.untitled"), {
              length: THREAD_TITLE_TRUNCATE_LENGTH,
            })}
          </CardTitle>
          <CardDescription>{thread.profiles?.username ?? "Anonymous"}</CardDescription>
        </CardHeader>
        <List direction="column">
          <ListItem icon={<SvgIconChat size="sm" color="neutral" />}>
            {t("common.prompts", { count: thread.messageCount ?? 0 })}
          </ListItem>
          <ListItem icon={<SvgIconFile size="sm" color="neutral" />}>
            {t("common.files", { count: thread.fileCount })}
          </ListItem>
          <ListItem icon={<SvgIconHeart size="sm" color="neutral" />}>
            {t("common.likes", { count: thread.likeCount })}
          </ListItem>
        </List>
      </CardBody>
    </Card>
  );
};

export { HomePageRecentThreadsListItem };
