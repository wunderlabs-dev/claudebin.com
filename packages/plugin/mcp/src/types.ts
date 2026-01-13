// User config stored in ~/.claudebin/config.json
export interface UserConfig {
  id: string;
  username: string;
  avatar_url: string;
}

export interface AuthConfig {
  token: string;
  expires_at: number;
}

export interface Config {
  auth?: AuthConfig;
  user?: UserConfig;
}

// Auth API response types
export interface AuthStartResponse {
  code: string;
  url: string;
  expires_at: string;
}

export interface AuthPollPending {
  status: "pending";
}

export interface AuthPollSuccess {
  status: "success";
  token: string;
  user: UserConfig;
}

export interface AuthPollExpired {
  status: "expired";
}

export type AuthPollResponse = AuthPollPending | AuthPollSuccess | AuthPollExpired;

// Session types
export interface FileWithStats {
  file: string;
  mtime: Date;
}

// MCP tool result type
export interface ToolResult {
  content: { type: "text"; text: string }[];
  isError?: boolean;
}
