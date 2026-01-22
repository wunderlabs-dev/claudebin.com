import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/helpers";
import { Typography } from "@/components/ui/typography";

type TodoProps = React.ComponentProps<"ul">;

const Todo = ({ className, ...props }: TodoProps) => {
  return <ul data-slot="todo" className={cn("flex flex-col gap-2", className)} {...props} />;
};

const todoItemVariants = cva(["flex items-center gap-1"], {
  variants: {
    variant: {
      pending: "text-white",
      progress: "text-white",
      completed: "text-gray-400",
    },
  },
  defaultVariants: {
    variant: "pending",
  },
});

type TodoItemProps = React.ComponentProps<"li"> & VariantProps<typeof todoItemVariants>;

const TodoItem = ({ className, variant = "pending", ...props }: TodoItemProps) => {
  return (
    <li
      data-slot="todo-item"
      data-variant={variant}
      className={cn(todoItemVariants({ variant, className }))}
      {...props}
    />
  );
};

const TodoItemIcon = ({ className, ...props }: React.ComponentProps<"span">) => {
  return <span data-slot="todo-item-icon" className={cn("flex-shrink-0", className)} {...props} />;
};

type TodoItemLabelProps = {
  className?: string;
  children?: React.ReactNode;
};

const TodoItemLabel = ({ className, children }: TodoItemLabelProps) => {
  return (
    <Typography data-slot="todo-item-label" variant="small" className={className}>
      {children}
    </Typography>
  );
};

export { Todo, TodoItem, TodoItemIcon, TodoItemLabel };
