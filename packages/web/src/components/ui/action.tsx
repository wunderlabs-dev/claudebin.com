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
        "flex items-center gap-4 px-4 py-3 border border-gray-200 rounded-xl font-mono text-base",
        className,
      )}
      {...props}
    >
      {icon}
      <Typography variant="small" className="font-mono">
        {title}
      </Typography>
      <code className="overflow-x-scroll max-w-full px-2 py-0.5 bg-gray-200 rounded-sm text-gray-600 whitespace-nowrap">{children}</code>
    </div>
  );
};

export { Action, type ActionProps };
