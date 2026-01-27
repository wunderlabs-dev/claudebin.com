import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";
import { formatDistanceToNow } from "date-fns";

import { Card, CardBody, CardHeader, CardTitle, CardSection } from "@/components/ui/card";
import { List, ListItem } from "@/components/ui/list";

import { SvgIconChat, SvgIconClock } from "@/components/icon";

type ProfilePageThreadListItemProps = {
  title: string | null;
  messageCount: number | null;
  createdAt: string;
} & Omit<ComponentProps<typeof Card>, "title">;

const ProfilePageThreadListItem = ({
  title,
  messageCount,
  createdAt,
  ...props
}: ProfilePageThreadListItemProps) => {
  const t = useTranslations();

  return (
    <Card variant="list" {...props}>
      <CardBody>
        <CardSection>
          <CardHeader>
            <CardTitle>{title ?? t("common.untitled")}</CardTitle>
          </CardHeader>
          <List direction="row">
            <ListItem icon={<SvgIconChat size="sm" color="neutral" />}>
              {t("common.prompts", { count: messageCount ?? 0 })}
            </ListItem>
            <ListItem icon={<SvgIconClock size="sm" color="neutral" />}>
              {t("common.ago", { date: formatDistanceToNow(new Date(createdAt)) })}
            </ListItem>
          </List>
        </CardSection>
      </CardBody>

      <CardBody className="col-span-1 bg-dot text-gray-500/40 transition-colors group-hover:text-orange-50" />
    </Card>
  );
};

export { ProfilePageThreadListItem };
