import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/helpers";

import { Typography } from "@/components/ui/typography";

type StepsProps = HTMLAttributes<HTMLOListElement>;

type StepsItemProps = {
  number: number;
  children: ReactNode;
} & HTMLAttributes<HTMLLIElement>;

const Steps = ({ className, children, ...props }: StepsProps) => {
  return (
    <ol className={cn("flex flex-col gap-4", className)} {...props}>
      {children}
    </ol>
  );
};

const StepsItem = ({
  number,
  children,
  className,
  ...props
}: StepsItemProps) => {
  return (
    <li className={cn("flex items-center gap-3", className)} {...props}>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-orange-50 text-orange-50">
        <Typography variant="small">{number}</Typography>
      </span>
      <Typography variant="small">{children}</Typography>
    </li>
  );
};

export { Steps, StepsItem, type StepsProps, type StepsItemProps };
