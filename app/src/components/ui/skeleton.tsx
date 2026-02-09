import type { HTMLAttributes } from "react";

import { cn } from "@/utils/helpers";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-gray-300 rounded animate-pulse", className)}
      {...props}
    />
  );
};

const SkeletonAvatar = ({ className, ...props }: SkeletonProps) => {
  return (
    <Skeleton
      data-slot="skeleton-avatar"
      className={cn("shrink-0 size-8 rounded-full", className)}
      {...props}
    />
  );
};

const SkeletonBar = ({ className, ...props }: SkeletonProps) => {
  return <Skeleton data-slot="skeleton-bar" className={cn("h-4", className)} {...props} />;
};

export { Skeleton, SkeletonAvatar, SkeletonBar };
