"use client";

import { createContext, useContext, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/utils/helpers";

import { SvgIconDot } from "@/components/icon";
import { Typography } from "@/components/ui/typography";

const StepsVariants = ["ordered", "outlined", "unordered"] as const;
type StepsVariant = (typeof StepsVariants)[number];

type StepsProps = {
  variant?: StepsVariant;
} & HTMLAttributes<HTMLOListElement>;

type StepsItemProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLLIElement>;

const StepsContext = createContext<StepsVariant>("outlined");

const Steps = ({ variant = "outlined", className, children, ...props }: StepsProps) => {
  return (
    <StepsContext.Provider value={variant}>
      <ol
        className={cn(
          "flex w-full flex-col items-start gap-4 [counter-reset:step]",
          variant === "outlined" ? "gap-4" : "gap-2",
          className,
        )}
        {...props}
      >
        {children}
      </ol>
    </StepsContext.Provider>
  );
};

type StepsItemIconVariantMapping = Record<StepsVariant, string>;

const stepsItemIconClassNames: StepsItemIconVariantMapping = {
  ordered: "w-8 text-base text-orange-50 text-left leading-6 before:content-[counter(step)]",
  outlined:
    "w-8 h-8 bg-orange-50/10 border border-orange-50 rounded-full text-base text-orange-50 before:content-[counter(step)]",
  unordered: "w-8 leading-6",
};

const StepsItem = ({ children, className, ...props }: StepsItemProps) => {
  const variant = useContext(StepsContext);

  return (
    <li
      className={cn("flex w-full items-start gap-4 [counter-increment:step]", className)}
      {...props}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center",
          stepsItemIconClassNames[variant],
        )}
      >
        {variant === "unordered" ? <SvgIconDot color="accent" /> : null}
      </span>
      <Typography
        variant="small"
        as="div"
        className="min-w-0 space-y-2 *:data-[slot='code']:mt-2 [&>ol]:mt-2 [&>ul]:mt-2"
      >
        {children}
      </Typography>
    </li>
  );
};

export { Steps, StepsItem, StepsVariants, type StepsVariant, type StepsProps, type StepsItemProps };
