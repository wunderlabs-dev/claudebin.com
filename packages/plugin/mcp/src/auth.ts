import { PollStatus } from "@claudebin/web/trpc/routers/auth.js";
import { readConfig, writeConfig } from "./config.js";
import { createApiClient } from "./trpc.js";

const POLL_INTERVAL_MS = 2_000;
const POLL_TIMEOUT_MS = 5 * 60 * 1_000;
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1_000;
const DEFAULT_TOKEN_TTL_MS = 60 * 60 * 1_000;

// Extends server PollStatus with client-only timeout
export const PollResultStatus = {
  ...PollStatus,
  TIMEOUT: "timeout",
} as const;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

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

export type PollResult =
  | {
      status: typeof PollResultStatus.SUCCESS;
      token: string;
      refresh_token: string;
      user: { id: string; username: string; avatar_url: string };
    }
  | { status: typeof PollResultStatus.EXPIRED }
  | { status: typeof PollResultStatus.TIMEOUT };

const pollOnce = async (
  api: ReturnType<typeof createApiClient>,
  code: string,
): Promise<PollResult | null> => {
  try {
    const result = await api.auth.poll.query({ code });

    if (result.status === PollStatus.PENDING) {
      return null;
    }

    return result;
  } catch {
    return null;
  }
};

export const pollForAuth = async (
  code: string,
  deadline = Date.now() + POLL_TIMEOUT_MS,
  api = createApiClient(),
): Promise<PollResult> => {
  if (Date.now() >= deadline) {
    return { status: PollResultStatus.TIMEOUT };
  }

  await sleep(POLL_INTERVAL_MS);

  const result = await pollOnce(api, code);

  if (result) {
    return result;
  }

  return pollForAuth(code, deadline, api);
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
