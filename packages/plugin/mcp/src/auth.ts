import { PollStatus } from "@claudebin/web/trpc/routers/auth.js";
import { createApiClient } from "./trpc.js";

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

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
