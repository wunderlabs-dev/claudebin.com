export const AVATAR_FALLBACK_DELAY_MS = 0;
export const AVATAR_ASSISTANT_IMAGE_SRC = "/images/assistant-640x640.png";

export const THREAD_SNIPPET_TEXTAREA_ROWS = 4;
export const THREAD_ATTACHMENT_SIZE = 200;
export const THREAD_TITLE_TRUNCATE_LENGTH = 56;
export const THREAD_GRID_TITLE_TRUNCATE_LENGTH = 36;
export const THREADS_PAGE_SIZE = 20;
export const THREADS_PAGE_INITIAL = 0;

export const USER_PROFILE_THREADS_LIMIT = 20;

export const SESSION_ID_LENGTH = 10;
export const SESSION_MAX_SIZE_BYTES = 50 * 1024 * 1024;

export const AUTH_TOKEN_LENGTH = 21;
export const AUTH_SESSION_TIMEOUT_MS = 10 * 60 * 1000;

export const COPY_RESET_MS = 3000;
export const QUERY_STALE_TIME_MS = 60 * 1000;
export const SEARCH_DEBOUNCE_MS = 300;

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://claudebin.com";
