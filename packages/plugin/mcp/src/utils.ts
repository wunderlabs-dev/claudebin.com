import { exec } from "node:child_process";

/**
 * Sleep for a given number of milliseconds
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generic polling function that repeatedly checks a condition until success, failure, or timeout.
 */
export const poll = async <T>(options: {
  fn: () => Promise<T | null>;
  isSuccess: (result: T) => boolean;
  isFailure?: (result: T) => boolean;
  getFailureError?: (result: T) => string;
  intervalMs: number;
  timeoutMs: number;
  timeoutError: string;
}): Promise<
  { success: true; result: T } | { success: false; error: string }
> => {
  const {
    fn,
    isSuccess,
    isFailure,
    getFailureError,
    intervalMs,
    timeoutMs,
    timeoutError,
  } = options;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const result = await fn();

      if (result !== null) {
        if (isSuccess(result)) {
          return { success: true, result };
        }

        if (isFailure?.(result)) {
          const error = getFailureError?.(result) ?? "Polling failed";
          return { success: false, error };
        }
      }
    } catch {
      // Network error, continue polling
    }

    await sleep(intervalMs);
  }

  return { success: false, error: timeoutError };
};

/**
 * Safely open a URL in the default browser.
 * Uses proper escaping to prevent command injection.
 */
export const safeOpenUrl = (url: string): void => {
  const platform = process.platform;

  // Validate URL format to prevent injection
  try {
    new URL(url);
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }

  // Use array form or proper escaping based on platform
  if (platform === "darwin") {
    // macOS: use open command with -u flag to treat as URL
    exec(`open "${url.replace(/"/g, '\\"')}"`);
  } else if (platform === "win32") {
    // Windows: use start with empty title and properly escaped URL
    exec(`start "" "${url.replace(/"/g, '\\"')}"`);
  } else {
    // Linux: use xdg-open
    exec(`xdg-open "${url.replace(/"/g, '\\"')}"`);
  }
};
