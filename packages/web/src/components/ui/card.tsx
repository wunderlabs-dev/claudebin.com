import type * as React from "react";

import { Typography } from "@/components/ui/typography";

import { cn } from "@/utils/helpers";

type CardProps = React.ComponentProps<"article">;

const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <article
      data-slot="card"
      className={cn(
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

type CardHeaderProps = React.ComponentProps<"header">;

const CardHeader = ({ className, ...props }: CardHeaderProps) => {
  return (
    <header
      data-slot="card-header"
      className={cn("flex items-center self-end gap-4 bg-gray-100 pl-4 pb-4 pr-2 pt-2", className)}
      {...props}
    />
  );
};

type CardContentProps = React.ComponentProps<"div">;

const CardContent = ({ className, ...props }: CardContentProps) => {
  return (
    <div
      data-slot="card-content"
      className={cn("flex flex-col self-start gap-4 bg-gray-100 px-2 py-2", className)}
      {...props}
    />
  );
};

type CardTitleProps = Omit<React.ComponentProps<"p">, "color">;

const CardTitle = ({ className, ...props }: CardTitleProps) => {
  return (
    <Typography
      data-slot="card-title"
      variant="small"
      fontWeight="semibold"
      leading="normal"
      className={className}
      {...props}
    />
  );
};

type CardDescriptionProps = Omit<React.ComponentProps<"p">, "color">;

const CardDescription = ({ className, ...props }: CardDescriptionProps) => {
  return (
    <Typography
      data-slot="card-description"
      variant="small"
      color="neutral"
      leading="normal"
      className={className}
      {...props}
    />
  );
};

type CardMetaProps = {
  icon: React.ReactNode;
} & React.ComponentProps<"div">;

const CardMeta = ({ icon, children, className, ...props }: CardMetaProps) => {
  return (
    <div data-slot="card-meta" className={cn("flex items-center gap-1", className)} {...props}>
      {icon}
      <Typography variant="caption" color="neutral" leading="normal">
        {children}
      </Typography>
    </div>
  );
};

export { Card, CardHeader, CardContent, CardTitle, CardDescription, CardMeta };
