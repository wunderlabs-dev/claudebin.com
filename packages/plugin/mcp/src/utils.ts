import { exec } from "node:child_process";

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const poll = async <T>(options: {
  fn: () => Promise<T | null>;
  isSuccess: (result: T) => boolean;
  isFailure?: (result: T) => boolean;
  getFailureError?: (result: T) => string;
  intervalMs: number;
  timeoutMs: number;
  timeoutError: string;
}): Promise<T> => {
  const { fn, isSuccess, isFailure, getFailureError, intervalMs, timeoutMs, timeoutError } =
    options;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const result = await fn();

      if (result !== null) {
        if (isSuccess(result)) {
          return result;
        }

        if (isFailure?.(result)) {
          throw new Error(getFailureError?.(result) ?? "Polling failed");
        }
      }
    } catch (error) {
      if (error instanceof Error && error.message !== "Polling failed") {
      } else {
        throw error;
      }
    }

    await sleep(intervalMs);
  }

  throw new Error(timeoutError);
};

export const safeOpenUrl = (url: string): void => {
  const platform = process.platform;

  try {
    new URL(url);
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }

  if (platform === "darwin") {
    exec(`open "${url.replace(/"/g, '\\"')}"`);
  } else if (platform === "win32") {
    exec(`start "" "${url.replace(/"/g, '\\"')}"`);
  } else {
    exec(`xdg-open "${url.replace(/"/g, '\\"')}"`);
  }
};
