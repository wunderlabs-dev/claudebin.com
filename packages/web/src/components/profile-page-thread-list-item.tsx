import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardSection,
  CardDivider,
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
          <List direction="row">
            <ListItem icon={<SvgIconChat size="sm" color="neutral" />}>
              {t("common.prompts", { count: prompts })}
            </ListItem>
            <ListItem icon={<SvgIconFile size="sm" color="neutral" />}>
              {t("common.files", { count: files })}
            </ListItem>
            <ListItem icon={<SvgIconJauge size="sm" color="neutral" />}>{progress}%</ListItem>
          </List>
        </CardSection>

        <CardDivider />

        <CardSection>
          <List direction="row">
            <ListItem icon={<SvgIconUser size="sm" color="neutral" />}>
              {t("common.views", { count: views })}
            </ListItem>
            <ListItem icon={<SvgIconFork size="sm" color="neutral" />}>
              {t("common.forks", { count: forks })}
            </ListItem>
            <ListItem icon={<SvgIconFolder size="sm" color="neutral" />}>{project}</ListItem>
            <ListItem icon={<SvgIconClock size="sm" color="neutral" />} align="end">
              {time}
            </ListItem>
          </List>
        </CardSection>
      </CardBody>

      <CardBody className="col-span-1 bg-dot text-gray-500/40 transition-colors group-hover:text-orange-50" />
    </Card>
  );
};

export { ProfilePageThreadListItem };
