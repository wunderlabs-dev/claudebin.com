"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import {
  SvgIconClaudebinXs,
  SvgIconBrain,
  SvgIconChat,
  SvgIconFolder,
  SvgIconFile,
  SvgIconEye,
  SvgIconHeart,
} from "@/components/icon";
import { List, ListItem } from "@/components/ui/list";

type EmbedPageFooterProps = {
  workingDir?: string | null;
  modelName?: string | null;
  fileCount: number;
  viewCount: number;
  likeCount: number;
  messageCount?: number | null;
};

export const EmbedPageFooter = ({
  workingDir,
  modelName,
  fileCount,
  viewCount,
  likeCount,
  messageCount,
}: EmbedPageFooterProps) => {
  const t = useTranslations();

  return (
    <div className="flex items-center justify-between py-3 pl-3 pr-6 bg-gray-100 border-t border-gray-200">
      <Link href="/">
        <SvgIconClaudebinXs size="auto" className="w-14 hover:text-orange-50" />
      </Link>

      <div className="flex flex-col items-end gap-1">
        <List direction="row">
          <ListItem icon={<SvgIconBrain size="sm" color="neutral" />}>{modelName}</ListItem>
          {messageCount ? (
            <ListItem icon={<SvgIconChat size="sm" color="neutral" />}>
              {t("common.messages", { count: messageCount })}
            </ListItem>
          ) : null}
          <ListItem icon={<SvgIconFile size="sm" color="neutral" />}>
            {t("common.files", { count: fileCount })}
          </ListItem>
        </List>
        <List direction="row">
          <ListItem icon={<SvgIconEye size="sm" color="neutral" />}>
            {t("common.views", { count: viewCount })}
          </ListItem>
          <ListItem icon={<SvgIconHeart size="sm" color="neutral" />}>
            {t("common.likes", { count: likeCount })}
          </ListItem>
          <ListItem icon={<SvgIconFolder size="sm" color="neutral" />}>{workingDir}</ListItem>
        </List>
      </div>
    </div>
  );
};
