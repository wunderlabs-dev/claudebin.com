"use client";

import { useTranslations } from "next-intl";
import { isNil, isNotNil } from "ramda";

import { APP_URL } from "@/utils/constants";

import { SvgIconArrowLeft } from "@/components/icon/svg-icon-arrow-left";

import { CopyInput } from "@/components/ui/copy-input";
import { Typography } from "@/components/ui/typography";
import { NavButton, NavLabel } from "@/components/ui/nav";

import type { ThreadEmbedSelection } from "@/context/thread-embed";

type ThreadPageThreadEmbedProps = {
  id: string;
  selection: ThreadEmbedSelection;
  onClose: () => void;
};

const ThreadPageThreadEmbed = ({ id, selection, onClose }: ThreadPageThreadEmbedProps) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col min-w-full gap-8">
      <NavButton onClick={onClose}>
        <SvgIconArrowLeft size="sm" />
        <NavLabel>{t("thread.hideEmbedPanel")}</NavLabel>
      </NavButton>

      {isNotNil(selection.from) && isNotNil(selection.to) ? (
        <CopyInput
          variant="snippet"
          value={`<iframe style="width:100%;height:500px;border:none;" src="${APP_URL}/thread/${id}/embed?from=${Math.min(selection.from, selection.to)}&to=${Math.max(selection.from, selection.to)}"></iframe>`}
        />
      ) : null}

      {isNil(selection.from) && isNil(selection.to) ? (
        <Typography variant="small" color="muted">
          {t("thread.embedHint")}
        </Typography>
      ) : null}
      {isNotNil(selection.from) && isNil(selection.to) ? (
        <Typography variant="small" color="muted">
          {t("thread.selectEndMessage")}
        </Typography>
      ) : null}
    </div>
  );
};

export { ThreadPageThreadEmbed };
