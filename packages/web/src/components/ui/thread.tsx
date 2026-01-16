import type * as React from "react";

import { cn } from "@/utils/helpers";

import { Typography, type TypographyVariant } from "@/components/ui/typography";

type ThreadProps = React.ComponentProps<"article">;

const Thread = ({ className, children, ...props }: ThreadProps) => {
  return (
    <article
      data-slot="thread"
      className={cn(
        "relative",
        "px-2 py-2",
        "flex items-stretch",
        "border border-gray-200",
        "transition ease-in-out",
        "hover:border-orange-50",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col flex-1 justify-between">{children}</div>
    </article>
  );
};

type ThreadHeaderProps = React.ComponentProps<"header">;

const ThreadHeader = ({ className, ...props }: ThreadHeaderProps) => {
  return (
    <header
      data-slot="thread-header"
      className={cn("flex items-center self-end gap-4 bg-gray-100 pl-4 pb-4 pr-2 pt-2", className)}
      {...props}
    />
  );
};

type ThreadContentProps = React.ComponentProps<"div">;

const ThreadContent = ({ className, ...props }: ThreadContentProps) => {
  return (
    <div
      data-slot="thread-content"
      className={cn("flex flex-col self-start gap-4 bg-gray-100 px-2 py-2", className)}
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

type ThreadMetaProps = {
  icon: React.ReactNode;
} & React.ComponentProps<"div">;

const ThreadMeta = ({ icon, children, className, ...props }: ThreadMetaProps) => {
  return (
    <div data-slot="thread-meta" className={cn("flex items-center gap-1", className)} {...props}>
      {icon}
      <Typography variant="caption" color="neutral" leading="normal">
        {children}
      </Typography>
    </div>
  );
};

export { Thread, ThreadHeader, ThreadContent, ThreadTitle, ThreadDescription, ThreadMeta };
