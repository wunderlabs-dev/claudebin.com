import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardDescription,
  CardActions,
} from "@/components/ui/card";
import { List, ListItem } from "@/components/ui/list";

import { SvgIconChat, SvgIconClock, SvgIconFile } from "@/components/icon";

type HomePageRecentThreadsListItemProps = {
  title: string;
  author: string;
  time: string;
  prompts: number;
  files: number;
} & ComponentProps<typeof Card>;

const HomePageRecentThreadsListItem = ({
  title,
  author,
  time,
  prompts,
  files,
  ...props
}: HomePageRecentThreadsListItemProps) => {
  const t = useTranslations();

  return (
    <Card variant="card" {...props}>
      <CardBody className="self-end">
        <List direction="row">
          <ListItem icon={<SvgIconClock size="sm" color="neutral" />}>{time}</ListItem>
          <CardActions />
        </List>
      </CardBody>
      <CardBody>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{author}</CardDescription>
        </CardHeader>
        <List direction="column">
          <ListItem icon={<SvgIconChat size="sm" color="neutral" />}>
            {t("common.prompts", { count: prompts })}
          </ListItem>
          <ListItem icon={<SvgIconFile size="sm" color="neutral" />}>
            {t("common.files", { count: files })}
          </ListItem>
        </List>
      </CardBody>
    </Card>
  );
};

export { HomePageRecentThreadsListItem };
