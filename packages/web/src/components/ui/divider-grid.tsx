import type { ComponentProps } from "react";

import { cn } from "@/utils/helpers";

import { SvgIconDivider } from "@/components/icon";

// DividerGrid
type DividerGridProps = ComponentProps<"div">;

const DividerGrid = ({ className, ...props }: DividerGridProps) => (
  <div className={cn("grid grid-cols-12", className)} {...props} />
);

// DividerGridRow
type DividerGridRowProps = ComponentProps<"div">;

const DividerGridRow = ({ className, ...props }: DividerGridRowProps) => (
  <div className={cn("col-span-12 grid grid-cols-12", className)} {...props} />
);

// DividerGridEdge
type DividerGridEdgeProps = {
  position: "left" | "right";
  className?: string;
};

const DividerGridEdge = ({ position, className }: DividerGridEdgeProps) => (
  <div
    className={cn(
      "col-span-2 flex items-end",
      position === "left" ? "justify-end" : "justify-start",
      className
    )}
  >
    <SvgIconDivider variant={position} />
  </div>
);

// DividerGridCell
type DividerGridCellProps = ComponentProps<"div">;

const DividerGridCell = ({ className, ...props }: DividerGridCellProps) => (
  <div className={cn("border-gray-250", className)} {...props} />
);

// DividerGridDivider
type DividerGridDividerProps = {
  variant: "top" | "bottom";
  className?: string;
};

const DividerGridDivider = ({ variant, className }: DividerGridDividerProps) => (
  <SvgIconDivider variant={variant} className={className} />
);

export {
  DividerGrid,
  DividerGridRow,
  DividerGridEdge,
  DividerGridCell,
  DividerGridDivider,
};
