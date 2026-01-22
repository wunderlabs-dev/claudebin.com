import type { ReactNode } from "react";

import Link from "next/link";

import { SvgIconClock } from "@/components/icon";

import { Avatar } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";

type ThreadPageMetaProps = {
  title: string;
  author: string;
  time: string;
};

const ThreadPageMeta = ({ title, author, time }: ThreadPageMetaProps): ReactNode => {
  return (
    <div className="flex flex-col gap-1 pl-12 pb-6 border-b border-gray-250">
      <Typography variant="h3">{title}</Typography>
      <div className="flex items-center gap-2">
        <Link href={`/profile/${author}`} className="flex items-center gap-2">
          <Avatar size="xs" />
          <Typography variant="small" color="accent">
            @{author}
          </Typography>
        </Link>
        <Typography variant="small" color="muted">
          /
        </Typography>
        <div className="flex items-center gap-1">
          <SvgIconClock size="sm" color="neutral" />
          <Typography variant="small" color="muted">
            {time}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export { ThreadPageMeta };
