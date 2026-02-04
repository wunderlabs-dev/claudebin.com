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
        "inline-flex max-w-xs items-center gap-2",
        "px-2 py-1",
        "rounded-full",
        "border border-gray-250 bg-gray-100",
        "text-gray-400 text-xs",
        className,
      )}
      {...props}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <span className="truncate">{label}</span>
    </span>
  );
};

export { Chip };
