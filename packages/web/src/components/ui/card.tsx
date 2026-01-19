"use client";

import { createContext, useContext } from "react";
import type * as React from "react";

import { cn } from "@/utils/helpers";

import { Typography, type TypographyVariant } from "@/components/ui/typography";

const CardVariants = ["card", "list", "grid"] as const;

type CardVariant = (typeof CardVariants)[number];
type CardVariantMapping = Record<CardVariant, string>;

const CardContext = createContext<CardVariant>("card");

type CardProps = {
  variant?: CardVariant;
} & React.ComponentProps<"article">;

const cardVariantClassNames: CardVariantMapping = {
  card: "flex flex-col",
  list: "grid grid-cols-6",
  grid: "grid grid-cols-3",
};

const Card = ({ variant = "card", className, children, ...props }: CardProps) => {
  return (
    <CardContext.Provider value={variant}>
      <article
        data-slot="card"
        data-variant={variant}
        className={cn(
          "transition ease-in-out",
          "border border-gray-200 divide-x divide-gray-150",
          "hover:border-orange-50",
          cardVariantClassNames[variant],
          className,
        )}
        {...props}
      >
        {children}
      </article>
    </CardContext.Provider>
  );
};

const cardBodyVariantClassNames: CardVariantMapping = {
  card: "flex flex-col gap-1 p-2",
  list: "col-span-5 flex flex-col gap-3 py-3",
  grid: "col-span-1 flex flex-col justify-end gap-3 py-6",
};

type CardBodyProps = React.ComponentProps<"div">;

const CardBody = ({ className, ...props }: CardBodyProps) => {
  const variant = useContext(CardContext);

  return (
    <div
      data-slot="card-body"
      className={cn("bg-gray-100", cardBodyVariantClassNames[variant], className)}
      {...props}
    />
  );
};

const cardHeaderVariantClassNames: CardVariantMapping = {
  card: "flex flex-col gap-1",
  list: "flex flex-row items-center gap-3",
  grid: "flex flex-col gap-1 px-3",
};

type CardHeaderProps = React.ComponentProps<"div">;

const CardHeader = ({ className, ...props }: CardHeaderProps) => {
  const variant = useContext(CardContext);

  return (
    <div
      data-slot="card-header"
      className={cn(cardHeaderVariantClassNames[variant], className)}
      {...props}
    />
  );
};

type CardTitleVariant = Extract<TypographyVariant, "h3" | "h4" | "small">;

const cardTitleVariantMapping: Record<CardVariant, CardTitleVariant> = {
  card: "small",
  list: "h4",
  grid: "h3",
};

type CardTitleProps = Omit<React.ComponentProps<"p">, "color">;

const CardTitle = ({ className, ...props }: CardTitleProps) => {
  const variant = useContext(CardContext);
  const titleVariant = cardTitleVariantMapping[variant];

  return (
    <Typography
      data-slot="card-title"
      variant={titleVariant}
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

// ABOUTME: CardMetaGroup handles row/column layout for meta items
const CardMetaGroupDirections = ["row", "column"] as const;
type CardMetaGroupDirection = (typeof CardMetaGroupDirections)[number];

const cardMetaGroupDirectionClassNames: Record<CardMetaGroupDirection, string> = {
  row: "flex flex-row items-center gap-3",
  column: "flex flex-col gap-1",
};

type CardMetaGroupProps = {
  direction?: CardMetaGroupDirection;
} & React.ComponentProps<"div">;

const CardMetaGroup = ({ direction = "column", className, ...props }: CardMetaGroupProps) => {
  return (
    <div
      data-slot="card-meta-group"
      className={cn(cardMetaGroupDirectionClassNames[direction], className)}
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

const cardSectionVariantClassNames: CardVariantMapping = {
  card: "flex flex-col gap-1",
  list: "flex flex-col gap-1 pl-8 pr-3",
  grid: "flex flex-col gap-3 px-3",
};

type CardSectionProps = React.ComponentProps<"div">;

const CardSection = ({ className, ...props }: CardSectionProps) => {
  const variant = useContext(CardContext);

  return (
    <div
      data-slot="card-section"
      className={cn(cardSectionVariantClassNames[variant], className)}
      {...props}
    />
  );
};

type CardDividerProps = React.ComponentProps<"div">;

const CardDivider = ({ className, ...props }: CardDividerProps) => {
  return (
    <div data-slot="card-divider" className={cn("bg-gray-150 h-px w-full", className)} {...props} />
  );
};

export {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardDescription,
  CardMetaGroup,
  CardMeta,
  CardSection,
  CardDivider,
  type CardVariant,
};
