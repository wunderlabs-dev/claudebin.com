import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardMetaGroup,
  CardMeta,
  CardSection,
  CardDivider,
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

type ProfilePageThreadListItemProps = {
  title: string;
  prompts: number;
  files: number;
  progress: number;
  views: number;
  forks: number;
  project: string;
  time: string;
} & ComponentProps<typeof Card>;

const ProfilePageThreadListItem = ({
  title,
  prompts,
  files,
  progress,
  views,
  forks,
  project,
  time,
  ...props
}: ProfilePageThreadListItemProps) => {
  const t = useTranslations();

  return (
    <Card variant="list" {...props}>
      <CardBody>
        <CardSection>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardMetaGroup direction="row">
            <CardMeta icon={<SvgIconChat size="sm" color="neutral" />}>
              {t("common.prompts", { count: prompts })}
            </CardMeta>
            <CardMeta icon={<SvgIconFile size="sm" color="neutral" />}>
              {t("common.files", { count: files })}
            </CardMeta>
            <CardMeta icon={<SvgIconJauge size="sm" color="neutral" />}>{progress}%</CardMeta>
          </CardMetaGroup>
        </CardSection>

        <CardDivider />

        <CardSection>
          <CardMetaGroup direction="row">
            <CardMeta icon={<SvgIconUser size="sm" color="neutral" />}>
              {t("common.views", { count: views })}
            </CardMeta>
            <CardMeta icon={<SvgIconFork size="sm" color="neutral" />}>
              {t("common.forks", { count: forks })}
            </CardMeta>
            <CardMeta icon={<SvgIconFolder size="sm" color="neutral" />}>{project}</CardMeta>
            <CardMeta icon={<SvgIconClock size="sm" color="neutral" />} align="end">
              {time}
            </CardMeta>
          </CardMetaGroup>
        </CardSection>
      </CardBody>

      <CardBody className="col-span-1 bg-dot text-gray-500/40 transition-colors group-hover:text-orange-50" />
    </Card>
  );
};

export { ProfilePageThreadListItem };
