import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/helpers";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "h-9 px-4 py-2 border bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "h-9 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

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
