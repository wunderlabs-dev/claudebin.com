import type * as React from "react";

import { cn } from "@/utils/helpers";

type ContainerProps<T extends React.ElementType = "div"> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

const Container = <T extends React.ElementType = "div">({
  as,
  className,
  children,
  ...props
}: ContainerProps<T>) => {
  const Component = as || "div";

  return (
    <Component
      data-slot="container"
      className={cn("mx-auto w-full max-w-container px-4", className)}
      {...props}
    >
      {children}
    </Component>
  );
};

export { Container };
