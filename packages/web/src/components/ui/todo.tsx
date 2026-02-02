import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/helpers";
import { Typography } from "@/components/ui/typography";

type TodoProps = React.ComponentProps<"ul">;

const Todo = ({ className, ...props }: TodoProps) => {
  return <ul data-slot="todo" className={cn("flex flex-col gap-2", className)} {...props} />;
};

const todoItemVariants = cva(["flex items-center gap-2"], {
  variants: {
    variant: {
      pending: "text-gray-600",
      progress: "text-gray-600",
      completed: "text-gray-400 line-through",
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

const todoItemIconVariants = cva(["flex-shrink-0"], {
  variants: {
    variant: {
      pending: "text-gray-400",
      progress: "text-blue-500",
      completed: "text-green-600",
    },
  },
  defaultVariants: {
    variant: "pending",
  },
});

type TodoItemIconProps = React.ComponentProps<"span"> & VariantProps<typeof todoItemIconVariants>;

const TodoItemIcon = ({ className, variant = "pending", ...props }: TodoItemIconProps) => {
  return (
    <span
      data-slot="todo-item-icon"
      className={cn(todoItemIconVariants({ variant, className }))}
      {...props}
    />
  );
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
export type { TodoItemProps };
