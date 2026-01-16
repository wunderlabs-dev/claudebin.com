// packages/web/lib/repos/cli-auth.repo.ts
import { createServiceClient } from "@/lib/supabase/service";
import type { CliAuthSession, Profile } from "@/lib/types/domain";

const mapRowToCliAuthSession = (row: {
  id: string;
  session_token: string;
  user_id: string | null;
  access_token: string | null;
  refresh_token: string | null;
  expires_at: string | null;
  completed_at: string | null;
}): CliAuthSession => ({
  id: row.id,
  sessionToken: row.session_token,
  userId: row.user_id,
  accessToken: row.access_token,
  refreshToken: row.refresh_token,
  expiresAt: row.expires_at ? new Date(row.expires_at) : null,
  completedAt: row.completed_at ? new Date(row.completed_at) : null,
});

export const createCliAuthSession = async (
  sessionToken: string,
  expiresAt: Date,
): Promise<void> => {
  const supabase = createServiceClient();
  const { error } = await supabase.from("cli_auth_sessions").insert({
    session_token: sessionToken,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    console.error("Failed to create auth session:", error);
    throw new Error("Failed to create auth session");
  }
};

export const getCliAuthSessionByToken = async (
  sessionToken: string,
): Promise<(CliAuthSession & { profile: Profile | null }) | null> => {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("cli_auth_sessions")
    .select("*, profiles(*)")
    .eq("session_token", sessionToken)
    .single();

  if (error || !data) return null;

  const profile = data.profiles as {
    id: string;
    email: string | null;
    name: string | null;
    avatar_url: string | null;
  } | null;

  return {
    ...mapRowToCliAuthSession(data),
    profile: profile
      ? {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          avatarUrl: profile.avatar_url,
        }
      : null,
  };
};

export const completeCliAuthSession = async (
  sessionToken: string,
  userId: string,
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("cli_auth_sessions")
    .update({
      user_id: userId,
      access_token: accessToken,
      refresh_token: refreshToken,
      completed_at: new Date().toISOString(),
    })
    .eq("session_token", sessionToken);

  if (error) {
    console.error("Failed to complete auth session:", error);
    throw new Error("Failed to complete auth session");
  }
};
