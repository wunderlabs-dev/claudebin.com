import type { Tables } from "@/lib/supabase/database.types";
import { createServiceClient } from "@/lib/supabase/service";

export type CliAuthSession = Tables<"cli_auth_sessions">;
type Profile = Tables<"profiles">;

export const createCliAuthSession = async (
  sessionToken: string,
  expiresAt: Date,
): Promise<void> => {
  const supabase = createServiceClient();
  const { error } = await supabase.from("cli_auth_sessions").insert({
    sessionToken,
    expiresAt: expiresAt.toISOString(),
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
    .eq("sessionToken", sessionToken)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    profile: data.profiles as Profile | null,
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
      userId,
      accessToken,
      refreshToken,
      completedAt: new Date().toISOString(),
    })
    .eq("sessionToken", sessionToken);

  if (error) {
    console.error("Failed to complete auth session:", error);
    throw new Error("Failed to complete auth session");
  }
};
