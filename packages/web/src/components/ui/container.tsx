import type * as React from "react";

import { cn } from "@/utils/helpers";
import { spacingClassNames, type Spacing } from "@/utils/spacing";

type ContainerSize = "sm" | "md" | "lg";

const containerSizeClassNames: Record<ContainerSize, string> = {
  sm: "max-w-xl",
  md: "max-w-7xl",
  lg: "max-w-container",
};

type ContainerProps<T extends React.ElementType = "div"> = {
  as?: T;
  size?: ContainerSize;
  spacing?: Spacing;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

const Container = <T extends React.ElementType = "div">({
  as,
  size = "md",
  spacing = "none",
  className,
  children,
  ...props
}: ContainerProps<T>) => {
  const Component = as || "div";

  return (
    <Component
      data-slot="container"
      className={cn(
        "w-full",
        "mx-auto px-4 2xl:px-0",
        containerSizeClassNames[size],
        spacingClassNames[spacing],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export { Container };
