export type UserConfig = {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
};

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
