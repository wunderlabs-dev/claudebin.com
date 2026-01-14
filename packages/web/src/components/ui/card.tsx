import type * as React from "react";

import { cn } from "@/utils/helpers";

type CardProps = React.ComponentProps<"article">;

const Card = ({ className, ...props }: CardProps) => {
  return (
    <article
      data-slot="card"
      className={cn(
        "flex flex-col",
        "border border-gray-200",
        "px-2 py-2",
        className,
      )}
      {...props}
    />
  );
};

type CardHeaderProps = React.ComponentProps<"header">;

const CardHeader = ({ className, ...props }: CardHeaderProps) => {
  return (
    <header data-slot="card-header" className={cn("", className)} {...props} />
  );
};

type CardMetaProps = React.ComponentProps<"div">;

const CardMeta = ({ className, ...props }: CardMetaProps) => {
  return (
    <div
      data-slot="card-meta"
      className={cn("flex items-center gap-2 text-sm text-gray-400", className)}
      {...props}
    />
  );
};

type CardContentProps = React.ComponentProps<"div">;

const CardContent = ({ className, ...props }: CardContentProps) => {
  return (
    <div
      data-slot="card-content"
      className={cn("flex flex-col gap-1 p-4", className)}
      {...props}
    />
  );
};

type CardFooterProps = React.ComponentProps<"footer">;

const CardFooter = ({ className, ...props }: CardFooterProps) => {
  return (
    <footer
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-4 px-4 pb-4 text-sm text-gray-400",
        className,
      )}
      {...props}
    />
  );
};

export { Card, CardHeader, CardMeta, CardContent, CardFooter };
