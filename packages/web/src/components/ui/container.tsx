import type * as React from "react";

import { cn } from "@/utils/helpers";

type ContainerProps = React.ComponentProps<"div">;

const Container = ({ className, children, ...props }: ContainerProps) => {
  return (
    <div
      data-slot="container"
      className={cn("mx-auto w-full max-w-1440 px-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export { Container };
