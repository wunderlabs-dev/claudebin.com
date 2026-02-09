import { createApiClient } from "./api.js";
import { readConfig, writeConfig } from "./config.js";
import {
  AUTH_POLL_TIMEOUT_MS,
  AUTH_TOKEN_TTL_MS,
  DEFAULT_TOKEN_TTL_MS,
  POLL_INTERVAL_MS,
  PollStatus,
  TOKEN_REFRESH_BUFFER_MS,
} from "./constants.js";
import type { Config, UserConfig } from "./types.js";
import { poll, safeOpenUrl } from "./utils.js";

interface AuthPollData {
  status: string;
  token?: string;
  refresh_token?: string;
  user?: UserConfig;
}

const pollForAuthCompletion = async (
  code: string,
  timeoutMs = AUTH_POLL_TIMEOUT_MS,
): Promise<{ token: string; refresh_token: string; user: UserConfig }> => {
  const api = createApiClient();

  const result = await poll<AuthPollData>({
    fn: async () => {
      const data = await api.auth.poll(code);
      return data as AuthPollData;
    },
    isSuccess: (data) =>
      data.status === PollStatus.SUCCESS &&
      data.token !== undefined &&
      data.refresh_token !== undefined &&
      data.user !== undefined,
    isFailure: (data) => data.status === "expired",
    getFailureError: () => "Authentication code expired",
    intervalMs: POLL_INTERVAL_MS,
    timeoutMs,
    timeoutError: "Authentication timed out",
  });

  const { token, refresh_token, user } = result;

  if (!token || !refresh_token || !user) {
    throw new Error("Invalid authentication response");
  }

  return { token, refresh_token, user };
};

const start = async (): Promise<{ code: string; url: string }> => {
  const api = createApiClient();

  try {
    const data = await api.auth.start();
    return { code: data.code, url: data.url };
  } catch (error) {
    throw new Error(
      `Failed to connect to Claudebin: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

const run = async (): Promise<string> => {
  const { code, url } = await start();
  safeOpenUrl(url);

  const { token, refresh_token, user } = await pollForAuthCompletion(code);

  const config: Config = {
    auth: {
      token,
      refresh_token,
      expires_at: Date.now() + AUTH_TOKEN_TTL_MS,
    },
    user,
  };
  await writeConfig(config);

  return token;
};

const refresh = async (): Promise<boolean> => {
  const config = await readConfig();

  if (!config.auth?.refresh_token) return false;

  const api = createApiClient();

  try {
    const result = await api.auth.refresh({
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

const getLocalToken = async (): Promise<string | null> => {
  const config = await readConfig();

  if (!config.auth?.token) {
    return null;
  }

  if (!config.auth.expires_at || Date.now() > config.auth.expires_at - TOKEN_REFRESH_BUFFER_MS) {
    const refreshed = await refresh();
    if (!refreshed) {
      return null;
    }
    const refreshedConfig = await readConfig();
    return refreshedConfig.auth?.token ?? null;
  }

  return config.auth.token;
};

const validate = async (token: string): Promise<boolean> => {
  const api = createApiClient();

  try {
    const result = await api.auth.validate(token);
    return result.valid;
  } catch {
    return false;
  }
};

const getToken = async (): Promise<string> => {
  const localToken = await getLocalToken();

  if (localToken) {
    const isValid = await validate(localToken);
    if (isValid) {
      return localToken;
    }
  }

  return run();
};

export const auth = { run, validate, getToken, refresh };
