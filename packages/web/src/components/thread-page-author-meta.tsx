import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { formatDistanceToNow } from "date-fns";

import { SvgIconClock } from "@/components/icon/svg-icon-clock";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { List, ListItem } from "@/components/ui/list";
import { NavLink } from "@/components/ui/nav";
import { Typography } from "@/components/ui/typography";

type ThreadPageAuthorMetaProps = {
  title: string;
  author: string;
  username?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
};

const ThreadPageAuthorMeta = ({
  title,
  author,
  avatarUrl,
  username,
  createdAt,
}: ThreadPageAuthorMetaProps) => {
  const t = useTranslations();
  const [fallback] = [...author];

  return (
    <div className="flex flex-col min-w-full gap-1 pb-4 border-b border-gray-250 lg:pl-12">
      <Typography variant="h3">{title}</Typography>

      <div className="flex items-center gap-3">
        {username ? (
          <NavLink href={`/profile/${username}`}>
            <Avatar size="sm">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt={author} /> : null}
              <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
            <Typography
              variant="small"
              color="accent"
              className="underline decoration-orange-50/0 underline-offset-2 transition-colors duration-150 ease-in-out group-hover:decoration-orange-50"
            >
              {username}
            </Typography>
          </NavLink>
        ) : (
          <Fragment>
            <Avatar size="sm">
              <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
            <Typography variant="small" color="accent">
              {author}
            </Typography>
          </Fragment>
        )}

        <List>
          <ListItem icon={<SvgIconClock size="sm" color="neutral" />}>
            {t("common.ago", { date: formatDistanceToNow(createdAt) })}
          </ListItem>
        </List>
      </div>
    </div>
  );
};

export { ThreadPageAuthorMeta };
