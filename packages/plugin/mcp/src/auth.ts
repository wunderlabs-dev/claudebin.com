import { exec } from "node:child_process";
import { readConfig, writeConfig } from "./config.js";
import { createApiClient } from "./trpc.js";
import type { Config } from "./types.js";

// Time constants
export const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1_000; // 5 minutes
export const DEFAULT_TOKEN_TTL_MS = 60 * 60 * 1_000; // 1 hour
export const AUTH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1_000; // 30 days
export const POLL_INTERVAL_MS = 2_000; // 2 seconds
export const AUTH_POLL_TIMEOUT_MS = 60_000; // 1 minute
export const SESSION_POLL_TIMEOUT_MS = 120_000; // 2 minutes

export interface AuthStartResult {
  success: true;
  code: string;
  url: string;
}

export interface AuthStartError {
  success: false;
  error: string;
}

// Matches PollStatus from @claudebin/web/trpc/routers/auth
const PollStatus = {
  SUCCESS: "success",
  EXPIRED: "expired",
} as const;

type AuthPollResult =
  | {
      success: true;
      token: string;
      refresh_token: string;
      user: {
        id: string;
        name: string | null;
        email: string | null;
        avatar_url: string | null;
      };
    }
  | { success: false; error: string };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const openUrl = (url: string) => {
  const platform = process.platform;
  const cmd =
    platform === "darwin"
      ? "open"
      : platform === "win32"
        ? "start"
        : "xdg-open";
  exec(`${cmd} "${url}"`);
};

const pollForAuthCompletion = async (
  code: string,
  apiUrl: string,
  timeoutMs = AUTH_POLL_TIMEOUT_MS,
): Promise<AuthPollResult> => {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const url = `${apiUrl}/api/trpc/auth.poll?input=${encodeURIComponent(JSON.stringify({ code }))}`;
      const res = await fetch(url);
      const json = await res.json();
      const result = json.result?.data;

      if (result?.status === PollStatus.SUCCESS) {
        return {
          success: true,
          token: result.token,
          refresh_token: result.refresh_token,
          user: result.user,
        };
      }

      if (result?.status === PollStatus.EXPIRED) {
        return { success: false, error: "Authentication code expired" };
      }
    } catch {
      // Network error, continue polling
    }

    await sleep(POLL_INTERVAL_MS);
  }

  return { success: false, error: "Authentication timed out" };
};

export const startAuth = async (): Promise<
  AuthStartResult | AuthStartError
> => {
  const api = createApiClient();

  try {
    const data = await api.auth.start.mutate();
    return {
      success: true,
      code: data.code,
      url: data.url,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to connect to Claudebin: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

/**
 * Run the full authentication flow: start -> open browser -> poll -> save config
 * Returns the token on success, or an error message on failure
 */
export const runAuthFlow = async (): Promise<
  { success: true; token: string } | { success: false; error: string }
> => {
  const apiUrl = process.env.CLAUDEBIN_API_URL || "http://localhost:3000";

  // Start auth session
  const startResult = await startAuth();

  if (!startResult.success) {
    return { success: false, error: startResult.error };
  }

  // Open browser
  openUrl(startResult.url);

  // Poll for completion
  const pollResult = await pollForAuthCompletion(startResult.code, apiUrl);

  if (!pollResult.success) {
    return { success: false, error: pollResult.error };
  }

  // Save config
  const config: Config = {
    auth: {
      token: pollResult.token,
      refresh_token: pollResult.refresh_token,
      expires_at: Date.now() + AUTH_TOKEN_TTL_MS,
    },
    user: pollResult.user,
  };
  await writeConfig(config);

  return { success: true, token: pollResult.token };
};

export const refreshAuth = async (): Promise<boolean> => {
  const config = await readConfig();

  if (!config.auth?.refresh_token) return false;

  const api = createApiClient();

  try {
    const result = await api.auth.refresh.mutate({
      refresh_token: config.auth.refresh_token,
    });

    if (!result.success) {
      return false;
    }

    await writeConfig({
      ...config,
      auth: {
        token: result.access_token,
        refresh_token: result.refresh_token,
        expires_at: result.expires_at
          ? result.expires_at * 1_000
          : Date.now() + DEFAULT_TOKEN_TTL_MS,
      },
    });

    return true;
  } catch {
    return false;
  }
};

export const getValidToken = async (): Promise<string | null> => {
  const config = await readConfig();

  if (!config.auth?.token) {
    return null;
  }

  if (
    !config.auth.expires_at ||
    Date.now() > config.auth.expires_at - TOKEN_REFRESH_BUFFER_MS
  ) {
    const refreshed = await refreshAuth();
    if (!refreshed) {
      return null;
    }
    const refreshedConfig = await readConfig();
    return refreshedConfig.auth?.token ?? null;
  }

  return config.auth.token;
};
