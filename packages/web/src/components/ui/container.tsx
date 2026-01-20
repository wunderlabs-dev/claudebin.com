import type * as React from "react";

import { cn } from "@/utils/helpers";

const ContainerSpacingValues = ["none", "sm", "lg"] as const;
type ContainerSpacing = (typeof ContainerSpacingValues)[number];

const containerSpacingClassNames: Record<ContainerSpacing, string> = {
  none: "pt-0",
  sm: "pt-24",
  lg: "pt-48",
};

type ContainerProps<T extends React.ElementType = "div"> = {
  as?: T;
  spacing?: ContainerSpacing;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

const Container = <T extends React.ElementType = "div">({
  as,
  spacing = "none",
  className,
  children,
  ...props
}: ContainerProps<T>) => {
  const Component = as || "div";

  return (
    <Component
      data-slot="container"
      className={cn("mx-auto w-full max-w-container", containerSpacingClassNames[spacing], className)}
      {...props}
    >
      {children}
    </Component>
  );
};

export { Container };
