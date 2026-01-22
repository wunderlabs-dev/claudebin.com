import { getApiBaseUrl, readConfig, writeConfig } from "./config.js";
import {
  AUTH_POLL_TIMEOUT_MS,
  AUTH_TOKEN_TTL_MS,
  DEFAULT_TOKEN_TTL_MS,
  POLL_INTERVAL_MS,
  PollStatus,
  TOKEN_REFRESH_BUFFER_MS,
} from "./constants.js";
import { createApiClient } from "./trpc.js";
import type { AuthPollResult, Config } from "./types.js";
import { poll, safeOpenUrl } from "./utils.js";

export interface AuthStartResult {
  success: true;
  code: string;
  url: string;
}

export interface AuthStartError {
  success: false;
  error: string;
}

interface AuthPollData {
  status: string;
  token?: string;
  refresh_token?: string;
  user?: {
    id: string;
    name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
}

const fetchAuthPollData = async (code: string, apiUrl: string): Promise<AuthPollData | null> => {
  const url = `${apiUrl}/api/trpc/auth.poll?input=${encodeURIComponent(JSON.stringify({ code }))}`;
  const res = await fetch(url);
  const json = await res.json();
  return json.result?.data ?? null;
};

const pollForAuthCompletion = async (
  code: string,
  apiUrl: string,
  timeoutMs = AUTH_POLL_TIMEOUT_MS,
): Promise<AuthPollResult> => {
  const result = await poll<AuthPollData>({
    fn: () => fetchAuthPollData(code, apiUrl),
    isSuccess: (data) =>
      data.status === PollStatus.SUCCESS &&
      data.token !== undefined &&
      data.refresh_token !== undefined &&
      data.user !== undefined,
    isFailure: (data) => data.status === PollStatus.EXPIRED,
    getFailureError: () => "Authentication code expired",
    intervalMs: POLL_INTERVAL_MS,
    timeoutMs,
    timeoutError: "Authentication timed out",
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  const { token, refresh_token, user } = result.result;

  // These are guaranteed by isSuccess check, but TypeScript can't infer that
  if (!token || !refresh_token || !user) {
    return { success: false, error: "Invalid authentication response" };
  }

  return {
    success: true,
    token,
    refresh_token,
    user,
  };
};

export const startAuth = async (): Promise<AuthStartResult | AuthStartError> => {
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
  const apiUrl = getApiBaseUrl();

  // Start auth session
  const startResult = await startAuth();

  if (!startResult.success) {
    return { success: false, error: startResult.error };
  }

  // Open browser
  safeOpenUrl(startResult.url);

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

    if (!result.success || !("access_token" in result)) {
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

  if (!config.auth.expires_at || Date.now() > config.auth.expires_at - TOKEN_REFRESH_BUFFER_MS) {
    const refreshed = await refreshAuth();
    if (!refreshed) {
      return null;
    }
    const refreshedConfig = await readConfig();
    return refreshedConfig.auth?.token ?? null;
  }

  return config.auth.token;
};
