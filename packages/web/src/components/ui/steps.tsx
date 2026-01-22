import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/helpers";

import { Typography } from "@/components/ui/typography";

type StepsProps = HTMLAttributes<HTMLOListElement>;

type StepsItemProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLLIElement>;

const Steps = ({ className, children, ...props }: StepsProps) => {
  return (
    <ol
      className={cn("flex flex-col items-start gap-4 w-full [counter-reset:step]", className)}
      {...props}
    >
      {children}
    </ol>
  );
};

const StepsItem = ({ children, className, ...props }: StepsItemProps) => {
  return (
    <li className={cn("flex items-center gap-3 [counter-increment:step]", className)} {...props}>
      <span className="flex shrink-0 items-center justify-center size-8 rounded-full bg-orange-50/10 border border-orange-50 text-base text-orange-50 before:content-[counter(step)]" />
      <Typography variant="small">{children}</Typography>
    </li>
  );
};

export { Steps, StepsItem, type StepsProps, type StepsItemProps };
