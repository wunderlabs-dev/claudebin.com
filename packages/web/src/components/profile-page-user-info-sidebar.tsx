import type { ComponentProps } from "react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

import { cn } from "@/utils/helpers";

import { SvgIconCalendar } from "@/components/icon/svg-icon-calendar";
import { SvgIconChat } from "@/components/icon/svg-icon-chat";
import { SvgIconEye } from "@/components/icon/svg-icon-eye";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DividerGrid,
  DividerGridRow,
  DividerGridEdge,
  DividerGridCell,
  DividerGridDivider,
} from "@/components/ui/divider-grid";

import { Typography } from "@/components/ui/typography";

type ProfilePageUserInfoSidebarProps = {
  username: string | null;
  name: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  threads: number;
  views: number;
} & ComponentProps<"div">;

const ProfilePageUserInfoSidebar = ({
  username,
  name,
  avatarUrl,
  createdAt,
  threads,
  views,
  className,
  ...props
}: ProfilePageUserInfoSidebarProps) => {
  const t = useTranslations();
  const [fallback] = username ?? "?";

  const stats = [
    {
      key: "threads",
      label: t("user.threads", { count: threads }),
      icon: <SvgIconChat size="sm" color="accent" />,
    },
    {
      key: "views",
      label: t("user.views", { count: views }),
      icon: <SvgIconEye size="sm" color="accent" />,
    },
  ] as const;

  return (
    <DividerGrid className={cn("flex flex-col", className)} {...props}>
      <DividerGridRow>
        <DividerGridEdge position="left" />
        <DividerGridCell className="col-span-3 border-b">
          <DividerGridDivider variant="top" />
        </DividerGridCell>
        <DividerGridCell className="flex col-span-5 justify-between border-b">
          <DividerGridDivider variant="top" />
          <DividerGridDivider variant="top" />
        </DividerGridCell>
        <DividerGridEdge position="right" />
      </DividerGridRow>

      <DividerGridRow>
        <DividerGridCell className="col-span-2" />
        <DividerGridCell className="col-span-3 border-l">
          <Avatar size="lg">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={name ?? undefined} />
            ) : (
              <AvatarFallback>{fallback}</AvatarFallback>
            )}
          </Avatar>
        </DividerGridCell>
        <DividerGridCell className="col-span-5 border-l border-r" />
        <DividerGridCell className="col-span-2" />
      </DividerGridRow>

      <DividerGridRow>
        <DividerGridCell className="flex flex-col col-span-12 gap-1 px-6 py-6 border">
          <Typography variant="h4">{username}</Typography>
          <div className="flex items-center gap-1">
            <SvgIconCalendar size="sm" color="neutral" />
            <Typography variant="caption" color="muted">
              {t("user.createdOn", { date: format(createdAt, "dd/MM/yyyy") })}
            </Typography>
          </div>
        </DividerGridCell>
      </DividerGridRow>

      {stats.map((stat) => (
        <DividerGridRow key={stat.key}>
          <DividerGridEdge position="left" />
          <DividerGridCell className="flex col-span-8 items-center justify-center gap-2 px-3 py-3 border-x border-b">
            {stat.icon}
            <Typography variant="caption" color="accent" leading="normal">
              {stat.label}
            </Typography>
          </DividerGridCell>
          <DividerGridEdge position="right" />
        </DividerGridRow>
      ))}

      <DividerGridRow>
        <DividerGridCell className="col-span-2" />
        <DividerGridCell className="col-span-3">
          <DividerGridDivider variant="bottom" />
        </DividerGridCell>
        <DividerGridCell className="flex col-span-5 justify-between">
          <DividerGridDivider variant="bottom" />
          <DividerGridDivider variant="bottom" />
        </DividerGridCell>
        <DividerGridCell className="col-span-2" />
      </DividerGridRow>
    </DividerGrid>
  );
};

export { ProfilePageUserInfoSidebar };
