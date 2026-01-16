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
