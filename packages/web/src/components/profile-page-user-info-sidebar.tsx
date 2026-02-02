import type { ComponentProps } from "react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

import { cn } from "@/utils/helpers";

import { SvgIconCalendar, SvgIconChat, SvgIconEye } from "@/components/icon";

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
        <DividerGridCell className="col-span-5 flex justify-between border-b">
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
        <DividerGridCell className="col-span-5 border-r border-l" />
        <DividerGridCell className="col-span-2" />
      </DividerGridRow>

      <DividerGridRow>
        <DividerGridCell className="col-span-12 flex flex-col gap-1 border px-6 py-6">
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
          <DividerGridCell className="col-span-8 flex items-center justify-center gap-2 border-x border-b px-3 py-3">
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
        <DividerGridCell className="col-span-5 flex justify-between">
          <DividerGridDivider variant="bottom" />
          <DividerGridDivider variant="bottom" />
        </DividerGridCell>
        <DividerGridCell className="col-span-2" />
      </DividerGridRow>
    </DividerGrid>
  );
};

export { ProfilePageUserInfoSidebar };
