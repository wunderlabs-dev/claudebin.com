import type { User } from "./api.js";

// Re-export User as UserConfig for backward compatibility
export type UserConfig = User;

export type AuthConfig = {
  token: string;
  refresh_token?: string;
  expires_at: number;
};

export type Config = {
  auth?: AuthConfig;
  user?: UserConfig;
};

export type FileWithStats = {
  file: string;
  mtime: Date;
};
