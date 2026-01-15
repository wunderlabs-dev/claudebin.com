import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/helpers";

type ListProps = React.ComponentProps<"ul">;

const List = ({ className, ...props }: ListProps) => {
  return <ul data-slot="list" className={cn("flex gap-8", className)} {...props} />;
};

const listItemVariants = cva(
  [
    "group",
    "flex items-center",
    "gap-3",
    "font-medium text-white whitespace-nowrap",
    "cursor-pointer select-none",
  ],
  {
    variants: {
      variant: {
        default: "",
        active: "text-orange-50 [&>svg]:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type ListItemProps = React.ComponentProps<"li"> & VariantProps<typeof listItemVariants>;

const ListItem = ({ className, variant = "default", ...props }: ListItemProps) => {
  return (
    <li
      data-slot="list-item"
      data-variant={variant}
      className={cn(listItemVariants({ variant, className }))}
      {...props}
    />
  );
};

const listItemLabelVariants = cva(
  [
    "relative",
    "after:absolute after:inset-x-0 after:top-full",
    "after:h-px",
    "after:bg-orange-50",
    "after:origin-left after:scale-x-0",
    "after:transition-transform after:ease-in-out",
  ],
  {
    variants: {
      variant: {
        default: "group-hover:after:scale-x-50",
        active: "after:scale-x-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type ListItemLabelProps = React.ComponentProps<"span"> & VariantProps<typeof listItemLabelVariants>;

const ListItemLabel = ({ className, variant = "default", ...props }: ListItemLabelProps) => {
  return (
    <span
      data-slot="list-item-label"
      className={cn(listItemLabelVariants({ variant, className }))}
      {...props}
    />
  );
};

export { List, ListItem, listItemVariants, ListItemLabel, listItemLabelVariants };
