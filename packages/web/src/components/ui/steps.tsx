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
      className={cn("flex w-full flex-col items-start gap-4 [counter-reset:step]", className)}
      {...props}
    >
      {children}
    </ol>
  );
};

const StepsItem = ({ children, className, ...props }: StepsItemProps) => {
  return (
    <li className={cn("flex items-center gap-3 [counter-increment:step]", className)} {...props}>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-orange-50 bg-orange-50/10 text-base text-orange-50 before:content-[counter(step)]" />
      <Typography variant="small">{children}</Typography>
    </li>
  );
};

export { Steps, StepsItem, type StepsProps, type StepsItemProps };
