import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/helpers";

const badgeVariants = cva(
  [
    "inline-flex items-center justify-center",
    "h-8",
    "gap-2 px-4 py-2",
    "rounded-full",
    "whitespace-nowrap font-mono font-normal text-base uppercase leading-normal",
    "[&>svg]:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        default: "border border-orange-50/50 bg-orange-50/10 text-orange-50",
        success: "border border-green-50/50 bg-green-50/10 text-green-50",
        error: "border border-red-50/50 bg-red-50/10 text-red-50",
        neutral: "border border-gray-500/50 bg-gray-500/10 text-gray-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

const Badge = ({ className, variant = "default", ...props }: BadgeProps) => {
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  );
};

export { Badge, badgeVariants };
