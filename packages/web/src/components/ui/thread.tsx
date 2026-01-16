"use client";

import { createContext, useContext } from "react";
import type * as React from "react";

import { cn } from "@/utils/helpers";

import { Typography, type TypographyVariant } from "@/components/ui/typography";

const ThreadVariants = ["card", "detailed", "grid"] as const;
type ThreadVariant = (typeof ThreadVariants)[number];

const ThreadContext = createContext<ThreadVariant>("card");

type ThreadProps = {
  variant?: ThreadVariant;
} & React.ComponentProps<"article">;

const Thread = ({ variant = "card", className, children, ...props }: ThreadProps) => {
  return (
    <ThreadContext.Provider value={variant}>
      <article
        data-slot="thread"
        data-variant={variant}
        className={cn(
          "border border-gray-200",
          "transition ease-in-out",
          "hover:border-orange-50",
          className,
        )}
        {...props}
      >
        {children}
      </article>
    </ThreadContext.Provider>
  );
};

const threadContentVariantClassNames: Record<ThreadVariant, string> = {
  card: "px-2 py-2 flex flex-col",
  detailed: "grid grid-cols-12",
  grid: "grid grid-cols-3",
};

type ThreadContentProps = React.ComponentProps<"div">;

const ThreadContent = ({ className, ...props }: ThreadContentProps) => {
  const variant = useContext(ThreadContext);

  return (
    <div
      data-slot="thread-content"
      className={cn("bg-gray-100", threadContentVariantClassNames[variant], className)}
      {...props}
    />
  );
};

const ThreadColumnDividers = ["left", "right", "both"] as const;
type ThreadColumnDivider = (typeof ThreadColumnDividers)[number];

const threadColumnDividerClassNames: Record<ThreadColumnDivider, string> = {
  left: "border-l border-gray-500/30",
  right: "border-r border-gray-500/30",
  both: "border-x border-gray-500/30",
};

type ThreadColumnProps = {
  divider?: ThreadColumnDivider;
} & React.ComponentProps<"div">;

const ThreadColumn = ({ divider, className, ...props }: ThreadColumnProps) => {
  return (
    <div
      data-slot="thread-column"
      className={cn(divider && threadColumnDividerClassNames[divider], className)}
      {...props}
    />
  );
};

type ThreadTitleVariant = Extract<TypographyVariant, "h3" | "h4" | "small">;

type ThreadTitleProps = {
  variant?: ThreadTitleVariant;
} & Omit<React.ComponentProps<"p">, "color">;

const ThreadTitle = ({ variant = "small", className, ...props }: ThreadTitleProps) => {
  return (
    <Typography
      data-slot="thread-title"
      variant={variant}
      fontWeight="semibold"
      leading="normal"
      className={className}
      {...props}
    />
  );
};

type ThreadDescriptionProps = Omit<React.ComponentProps<"p">, "color">;

const ThreadDescription = ({ className, ...props }: ThreadDescriptionProps) => {
  return (
    <Typography
      data-slot="thread-description"
      variant="small"
      color="neutral"
      leading="normal"
      className={className}
      {...props}
    />
  );
};

const ThreadGroupDirections = ["row", "column"] as const;
type ThreadGroupDirection = (typeof ThreadGroupDirections)[number];

const threadGroupDirectionClassNames: Record<ThreadGroupDirection, string> = {
  row: "flex flex-row gap-3",
  column: "flex flex-col gap-1",
};

type ThreadGroupProps = {
  direction?: ThreadGroupDirection;
} & React.ComponentProps<"div">;

const ThreadGroup = ({ direction = "column", className, ...props }: ThreadGroupProps) => {
  return (
    <div
      data-slot="thread-group"
      className={cn(threadGroupDirectionClassNames[direction], className)}
      {...props}
    />
  );
};

type ThreadGroupItemProps = {
  icon: React.ReactNode;
} & React.ComponentProps<"div">;

const ThreadGroupItem = ({ icon, children, className, ...props }: ThreadGroupItemProps) => {
  return (
    <div data-slot="thread-group-item" className={cn("flex items-center gap-1", className)} {...props}>
      {icon}
      <Typography variant="caption" color="neutral" leading="normal">
        {children}
      </Typography>
    </div>
  );
};

export {
  Thread,
  ThreadContent,
  ThreadColumn,
  ThreadTitle,
  ThreadDescription,
  ThreadGroup,
  ThreadGroupItem,
};
