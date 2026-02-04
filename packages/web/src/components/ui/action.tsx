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
      className={cn(
        "flex items-center gap-4 rounded-xl border border-gray-200 px-4 py-3 font-mono text-base",
        className,
      )}
      {...props}
    >
      {icon}
      <Typography variant="small" className="font-mono">
        {title}
      </Typography>
      <code className="max-w-full overflow-x-scroll whitespace-nowrap rounded-sm bg-gray-200 px-2 py-0.5 text-gray-600">
        {children}
      </code>
    </div>
  );
};

export { Action, type ActionProps };
