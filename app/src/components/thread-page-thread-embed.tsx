"use client";

import { useTranslations } from "next-intl";
import { not, isEmpty } from "ramda";

import { useEmbedMode } from "@/context/embed";

import { APP_THREADS_URL } from "@/utils/constants";

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

const ThreadPageThreadEmbed = ({ id, onClose }: ThreadPageThreadEmbedProps) => {
  const t = useTranslations();

  const { from, to, onFromChange, onToChange } = useEmbedMode();

  const handleFromInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (not(isEmpty(value))) {
      onFromChange(Number.parseInt(value));
    } else {
      onFromChange(null);
    }
  };

  const handleToInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (not(isEmpty(value))) {
      onToChange(Number.parseInt(value));
    } else {
      onToChange(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 min-w-full">
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
          <Input
            type="number"
            placeholder={t("thread.embedPlaceholder")}
            value={from}
            onChange={handleFromInput}
          />
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <Typography variant="small" fontWeight="semibold">
            {t("thread.embedFinish")}
          </Typography>
          <Input
            type="number"
            placeholder={t("thread.embedPlaceholder")}
            value={to}
            onChange={handleToInput}
          />
        </div>
      </div>

      <Typography variant="small" color="muted">
        {t("thread.embedHint")}
      </Typography>
    </div>
  );
};

export { ThreadPageThreadEmbed };
