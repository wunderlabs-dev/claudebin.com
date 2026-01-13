import { getApiBaseUrl } from "./config.js";
import {
  AuthPollResponseSchema,
  AuthStartResponseSchema,
  type AuthPollResponse,
} from "./schemas.js";

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

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

export const startAuth = async (): Promise<AuthStartResult | AuthStartError> => {
  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/api/auth/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to start authentication: ${response.statusText}`,
      };
    }

    const data = AuthStartResponseSchema.parse(await response.json());
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
  | { status: "success"; token: string; user: AuthPollResponse & { status: "success" } extends { user: infer U } ? U : never }
  | { status: "expired" }
  | { status: "timeout" };

const pollOnce = async (
  baseUrl: string,
  code: string,
): Promise<PollResult | null> => {
  try {
    const response = await fetch(`${baseUrl}/api/auth/poll?code=${code}`);

    if (!response.ok) {
      return null;
    }

    const result = AuthPollResponseSchema.parse(await response.json());

    if (result.status === "pending") {
      return null;
    }

    if (result.status === "expired") {
      return { status: "expired" };
    }

    if (result.status === "success") {
      return {
        status: "success",
        token: result.token,
        user: result.user,
      };
    }

    return null;
  } catch {
    return null;
  }
};

export const pollForAuth = async (
  code: string,
  deadline = Date.now() + POLL_TIMEOUT_MS,
): Promise<PollResult> => {
  if (Date.now() >= deadline) {
    return { status: "timeout" };
  }

  await sleep(POLL_INTERVAL_MS);

  const result = await pollOnce(getApiBaseUrl(), code);

  if (result) {
    return result;
  }

  return pollForAuth(code, deadline);
};
