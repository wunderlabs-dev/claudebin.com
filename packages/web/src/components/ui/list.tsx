import type * as React from "react";

import { cn } from "@/utils/helpers";

import { Typography } from "@/components/ui/typography";

const ListDirections = ["row", "column"] as const;
type ListDirection = (typeof ListDirections)[number];

const ListAligns = ["start", "end", "between"] as const;
type ListAlign = (typeof ListAligns)[number];

const listDirectionClassNames: Record<ListDirection, string> = {
  row: "flex flex-row items-center gap-3",
  column: "flex flex-col gap-1",
};

const listAlignClassNames: Record<ListAlign, string | string[]> = {
  start: [],
  end: "ml-auto",
  between: "justify-between",
};

type ListProps = {
  direction?: ListDirection;
  align?: ListAlign;
} & React.ComponentProps<"div">;

const List = ({ direction = "column", align = "start", className, ...props }: ListProps) => {
  return (
    <div
      data-slot="list"
      className={cn(listDirectionClassNames[direction], listAlignClassNames[align], className)}
      {...props}
    />
  );
};

const ListItemAligns = ["start", "end"] as const;
type ListItemAlign = (typeof ListItemAligns)[number];

const listItemAlignClassNames: Record<ListItemAlign, string | string[]> = {
  start: [],
  end: "ml-auto",
};

type ListItemProps = {
  icon: React.ReactNode;
  align?: ListItemAlign;
} & React.ComponentProps<"div">;

const ListItem = ({ icon, align = "start", children, className, ...props }: ListItemProps) => {
  return (
    <div
      data-slot="list-item"
      className={cn("flex items-center gap-1", listItemAlignClassNames[align], className)}
      {...props}
    >
      <div className="shrink-0">{icon}</div>
      <Typography variant="caption" color="neutral" leading="normal">
        {children}
      </Typography>
    </div>
  );
};

export { List, ListItem };
