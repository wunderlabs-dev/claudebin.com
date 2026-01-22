import type { ComponentProps } from "react";

import { useTranslations } from "next-intl";

import { cn } from "@/utils/helpers";

import { SvgIconBash } from "@/components/icon";

import { CopyInput } from "@/components/ui/copy-input";
import { Steps, StepsItem } from "@/components/ui/steps";
import { Typography } from "@/components/ui/typography";

type ProfilePageQuickStartProps = ComponentProps<"div">;

const ProfilePageQuickStart = ({ className, ...props }: ProfilePageQuickStartProps) => {
  const t = useTranslations();

  return (
    <div
      className={cn("flex flex-col items-start gap-6 p-8 border border-gray-250", className)}
      {...props}
    >
      <div className="flex items-center gap-3">
        <SvgIconBash size="md" color="accent" />
        <Typography variant="h4">{t("user.shareGuideTitle")}</Typography>
      </div>

      <Steps>
        <StepsItem number={1}>{t("user.shareGuideStep1")}</StepsItem>

        <div className="pl-11">
          <CopyInput variant="terminal" value="npm i -g claudebin" />
        </div>

        <StepsItem number={2}>{t("user.shareGuideStep2")}</StepsItem>
        <StepsItem number={3}>{t("user.shareGuideStep3")}</StepsItem>

        <div className="pl-11">
          <CopyInput variant="terminal" value="/claudebin:share" />
        </div>

        <StepsItem number={4}>{t("user.shareGuideStep4")}</StepsItem>
      </Steps>
    </div>
  );
};

export { ProfilePageQuickStart };
