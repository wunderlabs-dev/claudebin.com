import type * as React from "react";

import { cn } from "@/utils/helpers";

type BoxProps = React.ComponentProps<"div">;

const Box = ({ className, ...props }: BoxProps) => {
  return (
    <div data-slot="box" className={cn("p-8 border border-gray-500/40", className)} {...props} />
  );
};

export { Box };
