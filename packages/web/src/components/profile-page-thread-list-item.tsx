import type { ComponentProps } from "react";
import truncate from "lodash.truncate";
import { useTranslations } from "next-intl";
import { formatDistanceToNow } from "date-fns";

import type { Session } from "@/supabase/repos/sessions";

import { THREAD_TITLE_TRUNCATE_LENGTH } from "@/utils/constants";

import { Card, CardBody, CardHeader, CardTitle, CardSection } from "@/components/ui/card";
import { List, ListItem } from "@/components/ui/list";

import { SvgIconChat, SvgIconClock, SvgIconHeart } from "@/components/icon";

type ProfilePageThreadListItemProps = {
  thread: Session;
} & ComponentProps<typeof Card>;

const ProfilePageThreadListItem = ({ thread, ...props }: ProfilePageThreadListItemProps) => {
  const t = useTranslations();

  return (
    <Card variant="list" href={`/threads/${thread.id}`} {...props}>
      <CardBody>
        <CardSection>
          <CardHeader>
            <CardTitle>
              {truncate(thread.title ?? t("common.untitled"), {
                length: THREAD_TITLE_TRUNCATE_LENGTH,
              })}
            </CardTitle>
          </CardHeader>
          <List direction="row" className="flex-col items-start gap-1 lg:flex-row lg:items-center lg:gap-3">
            {thread.messageCount ? (
              <ListItem icon={<SvgIconChat size="sm" color="neutral" />}>
                {t("common.prompts", { count: thread.messageCount })}
              </ListItem>
            ) : null}
            <ListItem icon={<SvgIconHeart size="sm" color="neutral" />}>
              {t("common.likes", { count: thread.likeCount })}
            </ListItem>
            <ListItem icon={<SvgIconClock size="sm" color="neutral" />}>
              {t("common.ago", { date: formatDistanceToNow(new Date(thread.createdAt)) })}
            </ListItem>
          </List>
        </CardSection>
      </CardBody>

      <CardBody className="col-span-12 min-h-12 bg-dot text-gray-500/40 transition-colors lg:col-span-1 lg:min-h-auto group-hover:text-orange-50" />
    </Card>
  );
};

export { ProfilePageThreadListItem };
