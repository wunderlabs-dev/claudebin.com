import type { ComponentProps } from "react";

import { useTranslations } from "next-intl";

import { cn } from "@/utils/helpers";

import { SvgIconBash } from "@/components/icon/svg-icon-bash";
import { CopyInput } from "@/components/ui/copy-input";
import { Typography } from "@/components/ui/typography";
import { Steps, StepsItem } from "@/components/ui/steps";

type ProfilePageQuickStartProps = ComponentProps<"div">;

const ProfilePageQuickStart = ({ className, ...props }: ProfilePageQuickStartProps) => {
  const t = useTranslations();

  return (
    <div
      className={cn("flex flex-col items-start gap-6 border border-gray-250 p-8", className)}
      {...props}
    >
      <div className="flex items-center gap-3">
        <SvgIconBash size="md" color="accent" />
        <Typography variant="h4">{t("user.shareGuideTitle")}</Typography>
      </div>

      <Steps>
        <StepsItem>{t("user.shareGuideStep1")}</StepsItem>

        <div className="min-w-full pl-11">
          <CopyInput variant="command" value={t("commands.share")} />
        </div>

        <StepsItem>{t("user.shareGuideStep2")}</StepsItem>

        <div className="min-w-full pl-11">
          <CopyInput variant="command" value={t("commands.share")} />
        </div>

        <StepsItem>{t("user.shareGuideStep3")}</StepsItem>
      </Steps>
    </div>
  );
};

export { ProfilePageQuickStart };
