import type { components } from "./api.d.js";
import { getApiBaseUrl } from "./config.js";

// Re-export schema types for consumers
export type AuthStartResponse = components["schemas"]["AuthStartResponse"];
export type AuthPollResponse = components["schemas"]["AuthPollResponse"];
export type AuthRefreshInput = components["schemas"]["AuthRefreshInput"];
export type AuthRefreshResponse = components["schemas"]["AuthRefreshResponse"];
export type AuthValidateResponse = components["schemas"]["AuthValidateResponse"];
export type User = components["schemas"]["User"];
export type SessionsPublishInput = components["schemas"]["SessionsPublishInput"];
export type SessionsPublishResponse = components["schemas"]["SessionsPublishResponse"];
export type SessionsPollResponse = components["schemas"]["SessionsPollResponse"];

const fetchJson = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return (await res.json()) as T;
};

export const createApiClient = () => {
  const baseUrl = getApiBaseUrl();

  return {
    auth: {
      start: async (): Promise<AuthStartResponse> => {
        return fetchJson(`${baseUrl}/api/auth/start`, { method: "POST" });
      },
      poll: async (code: string): Promise<AuthPollResponse> => {
        return fetchJson(`${baseUrl}/api/auth/poll?code=${encodeURIComponent(code)}`);
      },
      refresh: async (input: AuthRefreshInput): Promise<AuthRefreshResponse> => {
        return fetchJson(`${baseUrl}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
      },
      validate: async (token: string): Promise<AuthValidateResponse> => {
        return fetchJson(`${baseUrl}/api/auth/validate?token=${encodeURIComponent(token)}`);
      },
    },
    sessions: {
      publish: async (input: SessionsPublishInput): Promise<SessionsPublishResponse> => {
        return fetchJson(`${baseUrl}/api/sessions/publish`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
      },
      poll: async (id: string): Promise<SessionsPollResponse> => {
        return fetchJson(`${baseUrl}/api/sessions/poll?id=${encodeURIComponent(id)}`);
      },
    },
  };
};

export type ApiClient = ReturnType<typeof createApiClient>;
