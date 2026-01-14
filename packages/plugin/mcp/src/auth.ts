import { readConfig, writeConfig } from "./config.js";
import { createApiClient } from "./trpc.js";

const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1_000;
const DEFAULT_TOKEN_TTL_MS = 60 * 60 * 1_000;

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

const refreshAuth = async (): Promise<boolean> => {
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
