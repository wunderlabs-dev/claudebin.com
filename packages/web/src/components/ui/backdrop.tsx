import type { ComponentProps } from "react";

import { cn } from "@/utils/helpers";

import { SvgIconOrbits } from "@/components/icon";

const BackdropSizes = ["full", "half"] as const;
type BackdropSize = (typeof BackdropSizes)[number];

const BackdropSpacingValues = ["none", "sm", "lg"] as const;
type BackdropSpacing = (typeof BackdropSpacingValues)[number];

type BackdropProps = {
  size?: BackdropSize;
  spacing?: BackdropSpacing;
} & ComponentProps<"div">;

const backdropSizeClassNames: Record<BackdropSize, string> = {
  full: "inset-y-0",
  half: "top-0 h-1/2 border-b border-gray-500/10",
};

const backdropSpacingClassNames: Record<BackdropSpacing, string> = {
  none: "pt-0",
  sm: "pt-24",
  lg: "pt-48",
};

const Backdrop = ({ size = "full", spacing = "none", children, className, ...props }: BackdropProps) => {
  return (
    <div data-slot="backdrop" className={cn("relative w-full", className)} {...props}>
      {size === "half" ? (
        <SvgIconOrbits className="absolute inset-x-0 top-3/4 -z-10 w-container h-auto text-gray-500/40" />
      ) : null}
      <div
        className={cn(
          "absolute inset-x-0 -z-10 bg-grid pointer-events-none",
          backdropSizeClassNames[size],
        )}
      />
      <div className={cn("relative", backdropSpacingClassNames[spacing])}>{children}</div>
    </div>
  );
};

export { Backdrop };
