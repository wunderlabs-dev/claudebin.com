import type { ComponentProps } from "react";

import { useTranslations } from "next-intl";

import { cn } from "@/utils/helpers";

import { SvgIconLine } from "@/components/icon/svg-icon-line";
import { Typography } from "@/components/ui/typography";

type ProfilePageNoThreadsProps = ComponentProps<"div">;

const ProfilePageNoThreads = ({ className, ...props }: ProfilePageNoThreadsProps) => {
  const t = useTranslations();

  return (
    <div
      className={cn("-mt-px flex items-center gap-3 border border-gray-250 p-8", className)}
      {...props}
    >
      <SvgIconLine size="md" color="neutral" />
      <Typography variant="small" color="neutral">
        {t("user.noThreads")}
      </Typography>
    </div>
  );
};

export { ProfilePageNoThreads };
