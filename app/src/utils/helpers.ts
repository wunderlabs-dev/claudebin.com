import { type ClassValue, clsx } from "clsx";
import { concat, head, init, isNil, last, reduce } from "ramda";
import { twMerge } from "tailwind-merge";

import { MessageRole } from "@/supabase/types/message";
import type { Message } from "@/server/repos/messages";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const isIndexWithin = (index: number, from: number, to: number) => {
  return index >= Math.min(from, to) && index <= Math.max(from, to);
};

export const getAvatarChar = (username?: string | null) => {
  if (username) {
    return head(username);
  }
  return "?";
};

export const getProjectName = (workingDir: string | null) => {
  if (isNil(workingDir)) {
    return null;
  }
  return last(workingDir.split("/"));
};

export const compactConversation = (messages: ReadonlyArray<Message> = []): Message[] =>
  reduce<Message, Message[]>(
    (accumulator, message) => {
      const previous = last(accumulator);
      const isAssistant =
        previous?.role === MessageRole.ASSISTANT && message.role === MessageRole.ASSISTANT;

      if (isAssistant) {
        return concat(init(accumulator), [
          { ...previous, idx: message.idx, content: concat(previous.content, message.content) },
        ]);
      }
      return concat(accumulator, [{ ...message }]);
    },
    [],
    [...messages],
  );
