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

// Session types
export interface FileWithStats {
  file: string;
  mtime: Date;
}
