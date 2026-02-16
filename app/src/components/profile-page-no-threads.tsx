import type { ComponentProps } from "react";

import { useTranslations } from "next-intl";

import { cn } from "@/utils/helpers";

import { SvgIconChat } from "@/components/icon/svg-icon-chat";
import { Typography } from "@/components/ui/typography";

type ProfilePageNoThreadsProps = ComponentProps<"div">;

const ProfilePageNoThreads = ({ className, ...props }: ProfilePageNoThreadsProps) => {
  const t = useTranslations();

  return (
    <div
      className={cn("flex items-center gap-3 border-gray-250 border-x border-b p-8", className)}
      {...props}
    >
      <SvgIconChat size="md" color="neutral" />
      <Typography variant="small" color="neutral">
        {t("user.noThreads")}
      </Typography>
    </div>
  );
};

export { ProfilePageNoThreads };
