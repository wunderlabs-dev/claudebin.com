import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/helpers";

const typographyVariants = cva([], {
  variants: {
    variant: {
      h1: "font-extrabold text-5xl leading-normal lg:text-7xl",
      h2: "font-extrabold text-4xl leading-normal lg:text-5xl",
      h3: "font-extrabold text-3xl leading-normal",
      h4: "font-semibold text-xl leading-normal",
      body: "font-normal text-xl leading-6",
      small: "font-normal text-base leading-6",
      overline: "font-mono font-normal text-base leading-6",
      caption: "font-normal text-xs leading-6",
    },
    fontWeight: {
      default: [],
      semibold: "font-semibold",
      bold: "font-bold",
    },
    color: {
      default: "text-white",
      neutral: "text-gray-400",
      muted: "text-gray-350",
      accent: "text-orange-50",
    },
    leading: {
      default: [],
      none: "leading-none",
      normal: "leading-normal",
    },
  },
  defaultVariants: {
    variant: "body",
    fontWeight: "default",
    color: "default",
    leading: "default",
  },
});

type VariantElementMap = {
  h1: "h1";
  h2: "h2";
  h3: "h3";
  h4: "h4";
  body: "p";
  small: "p";
  overline: "span";
  caption: "span";
};

type Variant = keyof VariantElementMap;

type TypographyProps<V extends Variant = "body"> = React.ComponentProps<VariantElementMap[V]> &
  VariantProps<typeof typographyVariants> & {
    variant?: V;
    as?: React.ElementType;
  };

const defaultElements: VariantElementMap = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  small: "p",
  overline: "span",
  caption: "span",
};

const Typography = <V extends Variant = "body">({
  variant = "body" as V,
  fontWeight = "default",
  color = "default",
  leading = "default",
  as,
  className,
  ...props
}: TypographyProps<V>) => {
  const Component = as || defaultElements[variant];

  return (
    <Component
      data-slot="typography"
      data-variant={variant}
      className={cn(typographyVariants({ variant, fontWeight, color, leading, className }))}
      {...props}
    />
  );
};

export { Typography, typographyVariants, type Variant as TypographyVariant };
