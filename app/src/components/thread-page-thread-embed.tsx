"use client";

import { useTranslations } from "next-intl";

import { APP_THREADS_URL } from "@/utils/constants";

import { SvgIconArrowLeft } from "@/components/icon/svg-icon-arrow-left";

import { Divider } from "@/components/ui/divider";
import { Input } from "@/components/ui/form-control";
import { CopyInput } from "@/components/ui/copy-input";
import { Typography } from "@/components/ui/typography";
import { NavButton, NavLabel } from "@/components/ui/nav";

type ThreadPageThreadEmbedProps = {
  id: string;
  onClose: () => void;
};

const ThreadPageThreadEmbed = ({ id, onClose }: ThreadPageThreadEmbedProps) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col min-w-full gap-8">
      <NavButton onClick={onClose}>
        <SvgIconArrowLeft size="sm" />
        <NavLabel>{t("thread.hideEmbedPanel")}</NavLabel>
      </NavButton>

      <CopyInput variant="snippet" value={APP_THREADS_URL} />

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
