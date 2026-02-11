"use client";

import { useTranslations } from "next-intl";

import { APP_URL } from "@/utils/constants";

import { SvgIconArrowLeft } from "@/components/icon/svg-icon-arrow-left";

import { CopyInput } from "@/components/ui/copy-input";
import { Typography } from "@/components/ui/typography";
import { NavButton, NavLabel } from "@/components/ui/nav";

type ThreadPageThreadEmbedProps = {
  id: string;
  from: number | undefined;
  to: number | undefined;
  start: number | undefined;
  onClose: () => void;
};

const ThreadPageThreadEmbed = ({ id, from, to, start, onClose }: ThreadPageThreadEmbedProps) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col min-w-full gap-8">
      <NavButton onClick={onClose}>
        <SvgIconArrowLeft size="sm" />
        <NavLabel>{t("thread.hideEmbedPanel")}</NavLabel>
      </NavButton>

      {from != null && to != null ? (
        <CopyInput
          variant="snippet"
          value={`<iframe style="width:100%;height:500px;border:none;" src="${APP_URL}/thread/${id}/embed?from=${from}&to=${to}"></iframe>`}
        />
      ) : null}

      {start == null ? (
        <Typography variant="small" color="muted">
          {t("thread.embedHint")}
        </Typography>
      ) : null}

      {start != null && from == null ? (
        <Typography variant="small" color="muted">
          {t("thread.selectEndMessage")}
        </Typography>
      ) : null}
    </div>
  );
};

export { ThreadPageThreadEmbed };
