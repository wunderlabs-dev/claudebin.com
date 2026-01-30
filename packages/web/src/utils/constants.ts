export type Spacing = "none" | "sm" | "md" | "lg";

export const spacingClassNames: Record<Spacing, string> = {
  none: "pt-0",
  sm: "pt-9",
  md: "pt-18 xl:pt-24",
  lg: "pt-32 xl:pt-48",
} as const;

export const AVATAR_FALLBACK_DELAY_MS = 0;
export const AVATAR_ASSISTANT_IMAGE_SRC = "/images/assistant.jpg";

export const THREAD_TITLE_TRUNCATE_LENGTH = 56;
export const THREAD_GRID_TITLE_TRUNCATE_LENGTH = 36;
export const THREAD_CARD_LAYOUTS = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
] as const;

export const SESSION_ID_LENGTH = 10;
export const SESSION_MAX_SIZE_BYTES = 50 * 1024 * 1024;

export const AUTH_TOKEN_LENGTH = 21;
export const AUTH_SESSION_TIMEOUT_MS = 10 * 60 * 1000;

export const SEARCH_DEBOUNCE_MS = 300;

export const APP_THREADS_URL = "https://claudebin.com/threads";
