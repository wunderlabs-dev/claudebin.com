// UI constants
export type Spacing = "none" | "sm" | "md" | "lg";

export const spacingClassNames: Record<Spacing, string> = {
  none: "pt-0",
  sm: "pt-9",
  md: "pt-24",
  lg: "pt-48",
} as const;

export const THREAD_CARD_LAYOUTS = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
] as const;

// Size limits
export const MAX_SESSION_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
export const THREAD_TITLE_TRUNCATE_LENGTH = 56;

// ID lengths for nanoid
export const SESSION_ID_LENGTH = 10;
export const AUTH_TOKEN_LENGTH = 21;

// Timeouts
export const AUTH_SESSION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
