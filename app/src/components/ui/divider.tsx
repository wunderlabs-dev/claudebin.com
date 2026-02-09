import type * as React from "react";

import { cn } from "@/utils/helpers";

type DividerProps = React.ComponentProps<"div">;

const Divider = ({ className, ...props }: DividerProps) => {
  return (
    <div data-slot="divider" className={cn("w-full h-px bg-gray-500/30", className)} {...props} />
  );
};

export { Divider };
