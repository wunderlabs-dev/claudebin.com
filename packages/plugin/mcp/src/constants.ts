// Time constants
export const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1_000; // 5 minutes
export const DEFAULT_TOKEN_TTL_MS = 60 * 60 * 1_000; // 1 hour
export const AUTH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1_000; // 30 days
export const POLL_INTERVAL_MS = 2_000; // 2 seconds
export const AUTH_POLL_TIMEOUT_MS = 60_000; // 1 minute
export const SESSION_POLL_TIMEOUT_MS = 120_000; // 2 minutes

// Size limits
export const MAX_SESSION_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

// Poll status values (matches server-side enums)
export const PollStatus = {
  SUCCESS: "success",
  EXPIRED: "expired",
} as const;

export const SessionStatus = {
  PROCESSING: "processing",
  READY: "ready",
  FAILED: "failed",
} as const;
