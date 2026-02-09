import { getApiBaseUrl } from "./config.js";

// Types based on the API schemas
type AuthStartResponse = {
  code: string;
  url: string;
  expires_at: string;
};

type AuthPollResponse =
  | { status: "pending" }
  | { status: "expired" }
  | { status: "success"; token: string; refresh_token: string; user: User };

type User = {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
};

type AuthRefreshInput = { refresh_token: string };
type AuthRefreshResponse =
  | { success: true; access_token: string; refresh_token: string; expires_at?: number }
  | { success: false; error?: string };

type AuthValidateResponse = { valid: boolean };

type SessionsPublishInput = {
  title?: string;
  conversation_data: string;
  is_public: boolean;
  access_token: string;
};

type SessionsPublishResponse = { id: string; status: string };

type SessionsPollResponse =
  | { status: "processing" }
  | { status: "ready"; url: string }
  | { status: "failed"; error: string };

export const createApiClient = () => {
  const baseUrl = getApiBaseUrl();

  return {
    auth: {
      start: async (): Promise<AuthStartResponse> => {
        const res = await fetch(`${baseUrl}/api/auth/start`, { method: "POST" });
        return res.json();
      },
      poll: async (code: string): Promise<AuthPollResponse> => {
        const res = await fetch(`${baseUrl}/api/auth/poll?code=${encodeURIComponent(code)}`);
        return res.json();
      },
      refresh: async (input: AuthRefreshInput): Promise<AuthRefreshResponse> => {
        const res = await fetch(`${baseUrl}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        return res.json();
      },
      validate: async (token: string): Promise<AuthValidateResponse> => {
        const res = await fetch(`${baseUrl}/api/auth/validate?token=${encodeURIComponent(token)}`);
        return res.json();
      },
    },
    sessions: {
      publish: async (input: SessionsPublishInput): Promise<SessionsPublishResponse> => {
        const res = await fetch(`${baseUrl}/api/sessions/publish`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        return res.json();
      },
      poll: async (id: string): Promise<SessionsPollResponse> => {
        const res = await fetch(`${baseUrl}/api/sessions/poll?id=${encodeURIComponent(id)}`);
        return res.json();
      },
    },
  };
};

export type ApiClient = ReturnType<typeof createApiClient>;
