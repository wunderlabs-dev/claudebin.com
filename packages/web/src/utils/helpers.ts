import { type ClassValue, clsx } from "clsx";
import { concat, init, isNil, last, reduce } from "ramda";
import { twMerge } from "tailwind-merge";

import { MessageRole } from "@/supabase/types/message";
import type { Message } from "@/supabase/repos/messages";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const hashString = (str: string): number => {
  return Math.abs(
    Array.from(str).reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0),
  );
};

export const getProjectName = (workingDir: string | null) => {
  if (isNil(workingDir)) {
    return null;
  }
  return last(workingDir.split("/"));
};

export const formatModelName = (modelName: string | null): string => {
  if (!modelName) return "Claude";
  // "claude-opus-4-5-20251101" -> "claude-opus-4.5"
  return modelName.replace(/-\d{8}$/, "").replace(/-(\d+)-(\d+)$/, "-$1.$2");
};

export const compactConversation = (messages: ReadonlyArray<Message> = []): Message[] =>
  reduce<Message, Message[]>(
    (accumulator, message) => {
      const previous = last(accumulator);
      const isConsecutiveAssistant =
        previous?.role === MessageRole.ASSISTANT && message.role === MessageRole.ASSISTANT;

      return isConsecutiveAssistant
        ? concat(init(accumulator), [
            { ...previous, content: concat(previous.content, message.content) },
          ])
        : concat(accumulator, [{ ...message }]);
    },
    [],
    [...messages],
  );
