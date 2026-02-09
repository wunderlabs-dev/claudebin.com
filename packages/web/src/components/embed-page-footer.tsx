"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { SvgIconClaudebinXs } from "@/components/icon/svg-icon-claudebin-xs";
import { SvgIconBrain } from "@/components/icon/svg-icon-brain";
import { SvgIconChat } from "@/components/icon/svg-icon-chat";
import { SvgIconFolder } from "@/components/icon/svg-icon-folder";
import { SvgIconFile } from "@/components/icon/svg-icon-file";
import { SvgIconEye } from "@/components/icon/svg-icon-eye";
import { SvgIconHeart } from "@/components/icon/svg-icon-heart";
import { List, ListItem } from "@/components/ui/list";

type EmbedPageFooterProps = {
  id: string;
  workingDir?: string | null;
  modelName?: string | null;
  fileCount: number;
  viewCount: number;
  likeCount: number;
  messageCount?: number | null;
};

export const EmbedPageFooter = ({
  id,
  workingDir,
  modelName,
  fileCount,
  viewCount,
  likeCount,
  messageCount,
}: EmbedPageFooterProps) => {
  const t = useTranslations();

  return (
    <div className="sticky bottom-0 flex items-center justify-between p-3 bg-gray-100 border-t border-gray-200">
      <Link href={`/threads/${id}`} target="_blank">
        <SvgIconClaudebinXs
          size="auto"
          className="w-14 transition-colors duration-150 ease-in-out hover:text-orange-50"
        />
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
