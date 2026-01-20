import type * as React from "react";

import { cn } from "@/utils/helpers";

import { SvgIconOrbits } from "@/components/icon";

const BackdropSizes = ["full", "half"] as const;
type BackdropSize = (typeof BackdropSizes)[number];
type BackdropSizeMapping = Record<BackdropSize, string>;

type BackdropProps = {
  size?: BackdropSize;
} & React.ComponentProps<"div">;

const backdropSizeClassNames: BackdropSizeMapping = {
  full: "inset-y-0",
  half: "top-0 h-1/2 border-b border-gray-500/10",
};

const Backdrop = ({ size = "full", children, className, ...props }: BackdropProps) => {
  return (
    <div data-slot="backdrop" className={cn("relative w-full", className)} {...props}>
      {size === "half" ? (
        <SvgIconOrbits className="absolute inset-x-0 top-3/4 w-container h-auto text-gray-500/40" />
      ) : null}
      <div
        className={cn(
          "absolute inset-x-0 bg-grid pointer-events-none",
          backdropSizeClassNames[size],
        )}
      />

      <div className="relative">{children}</div>
    </div>
  );
};

export { Backdrop, BackdropSizes };
export type { BackdropProps, BackdropSize };
