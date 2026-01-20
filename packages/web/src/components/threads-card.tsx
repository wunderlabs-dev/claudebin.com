import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";

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
  title: string;
  author: string;
  time: string;
  prompts: number;
  files: number;
  views: number;
  forks: number;
  project: string;
  progress: number;
} & ComponentProps<typeof Card>;

const ThreadsCard = ({
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

  return (
    <Card variant="grid" {...props}>
      <CardBody>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{author}</CardDescription>
        </CardHeader>
      </CardBody>

      <CardBody>
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
      </CardBody>

      <CardBody className="bg-dot transition-colors text-gray-500/40 group-hover:text-orange-50" />
    </Card>
  );
};

export { ThreadsCard };
