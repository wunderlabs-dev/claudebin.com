import type { ReactNode } from "react";

import Link from "next/link";

import { SvgIconClock } from "@/components/icon";

import { Avatar } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";
import { List, ListItem } from "@/components/ui/list";

type ThreadPageMetaProps = {
  title: string;
  author: string;
  time: string;
};

const ThreadPageMeta = ({ title, author, time }: ThreadPageMetaProps): ReactNode => {
  return (
    <div className="flex flex-col gap-1 pb-4 pl-12 border-b border-gray-250">
      <Typography variant="h3">{title}</Typography>

      <div className="flex items-center gap-3">
        <Link href={`/profile/${author}`} className="flex items-center gap-3">
          <Avatar size="sm" />
          <Typography variant="small" color="accent" className="underline">
            @{author}
          </Typography>
        </Link>

        <List>
          <ListItem icon={<SvgIconClock size="sm" color="neutral" />}>{time}</ListItem>
        </List>
      </div>
    </div>
  );
};

export { ThreadPageMeta };
