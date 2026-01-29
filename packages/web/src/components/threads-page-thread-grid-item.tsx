import type { ComponentProps, ReactNode } from "react";
import truncate from "lodash.truncate";
import { useTranslations } from "next-intl";
import { formatDistanceToNow } from "date-fns";

import type { ThreadWithAuthor } from "@/supabase/repos/sessions";

import { getProjectName, hashString } from "@/utils/helpers";
import { THREAD_CARD_LAYOUTS, THREAD_GRID_TITLE_TRUNCATE_LENGTH } from "@/utils/constants";

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

import {
  SvgIconChat,
  SvgIconClock,
  SvgIconEye,
  SvgIconFile,
  SvgIconFolder,
  SvgIconHeart,
} from "@/components/icon";

type ThreadsPageThreadGridItemProps = {
  thread: ThreadWithAuthor;
} & ComponentProps<typeof Card>;

const ThreadsPageThreadGridItem = ({ thread, ...props }: ThreadsPageThreadGridItemProps) => {
  const t = useTranslations();
  const hash = hashString(thread.id);
  const positions = THREAD_CARD_LAYOUTS[hash % THREAD_CARD_LAYOUTS.length];

  const columns: ReactNode[] = [
    <CardBody key="header">
      <CardHeader>
        <CardTitle>
          {truncate(thread.title ?? t("common.untitled"), {
            length: THREAD_GRID_TITLE_TRUNCATE_LENGTH,
          })}
        </CardTitle>
        <CardDescription>{thread.profiles?.username ?? "Anonymous"}</CardDescription>
      </CardHeader>
    </CardBody>,
    <CardBody key="meta">
      <CardSection>
        <CardActions />
        <List direction="column">
          {thread.messageCount ? (
            <ListItem icon={<SvgIconChat size="sm" color="neutral" />}>
              {t("common.prompts", { count: thread.messageCount })}
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
    </CardBody>,
    <CardBody key="dot" className="bg-dot text-gray-500/40 group-hover:text-orange-50" />,
  ] as const;

  return (
    <Card variant="grid" href={`/threads/${thread.id}`} {...props}>
      {positions.map((position) => columns[position])}
    </Card>
  );
};

export { ThreadsPageThreadGridItem };
