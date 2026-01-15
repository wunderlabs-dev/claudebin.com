import { readConfig, writeConfig } from "./config.js";
import { createApiClient } from "./trpc.js";

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
