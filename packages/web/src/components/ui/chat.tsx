import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/helpers";

type ChatProps = React.ComponentProps<"div">;

const Chat = ({ className, ...props }: ChatProps) => {
  return <div data-slot="chat" className={cn("flex flex-col gap-8", className)} {...props} />;
};

const chatItemVariants = cva(["flex items-start gap-3"], {
  variants: {
    variant: {
      user: "justify-end",
      assistant: "justify-start",
    },
  },
  defaultVariants: {
    variant: "assistant",
  },
});

type ChatItemProps = React.ComponentProps<"div"> & VariantProps<typeof chatItemVariants>;

const ChatItem = ({ className, variant = "assistant", ...props }: ChatItemProps) => {
  return (
    <div
      data-slot="chat-item"
      className={cn(chatItemVariants({ variant, className }))}
      {...props}
    />
  );
};

const chatContentVariants = cva(["max-w-3/4 rounded-xl border border-gray-250 px-4 py-3"], {
  variants: {
    variant: {
      user: "rounded-tr-none bg-gray-200",
      assistant: "rounded-tl-none",
    },
  },
  defaultVariants: {
    variant: "user",
  },
});

type ChatContentProps = React.ComponentProps<"article"> & VariantProps<typeof chatContentVariants>;

const ChatContent = ({ className, variant = "user", ...props }: ChatContentProps) => {
  return (
    <article
      data-slot="chat-content"
      data-variant={variant}
      className={cn(chatContentVariants({ variant, className }))}
      {...props}
    />
  );
};

export { Chat, ChatItem, ChatContent };
