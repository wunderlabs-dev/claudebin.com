// Minimal type declaration for web's AppRouter
// Declares only the procedures used by the plugin to avoid
// type-checking the entire web package

interface AuthStartResponse {
  code: string;
  url: string;
  expires_at: string;
}

interface AuthRefreshInput {
  refresh_token: string;
}

type AuthRefreshResponse =
  | { success: true; access_token: string; refresh_token: string; expires_at?: number }
  | { success: false; error?: string };

interface AuthValidateInput {
  token: string;
}

interface AuthValidateResponse {
  valid: boolean;
}

interface SessionsPublishInput {
  title?: string;
  conversation_data: string;
  is_public: boolean;
  access_token: string;
}

interface SessionsPublishResponse {
  id: string;
  status: string;
}

export interface AppRouter {
  auth: {
    start: {
      mutate: () => Promise<AuthStartResponse>;
    };
    refresh: {
      mutate: (input: AuthRefreshInput) => Promise<AuthRefreshResponse>;
    };
    validate: {
      query: (input: AuthValidateInput) => Promise<AuthValidateResponse>;
    };
  };
  sessions: {
    publish: {
      mutate: (input: SessionsPublishInput) => Promise<SessionsPublishResponse>;
    };
  };
}
