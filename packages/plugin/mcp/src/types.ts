// Generic result type for consistent error handling
// Uses flat pattern: properties spread at top level for ergonomic access
export type Result<T, E = string> =
  | ({ success: true } & T)
  | { success: false; error: E };

// User config stored in ~/.claudebin/config.json
export interface UserConfig {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
}

export interface AuthConfig {
  token: string;
  refresh_token?: string;
  expires_at: number;
}

export interface Config {
  auth?: AuthConfig;
  user?: UserConfig;
}

// Session types
export interface FileWithStats {
  file: string;
  mtime: Date;
}

// Session extraction result
export type ExtractResult = Result<{ content: string }>;

// Polling result types
export type SessionPollResult = Result<{ url: string }>;

export type AuthPollResult = Result<{
  token: string;
  refresh_token: string;
  user: UserConfig;
}>;
