import { type ClassValue, clsx } from "clsx";
import { concat, head, init, isNil, isEmpty, last, not, reduce } from "ramda";
import { twMerge } from "tailwind-merge";

import { MessageRole } from "@/supabase/types/message";
import type { Message } from "@/server/repos/messages";

import { THREAD_SAFE_URL_PATTERN } from "@/utils/constants";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const isIndexWithin = (index: number, from: number, to: number) => {
  return index >= Math.min(from, to) && index <= Math.max(from, to);
};

export const getAvatarInitial = (username?: string | null) => {
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

export const stringifyJSON = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }
  return JSON.stringify(value);
};

export const getSafeUrl = (url: string | undefined) => {
  if (isNil(url) || isEmpty(url)) {
    return;
  }

  const trimmed = url.trimStart();

  if (isEmpty(trimmed) || not(THREAD_SAFE_URL_PATTERN.test(trimmed))) {
    return;
  }
  return url;
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
