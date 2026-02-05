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
        default: "bg-orange-50/10 border border-orange-50/50 text-orange-50",
        success: "bg-green-50/10 border border-green-50/50 text-green-50",
        error: "bg-red-50/10 border border-red-50/50 text-red-50",
        neutral: "bg-gray-500/10 border border-gray-500/50 text-gray-500",
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
