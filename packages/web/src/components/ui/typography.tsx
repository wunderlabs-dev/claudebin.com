import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/helpers";

const typographyVariants = cva([], {
  variants: {
    variant: {
      h1: "text-7xl font-extrabold leading-normal",
      h2: "text-5xl font-extrabold leading-normal",
      h3: "text-3xl font-extrabold leading-normal",
      h4: "text-xl font-semibold leading-normal",
      body: "text-xl font-normal leading-6",
      small: "text-base font-normal leading-6",
      overline: "text-base font-normal font-mono leading-6",
      caption: "text-xs font-normal leading-6",
    },
    fontWeight: {
      default: [],
      semibold: "font-semibold",
      bold: "font-bold",
    },
    color: {
      default: "text-inherit",
      neutral: "text-gray-350",
    },
    leading: {
      default: [],
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

export { Typography, typographyVariants };
