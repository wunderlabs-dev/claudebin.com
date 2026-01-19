import type * as React from "react";

import { cn } from "@/utils/helpers";

type ChipProps = {
  icon?: React.ReactNode;
  label: string;
} & Omit<React.ComponentProps<"span">, "children">;

const Chip = ({ icon, label, className, ...props }: ChipProps) => {
  return (
    <span
      data-slot="chip"
      className={cn(
        "inline-flex items-center gap-2",
        "px-2 py-1",
        "rounded-full",
        "border border-gray-250 bg-gray-100",
        "text-xs text-gray-400",
        className,
      )}
      {...props}
    >
      {icon}
      {label}
    </span>
  );
};

export { Chip };
