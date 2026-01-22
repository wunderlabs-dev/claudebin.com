import type { ComponentProps } from "react";

import { cn } from "@/utils/helpers";

type DividerGridProps = ComponentProps<"div">;

const DividerGrid = ({ className, ...props }: DividerGridProps) => (
  <div className={cn("grid grid-cols-12", className)} {...props} />
);

type DividerGridRowProps = ComponentProps<"div">;

const DividerGridRow = ({ className, ...props }: DividerGridRowProps) => (
  <div className={cn("col-span-12 grid grid-cols-12", className)} {...props} />
);

type DividerGridEdgeProps = {
  position: "left" | "right";
  className?: string;
};

const edgeVariantClassNames = {
  left: "w-16 h-px bg-gradient-to-l from-gray-250 to-transparent",
  right: "w-16 h-px bg-gradient-to-r from-gray-250 to-transparent",
};

const DividerGridEdge = ({ position, className }: DividerGridEdgeProps) => (
  <div
    className={cn(
      "col-span-2 flex items-end",
      position === "left" ? "justify-end" : "justify-start",
      className,
    )}
  >
    <div className={edgeVariantClassNames[position]} />
  </div>
);

type DividerGridCellProps = ComponentProps<"div">;

const DividerGridCell = ({ className, ...props }: DividerGridCellProps) => (
  <div className={cn("border-gray-250", className)} {...props} />
);

type DividerGridDividerProps = {
  variant: "top" | "bottom";
  className?: string;
};

const dividerVariantClassNames = {
  top: "h-16 w-px bg-gradient-to-t from-gray-250 to-transparent",
  bottom: "h-16 w-px bg-gradient-to-b from-gray-250 to-transparent",
};

const DividerGridDivider = ({ variant, className }: DividerGridDividerProps) => (
  <div className={cn(dividerVariantClassNames[variant], className)} />
);

export { DividerGrid, DividerGridRow, DividerGridEdge, DividerGridCell, DividerGridDivider };
