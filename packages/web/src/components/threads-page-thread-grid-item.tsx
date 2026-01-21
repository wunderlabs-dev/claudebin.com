import type { ComponentProps, ReactNode } from "react";
import { useTranslations } from "next-intl";

import { hashString } from "@/utils/helpers";
import { THREAD_CARD_LAYOUTS } from "@/utils/constants";

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
  SvgIconFile,
  SvgIconJauge,
  SvgIconUser,
  SvgIconFork,
  SvgIconFolder,
} from "@/components/icon";

type ThreadsPageThreadGridItemProps = {
  id: string;
  title: string;
  author: string;
  time: string;
  prompts: number;
  files: number;
  views: number;
  forks: number;
  project: string;
  progress: number;
} & Omit<ComponentProps<typeof Card>, "id">;

const ThreadsPageThreadGridItem = ({
  id,
  title,
  author,
  time,
  prompts,
  files,
  views,
  forks,
  project,
  progress,
  ...props
}: ThreadsPageThreadGridItemProps) => {
  const t = useTranslations();
  const hash = hashString(id);
  const positions = THREAD_CARD_LAYOUTS[hash % THREAD_CARD_LAYOUTS.length];

  const columns: ReactNode[] = [
    <CardBody key="header">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{author}</CardDescription>
      </CardHeader>
    </CardBody>,
    <CardBody key="meta">
      <CardSection>
        <CardActions />
        <List direction="column">
          <ListItem icon={<SvgIconChat size="sm" color="neutral" />}>
            {t("common.prompts", { count: prompts })}
          </ListItem>
          <ListItem icon={<SvgIconFile size="sm" color="neutral" />}>
            {t("common.files", { count: files })}
          </ListItem>
          <List direction="row" align="between">
            <ListItem icon={<SvgIconJauge size="sm" color="neutral" />}>{progress}%</ListItem>
            <ListItem icon={<SvgIconClock size="sm" color="neutral" />}>{time}</ListItem>
          </List>
        </List>
      </CardSection>
      <CardDivider />
      <CardSection>
        <List direction="column">
          <ListItem icon={<SvgIconUser size="sm" color="neutral" />}>
            {t("common.views", { count: views })}
          </ListItem>
          <ListItem icon={<SvgIconFork size="sm" color="neutral" />}>
            {t("common.forks", { count: forks })}
          </ListItem>
          <ListItem icon={<SvgIconFolder size="sm" color="neutral" />}>{project}</ListItem>
        </List>
      </CardSection>
    </CardBody>,
    <CardBody key="dot" className="bg-dot text-gray-500/40 group-hover:text-orange-50" />,
  ] as const;

  return (
    <Card variant="grid" {...props}>
      {positions.map((position) => columns[position])}
    </Card>
  );
};

export { ThreadsPageThreadGridItem };
