import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/helpers";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-3",
    "h-12 px-5 py-3",
    "rounded-full",
    "whitespace-nowrap",
    "select-none cursor-pointer",
    "transition ease-in-out",
    "disabled:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-orange-50",
          "hover:bg-linear-to-br hover:to-orange-150",
          "active:to-orange-50 active:shadow-ridge-t",
          "disabled:bg-orange-50/20 disabled:text-gray-400",
        ],
        secondary: [
          "bg-gray-150 outline outline-gray-50",
          "hover:bg-linear-to-br hover:to-gray-50",
          "active:to-gray-150 active:outline-gray-150 active:shadow-ridge-t",
          "disabled:bg-gray-150 disabled:text-gray-400 disabled:outline-gray-150",
        ],
        outline: [
          "bg-orange-50/20 outline outline-orange-50",
          "hover:bg-orange-50",
          "active:bg-orange-50/60 ",
          "disabled:bg-orange-50/10 disabled:outline-transparent",
        ],
        circle: [
          "w-12 px-3",
          "bg-gray-150 outline outline-gray-50",
          "hover:bg-orange-50 hover:bg-linear-to-br hover:to-orange-150",
          "active:bg-orange-50 active:to-orange-50 active:shadow-ridge-t",
          "disabled:bg-orange-50/20 disabled:text-gray-400",
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
