"use client";

import type * as React from "react";
import { createContext, useContext } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import type { Role } from "@/supabase/types/message";

import { cn } from "@/utils/helpers";

const ChatItemContext = createContext<Role>("assistant");

type ChatProps = React.ComponentProps<"div">;

const Chat = ({ className, ...props }: ChatProps) => {
  return <div data-slot="chat" className={cn("flex flex-col gap-8", className)} {...props} />;
};

const chatItemVariants = cva(["flex items-start gap-4"], {
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
    <ChatItemContext.Provider value={variant || "assistant"}>
      <div
        data-slot="chat-item"
        className={cn(chatItemVariants({ variant, className }))}
        {...props}
      />
    </ChatItemContext.Provider>
  );
};

const chatContentVariants = cva(
  ["flex max-w-3/4 flex-col gap-4 rounded-xl border border-gray-250 px-4 py-3"],
  {
    variants: {
      variant: {
        user: "rounded-tr-none bg-gray-200",
        assistant: "w-3/4 rounded-tl-none",
      },
    },
    defaultVariants: {
      variant: "user",
    },
  },
);

type ChatContentProps = React.ComponentProps<"article">;

const ChatContent = ({ className, ...props }: ChatContentProps) => {
  const variant = useContext(ChatItemContext);

  return (
    <article
      data-slot="chat-content"
      data-variant={variant}
      className={cn(chatContentVariants({ variant, className }))}
      {...props}
    />
  );
};

const useChatItemRole = () => useContext(ChatItemContext);

export { Chat, ChatItem, ChatContent, useChatItemRole };
