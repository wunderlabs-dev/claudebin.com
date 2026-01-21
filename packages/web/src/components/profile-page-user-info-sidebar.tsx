import { useTranslations } from "next-intl";

import { SvgIconCalendar, SvgIconChat, SvgIconCircle, SvgIconFork } from "@/components/icon";

import { Typography } from "@/components/ui/typography";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

type ProfilePageUserInfoSidebarProps = {
  id: string;
  username: string;
  bio: string;
  avatar: string;
  createdAt: string;
  threads: number;
  views: number;
  forks: number;
};

const ProfilePageUserInfoSidebar = ({
  username,
  bio,
  avatar,
  createdAt,
  threads,
  views,
  forks,
}: ProfilePageUserInfoSidebarProps) => {
  const t = useTranslations();

  const stats = [
    {
      key: "threads",
      label: t("user.threads", { count: threads }),
      icon: <SvgIconChat size="sm" color="accent" />,
    },
    {
      key: "views",
      label: t("user.views", { count: views }),
      icon: <SvgIconCircle size="sm" color="accent" />,
    },
    {
      key: "forks",
      label: t("user.forks", { count: forks }),
      icon: <SvgIconFork size="sm" color="accent" />,
    },
  ] as const;

  return (
    <div className="flex flex-col items-center">
      <div className="border border-b-0 border-gray-250">
        <Avatar size="lg">
          <AvatarImage src={avatar} alt={username} />
        </Avatar>
      </div>

      <div className="flex flex-col gap-6 px-6 py-3 border border-gray-250">
        <div className="flex flex-col gap-1">
          <Typography variant="h4">{username}</Typography>
          <Typography variant="small" color="muted">
            {bio}
          </Typography>
        </div>
        <div className="flex items-center gap-1">
          <SvgIconCalendar size="sm" color="neutral" />
          <Typography variant="caption" color="muted">
            {t("user.createdOn", { date: createdAt })}
          </Typography>
        </div>
      </div>

      <div className="flex flex-col justify-center w-2xs">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="flex items-center justify-center gap-2 px-3 py-3 border-x border-b border-gray-250"
          >
            {stat.icon}
            <Typography variant="caption" color="accent" leading="normal">
              {stat.label}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export { ProfilePageUserInfoSidebar };
