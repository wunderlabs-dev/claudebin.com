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
  CardActions,
} from "@/components/ui/card";

import { SvgIconChat, SvgIconClock, SvgIconFile } from "@/components/icon";

type HomeRecentThreadsCardProps = {
  title: string;
  author: string;
  time: string;
  prompts: number;
  files: number;
} & ComponentProps<typeof Card>;

const HomeRecentThreadsCard = ({
  title,
  author,
  time,
  prompts,
  files,
  ...props
}: HomeRecentThreadsCardProps) => {
  const t = useTranslations();

  return (
    <Card variant="card" {...props}>
      <CardBody className="self-end">
        <CardMetaGroup direction="row">
          <CardMeta icon={<SvgIconClock size="sm" color="neutral" />}>{time}</CardMeta>
          <CardActions />
        </CardMetaGroup>
      </CardBody>
      <CardBody>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{author}</CardDescription>
        </CardHeader>
        <CardMetaGroup direction="column">
          <CardMeta icon={<SvgIconChat size="sm" color="neutral" />}>
            {t("common.prompts", { count: prompts })}
          </CardMeta>
          <CardMeta icon={<SvgIconFile size="sm" color="neutral" />}>
            {t("common.files", { count: files })}
          </CardMeta>
        </CardMetaGroup>
      </CardBody>
    </Card>
  );
};

export { HomeRecentThreadsCard };
