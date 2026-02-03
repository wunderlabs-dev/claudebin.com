"use client";

import { createContext, useContext, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/helpers";

import { SvgIconDot } from "@/components/icon";
import { Typography } from "@/components/ui/typography";

const stepsVariants = cva("flex w-full flex-col items-start [counter-reset:step]", {
  variants: {
    variant: {
      ordered: "gap-2",
      outlined: "gap-4",
      unordered: "gap-2",
    },
  },
  defaultVariants: {
    variant: "outlined",
  },
});

const StepsVariants = ["ordered", "outlined", "unordered"] as const;
type StepsVariant = (typeof StepsVariants)[number];

const StepsContext = createContext<StepsVariant | undefined | null>(undefined);

type StepsProps = VariantProps<typeof stepsVariants> & HTMLAttributes<HTMLOListElement>;

type StepsItemProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLLIElement>;

const Steps = ({ variant, className, children, ...props }: StepsProps) => {
  return (
    <StepsContext.Provider value={variant}>
      <ol className={cn(stepsVariants({ variant, className }))} {...props}>
        {children}
      </ol>
    </StepsContext.Provider>
  );
};

type StepsItemIconVariantMapping = Record<StepsVariant, string>;

const stepsItemIconClassNames: StepsItemIconVariantMapping = {
  ordered: "w-4 text-base text-orange-50 leading-6 before:content-[counter(step)]",
  outlined:
    "w-8 h-8 bg-orange-50/10 rounded-full border border-orange-50 text-base text-orange-50 before:content-[counter(step)]",
  unordered: "w-4 leading-6",
};

const StepsItem = ({ children, className, ...props }: StepsItemProps) => {
  const variant = useContext(StepsContext);

  return (
    <li className={cn("flex items-start gap-4 [counter-increment:step]", className)} {...props}>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center",
          stepsItemIconClassNames?.[variant],
        )}
      >
        {variant === "unordered" ? <SvgIconDot color="accent" /> : null}
      </span>
      <Typography variant="small">{children}</Typography>
    </li>
  );
};

export { Steps, StepsItem, StepsVariants, type StepsVariant, type StepsProps, type StepsItemProps };
