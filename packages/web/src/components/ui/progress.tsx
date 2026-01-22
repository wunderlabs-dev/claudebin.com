"use client";

import type * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/utils/helpers";

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root>;

const Progress = ({ className, value, ...props }: ProgressProps) => {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn("relative h-px w-full bg-gray-200", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="-inset-y-px absolute left-0 rounded-full bg-orange-250 transition-all"
        style={{
          width: `${value}%`,
        }}
      />
    </ProgressPrimitive.Root>
  );
};

export { Progress };
