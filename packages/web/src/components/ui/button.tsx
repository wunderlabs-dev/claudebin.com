import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/helpers";

const buttonVariants = cva(
  [
    // Layout
    "inline-flex items-center justify-center",
    // Sizing
    "h-12 px-5 py-3",
    // Shape
    "rounded-full",
    // Text
    "whitespace-nowrap",
    // Interaction
    "select-none cursor-pointer",
    // Transition
    "transition ease-in-out",
    // Disabled
    "disabled:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        default: [
          // Base
          "bg-orange-50",
          // Hover
          "hover:bg-linear-to-br hover:to-orange-150",
          // Active
          "active:to-orange-50",
          // Disabled
          "disabled:bg-orange-50/20 disabled:text-gray-400",
        ],
        secondary: [
          // Base
          "bg-gray-150 outline outline-gray-50",
          // Hover
          "hover:bg-linear-to-br hover:to-gray-50",
          // Active
          "active:to-gray-150 active:outline-gray-150",
          // Disabled
          "disabled:bg-gray-150 disabled:text-gray-400 disabled:outline-gray-150",
        ],
        outline: [
          // Base
          "bg-orange-50/20 outline outline-orange-50",
          // Hover
          "hover:bg-orange-50",
          // Active
          "active:bg-orange-50/60",
          // Disabled
          "disabled:bg-orange-50/10 disabled:outline-transparent",
        ],
        circle: [
          // Sizing
          "w-12 px-3",
          // Base
          "bg-gray-150 outline outline-gray-50",
          // Hover
          "hover:bg-linear-to-br hover:to-orange-150 hover:outline-orange-50",
          // Active
          "active:bg-orange-150 active:to-orange-50 active:outline-orange-50",
          // Disabled
          "disabled:bg-gray-150 disabled:text-gray-400 disabled:outline-gray-150",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

const Button = ({ className, variant = "default", ...props }: ButtonProps) => {
  return (
    <button
      data-slot="button"
      data-variant={variant}
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  );
};

export { Button, buttonVariants };
