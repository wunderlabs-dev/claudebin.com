"use client";

import { useTranslations } from "next-intl";

import { SvgIconArrowLeft } from "@/components/icon/svg-icon-arrow-left";

import { CopyInput } from "@/components/ui/copy-input";
import { Divider } from "@/components/ui/divider";
import { Input } from "@/components/ui/form-control";
import { NavButton, NavLabel } from "@/components/ui/nav";
import { Typography } from "@/components/ui/typography";

type ThreadPageThreadEmbedProps = {
  id: string;
  onClose: () => void;
};

const ThreadPageThreadEmbed = ({ id: _id, onClose }: ThreadPageThreadEmbedProps) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-8 min-w-full">
      <NavButton onClick={onClose}>
        <SvgIconArrowLeft size="sm" />
        <NavLabel>{t("thread.hideEmbedPanel")}</NavLabel>
      </NavButton>

      <CopyInput variant="snippet" />

      <Divider />

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-3">
          <Typography variant="small" fontWeight="semibold">
            {t("thread.embedStart")}
          </Typography>
          <Input type="number" placeholder={t("thread.embedPlaceholder")} />
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <Typography variant="small" fontWeight="semibold">
            {t("thread.embedFinish")}
          </Typography>
          <Input type="number" placeholder={t("thread.embedPlaceholder")} />
        </div>
      </div>

      <Typography variant="small" color="muted">
        {t("thread.embedHint")}
      </Typography>
    </div>
  );
};

export { ThreadPageThreadEmbed };
