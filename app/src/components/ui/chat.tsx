"use client";

import { forwardRef, createContext, useContext, type ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import type { Role } from "@/supabase/types/message";

import { cn } from "@/utils/helpers";

const ChatItemContext = createContext<Role>("assistant");

type ChatProps = ComponentProps<"div">;

const Chat = ({ className, ...props }: ChatProps) => {
  return <div data-slot="chat" className={cn("flex flex-col", className)} {...props} />;
};

const chatItemVariants = cva(["flex items-start gap-4 pb-8 transition-all ease-out"], {
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

type ChatItemProps = ComponentProps<"div"> & VariantProps<typeof chatItemVariants>;

const ChatItem = forwardRef<HTMLDivElement, ChatItemProps>(
  ({ className, variant = "assistant", ...props }, ref) => {
    return (
      <ChatItemContext.Provider value={variant || "assistant"}>
        <div
          ref={ref}
          data-slot="chat-item"
          className={cn(chatItemVariants({ variant, className }))}
          {...props}
        />
      </ChatItemContext.Provider>
    );
  },
);

const chatContentVariants = cva(
  ["flex flex-col min-w-0 gap-4 px-4 py-3 border border-gray-250 rounded-xl"],
  {
    variants: {
      variant: {
        user: "max-w-3/4 bg-gray-200 rounded-tr-none",
        assistant: "w-full md:max-w-3/4 rounded-tl-none",
      },
    },
    defaultVariants: {
      variant: "user",
    },
  },
);

type ChatContentProps = ComponentProps<"article">;

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
