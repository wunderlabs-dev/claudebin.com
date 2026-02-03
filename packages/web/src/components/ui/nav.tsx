import type * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/helpers";

type NavProps = React.ComponentProps<"nav">;

const Nav = ({ className, ...props }: NavProps) => {
  return <nav data-slot="nav" className={cn("flex gap-8", className)} {...props} />;
};

const navLinkVariants = cva(
  [
    "group",
    "inline-flex items-center gap-3",
    "whitespace-nowrap font-medium text-white",
    "cursor-pointer select-none",
  ],
  {
    variants: {
      variant: {
        default: [],
        active: "text-orange-50 [&>svg]:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type NavLinkProps = React.ComponentProps<typeof Link> & VariantProps<typeof navLinkVariants>;

const NavLink = ({ className, variant = "default", ...props }: NavLinkProps) => {
  return (
    <Link
      data-slot="nav-link"
      data-variant={variant}
      className={cn(navLinkVariants({ variant, className }))}
      {...props}
    />
  );
};

const navLabelVariants = cva(
  [
    "relative",
    "after:absolute after:inset-x-0 after:top-full",
    "after:h-px",
    "after:bg-orange-50",
    "after:origin-left after:scale-x-0",
    "after:transition-transform after:ease-in-out",
  ],
  {
    variants: {
      variant: {
        default: "group-hover:after:scale-x-50",
        active: "after:scale-x-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type NavLabelProps = React.ComponentProps<"span"> & VariantProps<typeof navLabelVariants>;

const NavLabel = ({ className, variant = "default", ...props }: NavLabelProps) => {
  return (
    <span
      data-slot="nav-label"
      className={cn(navLabelVariants({ variant, className }))}
      {...props}
    />
  );
};

export { Nav, NavLink, navLinkVariants, NavLabel, navLabelVariants };
