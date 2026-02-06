"use client";

import type * as React from "react";
import Link from "next/link";
import { createContext, useContext } from "react";

import { cn } from "@/utils/helpers";

import { Typography, type TypographyVariant } from "@/components/ui/typography";
import { SvgIconArrowLink } from "@/components/icon";

const CardVariants = ["card", "list", "grid"] as const;

type CardVariant = (typeof CardVariants)[number];
type CardVariantMapping = Record<CardVariant, string>;

const CardContext = createContext<CardVariant>("card");

type CardProps = {
  variant?: CardVariant;
  href?: string;
} & Omit<React.ComponentProps<typeof Link>, "href">;

const cardVariantClassNames: CardVariantMapping = {
  card: "flex flex-col shrink-0 justify-between size-76 bg-dot text-gray-500/40 hover:text-orange-50",
  list: "relative grid grid-cols-6 -mt-px divide-y divide-gray-250 hover:z-10 lg:divide-y-0 lg:divide-x",
  grid: "relative grid grid-cols-1 -mt-px divide-y divide-gray-250 hover:z-10 lg:grid-cols-3 lg:divide-y-0 lg:divide-x",
} as const;

const Card = ({ variant = "card", href, className, children, ...props }: CardProps) => {
  return (
    <CardContext.Provider value={variant}>
      {href ? (
        <Link
          href={href}
          data-slot="card"
          data-variant={variant}
          className={cn(
            "group border border-gray-250 hover:border-orange-50",
            cardVariantClassNames[variant],
            className,
          )}
          {...props}
        >
          {children}
        </Link>
      ) : (
        <article
          data-slot="card"
          data-variant={variant}
          className={cn("group border border-gray-250", cardVariantClassNames[variant], className)}
          {...props}
        >
          {children}
        </article>
      )}
    </CardContext.Provider>
  );
};

const cardBodyVariantClassNames: CardVariantMapping = {
  card: "flex flex-col self-start max-w-3xs gap-3 p-4 bg-gray-100",
  list: "flex flex-col col-span-12 lg:col-span-5 gap-3 py-3",
  grid: "relative flex flex-col justify-end col-span-1 gap-3 py-3 md:py-6",
} as const;

type CardBodyProps = React.ComponentProps<"div">;

const CardBody = ({ className, ...props }: CardBodyProps) => {
  const variant = useContext(CardContext);

  return (
    <div
      data-slot="card-body"
      className={cn(cardBodyVariantClassNames[variant], className)}
      {...props}
    />
  );
};

const cardHeaderVariantClassNames: CardVariantMapping = {
  card: "flex flex-col gap-1",
  list: "flex flex-row justify-between gap-3",
  grid: "flex flex-col gap-1 px-4 md:px-3",
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
      className={cn(className, "break-all")}
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

const cardSectionVariantClassNames: CardVariantMapping = {
  card: "flex flex-col gap-1",
  list: "flex flex-col gap-3 pl-4 pr-4 md:gap-1 md:pl-8 md:pr-3",
  grid: "flex flex-col gap-3 px-4 md:px-3",
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
    <div
      data-slot="card-divider"
      className={cn("w-full h-px", "bg-gray-200", className)}
      {...props}
    />
  );
};

const cardActionsVariantClassNames: CardVariantMapping = {
  card: "ml-auto",
  list: "ml-auto",
  grid: "absolute top-3 right-3",
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
  CardSection,
  CardDivider,
  CardActions,
  type CardVariant,
};
