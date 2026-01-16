import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/helpers";

const stackVariants = cva(["flex"], {
  variants: {
    direction: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    direction: "horizontal",
  },
});

type StackProps = React.ComponentProps<"div"> & VariantProps<typeof stackVariants>;

const Stack = ({ className, direction = "horizontal", ...props }: StackProps) => {
  return (
    <div
      data-slot="stack"
      data-direction={direction}
      className={cn(stackVariants({ direction, className }))}
      {...props}
    />
  );
};

export { Stack };
