"use client";

import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/helpers";

const checkboxVariants = cva(
  [
    "peer",
    "shrink-0",
    "size-5",
    "appearance-none",
    "rounded-sm border border-gray-250",
    "cursor-pointer",
    "outline-none",
    "transition-colors duration-150 ease-in-out",
    "checked:border-orange-50 checked:bg-orange-50",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: "hover:border-gray-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type CheckboxProps = Omit<ComponentProps<"input">, "type"> & VariantProps<typeof checkboxVariants>;

const Checkbox = ({ className, variant = "default", ...props }: CheckboxProps) => {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      data-variant={variant}
      className={cn(checkboxVariants({ variant, className }))}
      {...props}
    />
  );
};

export { Checkbox, checkboxVariants };
