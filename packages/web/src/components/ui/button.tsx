import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/helpers";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "h-12 gap-3 px-5 py-3",
    "rounded-full",
    "whitespace-nowrap text-white",
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
          "active:ridge-t active:to-orange-50",
          "disabled:bg-orange-50/20 disabled:text-gray-450",
        ],
        secondary: [
          "border border-gray-50 bg-gray-200",
          "hover:bg-linear-to-br hover:to-gray-50",
          "active:ridge-t active:border-gray-200 active:to-gray-200",
          "disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-450",
        ],
        outline: [
          "border border-orange-50 bg-orange-50/20",
          "hover:bg-orange-50",
          "active:bg-orange-50/60",
          "disabled:border-transparent disabled:bg-orange-50/10",
        ],
        icon: [
          "w-12",
          "px-3",
          "border border-gray-50 bg-gray-200",
          "hover:border-orange-50 hover:bg-linear-to-br hover:bg-orange-50 hover:to-orange-150",
          "active:ridge-t active:border-orange-50 active:bg-orange-50 active:to-orange-50",
          "disabled:border-transparent disabled:bg-gray-200 disabled:text-gray-450",
        ],
        danger: [
          "border border-red-50 bg-red-50/25",
          "hover:bg-red-50",
          "active:bg-red-50/60",
          "disabled:border-transparent disabled:bg-red-50/10 disabled:text-gray-450",
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
        className: "border-green-50 bg-green-50/10 hover:bg-green-50/20 active:bg-green-50/10",
      },
    ],
    defaultVariants: {
      variant: "default",
      color: "default",
    },
  },
);

type ButtonProps<T extends React.ElementType = "button"> = {
  as?: T;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  color?: VariantProps<typeof buttonVariants>["color"];
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

const Button = <T extends React.ElementType = "button">({
  as,
  variant = "default",
  color = "default",
  className,
  children,
  ...props
}: ButtonProps<T>) => {
  const Component = as || "button";

  return (
    <Component
      data-slot="button"
      data-variant={variant}
      data-color={color}
      className={cn(buttonVariants({ variant, color, className }))}
      {...props}
    >
      {children}
    </Component>
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
        "[&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
};

export { Button, ButtonText, buttonVariants };
