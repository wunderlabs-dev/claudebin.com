import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/helpers";

const typographyVariants = cva("text-inherit", {
  variants: {
    variant: {
      h1: "text-7xl font-extrabold leading-normal",
      h2: "text-5xl font-extrabold leading-normal",
      h3: "text-3xl font-extrabold leading-normal",
      h4: "text-xl font-semibold leading-normal",
      body: "text-xl font-normal leading-6",
      small: "text-base font-normal leading-6",
      caption: "text-xs font-normal leading-6",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

type VariantElementMap = {
  h1: "h1";
  h2: "h2";
  h3: "h3";
  h4: "h4";
  body: "p";
  small: "p";
  caption: "span";
};

type Variant = keyof VariantElementMap;

type TypographyProps<V extends Variant = "body"> = React.ComponentProps<
  VariantElementMap[V]
> &
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
  caption: "span",
};

const Typography = <V extends Variant = "body">({
  variant = "body" as V,
  as,
  className,
  ...props
}: TypographyProps<V>) => {
  const Component = as || defaultElements[variant];

  return (
    <Component
      data-slot="typography"
      data-variant={variant}
      className={cn(typographyVariants({ variant, className }))}
      {...props}
    />
  );
};

export { Typography, typographyVariants };
