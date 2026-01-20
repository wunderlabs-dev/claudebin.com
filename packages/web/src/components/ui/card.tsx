"use client";

import { createContext, useContext } from "react";
import type * as React from "react";

import { cn } from "@/utils/helpers";

import { Typography, type TypographyVariant } from "@/components/ui/typography";
import { SvgIconArrowLink } from "@/components/icon";

const CardVariants = ["card", "list", "grid"] as const;

type CardVariant = (typeof CardVariants)[number];
type CardVariantMapping = Record<CardVariant, string>;

const CardContext = createContext<CardVariant>("card");

type CardProps = {
  variant?: CardVariant;
} & React.ComponentProps<"article">;

const cardVariantClassNames: CardVariantMapping = {
  card: "size-76 shrink-0 flex flex-col justify-between bg-dot text-gray-500/40 hover:text-orange-50",
  list: "grid grid-cols-6 divide-x divide-gray-250",
  grid: "grid grid-cols-3 divide-x divide-gray-250",
} as const;

const Card = ({ variant = "card", className, children, ...props }: CardProps) => {
  return (
    <CardContext.Provider value={variant}>
      <article
        data-slot="card"
        data-variant={variant}
        className={cn(
          "group border border-gray-250 transition ease-in-out hover:border-orange-50",
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
  card: "flex flex-col self-start gap-3 p-4",
  list: "flex flex-col col-span-5 gap-3 py-3",
  grid: "flex flex-col justify-end col-span-1 gap-3 relative py-6",
} as const;

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
  list: "flex flex-row justify-between gap-3",
  grid: "flex flex-col gap-1 px-3",
} as const;

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
} as const;

type CardTitleProps = Omit<React.ComponentProps<"p">, "color">;

const CardTitle = ({ className, ...props }: CardTitleProps) => {
  const variant = useContext(CardContext);

  return (
    <Typography
      data-slot="card-title"
      variant={cardTitleVariantMapping[variant]}
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

const CardMetaGroupDirections = ["row", "column"] as const;
type CardMetaGroupDirection = (typeof CardMetaGroupDirections)[number];

const CardMetaGroupAligns = ["start", "end", "between"] as const;
type CardMetaGroupAlign = (typeof CardMetaGroupAligns)[number];

const cardMetaGroupDirectionClassNames: Record<CardMetaGroupDirection, string> = {
  row: "flex flex-row items-center gap-3",
  column: "flex flex-col gap-1",
} as const;

const cardMetaGroupAlignClassNames: Record<CardMetaGroupAlign, string | string[]> = {
  start: [],
  end: "ml-auto",
  between: "justify-between",
} as const;

type CardMetaGroupProps = {
  direction?: CardMetaGroupDirection;
  align?: CardMetaGroupAlign;
} & React.ComponentProps<"div">;

const CardMetaGroup = ({
  direction = "column",
  align = "start",
  className,
  ...props
}: CardMetaGroupProps) => {
  return (
    <div
      data-slot="card-meta-group"
      className={cn(
        cardMetaGroupDirectionClassNames[direction],
        cardMetaGroupAlignClassNames[align],
        className,
      )}
      {...props}
    />
  );
};

const CardMetaAligns = ["start", "end"] as const;
type CardMetaAlign = (typeof CardMetaAligns)[number];

const cardMetaAlignClassNames: Record<CardMetaAlign, string | string[]> = {
  start: [],
  end: "ml-auto",
} as const;

type CardMetaProps = {
  icon: React.ReactNode;
  align?: CardMetaAlign;
} & React.ComponentProps<"div">;

const CardMeta = ({ icon, align = "start", children, className, ...props }: CardMetaProps) => {
  return (
    <div
      data-slot="card-meta"
      className={cn("flex items-center gap-1", cardMetaAlignClassNames[align], className)}
      {...props}
    >
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
} as const;

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
    <div data-slot="card-divider" className={cn("h-px w-full bg-gray-200", className)} {...props} />
  );
};

const cardActionsVariantClassNames: CardVariantMapping = {
  card: "ml-auto",
  list: "ml-auto",
  grid: "absolute right-3 top-3",
} as const;

type CardActionsProps = Omit<React.ComponentProps<"button">, "children">;

const CardActions = ({ className, ...props }: CardActionsProps) => {
  const variant = useContext(CardContext);

  return (
    <button
      type="button"
      data-slot="card-actions"
      className={cn("cursor-pointer", cardActionsVariantClassNames[variant], className)}
      {...props}
    >
      <SvgIconArrowLink size="sm" color="accent" />
    </button>
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
  CardActions,
  type CardVariant,
};
