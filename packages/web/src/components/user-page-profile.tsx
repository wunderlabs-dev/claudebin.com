import { useTranslations } from "next-intl";

import { SvgIconCalendar, SvgIconChat, SvgIconFork, SvgIconUser } from "@/components/icon";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Typography } from "@/components/ui/typography";

type UserPageProfileProps = {
  id: string;
  username: string;
  bio: string;
  avatar: string;
  createdAt: string;
  threads: number;
  views: number;
  forks: number;
};

const UserPageProfile = ({
  username,
  bio,
  avatar,
  createdAt,
  threads,
  views,
  forks,
}: UserPageProfileProps) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center">
      <Avatar size="lg" className="relative z-10">
        <AvatarImage src={avatar} alt={username} />
        <AvatarFallback>{username.charAt(0)}</AvatarFallback>
      </Avatar>

      <Box className="-mt-12 w-full p-0">
        <div className="flex flex-col gap-6 p-8 pt-16">
          <div className="flex flex-col gap-3">
            <Typography variant="h4">{username}</Typography>
            <Typography variant="body" color="muted">
              {bio}
            </Typography>
          </div>

          <div className="flex items-center gap-1">
            <SvgIconCalendar size="sm" color="neutral" />
            <Typography variant="caption" color="neutral">
              {t("user.createdOn", { date: createdAt })}
            </Typography>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-center gap-1 py-4 border-t border-gray-500/40">
            <SvgIconChat size="sm" color="accent" />
            <Typography variant="small" color="accent">
              {t("user.threads", { count: threads })}
            </Typography>
          </div>
          <div className="flex items-center justify-center gap-1 py-4 border-t border-gray-500/40">
            <SvgIconUser size="sm" color="accent" />
            <Typography variant="small" color="accent">
              {t("user.views", { count: views })}
            </Typography>
          </div>
          <div className="flex items-center justify-center gap-1 py-4 border-t border-gray-500/40">
            <SvgIconFork size="sm" color="accent" />
            <Typography variant="small" color="accent">
              {t("user.forks", { count: forks })}
            </Typography>
          </div>
        </div>
      </Box>
    </div>
  );
};

export { UserPageProfile };
