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
  CardMetaGroup,
  CardMeta,
  CardSection,
  CardDivider,
  CardActions,
} from "@/components/ui/card";

import {
  SvgIconChat,
  SvgIconClock,
  SvgIconFile,
  SvgIconJauge,
  SvgIconUser,
  SvgIconFork,
  SvgIconFolder,
} from "@/components/icon";

type ThreadsCardProps = {
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

const ThreadsCard = ({
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
}: ThreadsCardProps) => {
  const t = useTranslations();
  const hash = hashString(id)
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
        <CardMetaGroup direction="column">
          <CardMeta icon={<SvgIconChat size="sm" color="neutral" />}>
            {t("common.prompts", { count: prompts })}
          </CardMeta>
          <CardMeta icon={<SvgIconFile size="sm" color="neutral" />}>
            {t("common.files", { count: files })}
          </CardMeta>
          <CardMetaGroup direction="row" align="between">
            <CardMeta icon={<SvgIconJauge size="sm" color="neutral" />}>{progress}%</CardMeta>
            <CardMeta icon={<SvgIconClock size="sm" color="neutral" />}>{time}</CardMeta>
          </CardMetaGroup>
        </CardMetaGroup>
      </CardSection>
      <CardDivider />
      <CardSection>
        <CardMetaGroup direction="column">
          <CardMeta icon={<SvgIconUser size="sm" color="neutral" />}>
            {t("common.views", { count: views })}
          </CardMeta>
          <CardMeta icon={<SvgIconFork size="sm" color="neutral" />}>
            {t("common.forks", { count: forks })}
          </CardMeta>
          <CardMeta icon={<SvgIconFolder size="sm" color="neutral" />}>{project}</CardMeta>
        </CardMetaGroup>
      </CardSection>
    </CardBody>,
    <CardBody key="dot" className="bg-dot text-gray-500/40 group-hover:text-orange-50" />,
  ];

  return (
    <Card variant="grid" {...props}>
      {positions.map((position) => columns[position])}
    </Card>
  );
};

export { ThreadsCard };
