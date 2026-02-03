export const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1_000;
export const DEFAULT_TOKEN_TTL_MS = 60 * 60 * 1_000;
export const AUTH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1_000;
export const POLL_INTERVAL_MS = 2_000;
export const AUTH_POLL_TIMEOUT_MS = 5 * 60_000;
export const SESSION_POLL_TIMEOUT_MS = 120_000;

export const MAX_SESSION_SIZE_BYTES = 50 * 1024 * 1024;

export const PollStatus = {
  SUCCESS: "success",
  EXPIRED: "expired",
} as const;

export const SessionStatus = {
  PROCESSING: "processing",
  READY: "ready",
  FAILED: "failed",
} as const;
