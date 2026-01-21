import type { ComponentProps } from "react";

import { cn } from "@/utils/helpers";
import { spacingClassNames, type Spacing } from "@/utils/constants";

import { SvgIconOrbits } from "@/components/icon";

type BackdropSize = "full" | "half";

type BackdropProps = {
  size?: BackdropSize;
  spacing?: Spacing;
} & ComponentProps<"div">;

const backdropSizeClassNames: Record<BackdropSize, string> = {
  full: "inset-y-0",
  half: "top-0 h-1/2 border-b border-gray-500/10",
};

const Backdrop = ({
  size = "full",
  spacing = "none",
  children,
  className,
  ...props
}: BackdropProps) => {
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
      <div className={cn("relative", spacingClassNames[spacing])}>{children}</div>
    </div>
  );
};

export { Backdrop };
