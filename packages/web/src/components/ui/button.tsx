import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/helpers";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "h-12 px-5 py-3 gap-3",
    "rounded-full",
    "text-white whitespace-nowrap",
    "cursor-pointer select-none",
    "transition ease-in-out",
    "disabled:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-orange-50",
          "hover:bg-linear-to-br hover:to-orange-150",
          "active:to-orange-50 active:ridge-t",
          "disabled:bg-orange-50/20 disabled:text-gray-500",
        ],
        secondary: [
          "bg-gray-200 border border-gray-50",
          "hover:bg-linear-to-br hover:to-gray-50",
          "active:to-gray-200 active:border-gray-200 active:ridge-t",
          "disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-500",
        ],
        outline: [
          "bg-orange-50/20 border border-orange-50",
          "hover:bg-orange-50",
          "active:bg-orange-50/60",
          "disabled:bg-orange-50/10 disabled:border-transparent",
        ],
        circle: [
          "w-12",
          "px-3",
          "bg-gray-200 border border-gray-50",
          "hover:bg-orange-50 hover:bg-linear-to-br hover:to-orange-150",
          "active:bg-orange-50 active:to-orange-50 active:ridge-t",
          "disabled:bg-gray-200 disabled:border-transparent disabled:text-gray-500",
        ],
        danger: [
          "bg-red-50/25 border border-red-50",
          "hover:bg-red-50",
          "active:bg-red-50/60",
          "disabled:bg-red-50/10 disabled:border-transparent disabled:text-gray-500",
        ],
        link: ["group", "h-auto px-0 py-0 rounded-none", "disabled:text-gray-250"],
      },
      color: {
        default: [],
        success: [],
      },
    },
    compoundVariants: [
      {
        variant: "outline",
        color: "success",
        className: "bg-green-50/10 border-green-50 hover:bg-green-50/20 active:bg-green-50/10",
      },
    ],
    defaultVariants: {
      variant: "default",
      color: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

const Button = ({ className, variant = "default", color = "default", ...props }: ButtonProps) => {
  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-color={color}
      className={cn(buttonVariants({ variant, color, className }))}
      {...props}
    />
  );
};

type ButtonTextProps = React.ComponentProps<"span">;

const ButtonText = ({ className, ...props }: ButtonTextProps) => {
  return (
    <span
      data-slot="button-text"
      className={cn(
        "relative",
        "after:absolute after:inset-x-0 after:top-full",
        "after:h-px after:bg-orange-50",
        "after:origin-left after:scale-x-0",
        "after:transition-transform after:ease-in-out",
        "group-hover:after:scale-x-100 group-active:text-orange-50",
        className,
      )}
      {...props}
    />
  );
};

export { Button, ButtonText, buttonVariants };
