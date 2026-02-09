import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/helpers";

import { Typography } from "@/components/ui/typography";

type ActionProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

const Action = ({ icon, title, children, className, ...props }: ActionProps) => {
  return (
    <div
      data-slot="action"
      className={cn("flex gap-3 items-center", "text-base", className)}
      {...props}
    >
      <div className="shrink-0">{icon}</div>

      <Typography variant="small" color="inherit">
        {title}
      </Typography>

      {children}
    </div>
  );
};

export { Action, type ActionProps };
