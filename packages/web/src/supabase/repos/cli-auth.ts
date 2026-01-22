import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/supabase/types";

type CliAuthRow = Database["public"]["Tables"]["cli_auth_sessions"]["Row"];
type CliAuthInsert = Database["public"]["Tables"]["cli_auth_sessions"]["Insert"];
type CliAuthUpdate = Database["public"]["Tables"]["cli_auth_sessions"]["Update"];
type ProfilesRow = Database["public"]["Tables"]["profiles"]["Row"];

export type CliAuthSession = CliAuthRow;

const create = async (
  supabase: SupabaseClient<Database>,
  session: CliAuthInsert,
): Promise<void> => {
  console.log("[cliAuth.create] Inserting session:", session.sessionToken);
  const { error } = await supabase.from("cli_auth_sessions").insert(session);

  if (error) {
    console.error("[cliAuth.create] Supabase error:", error);
    throw new Error("Failed to create auth session");
  }
  console.log("[cliAuth.create] Success");
};

const getByToken = async (
  supabase: SupabaseClient<Database>,
  sessionToken: string,
): Promise<(CliAuthSession & { profile: ProfilesRow | null }) | null> => {
  console.log("[cliAuth.getByToken] Fetching session:", sessionToken);
  const { data, error } = await supabase
    .from("cli_auth_sessions")
    .select("*, profiles(*)")
    .eq("sessionToken", sessionToken)
    .maybeSingle();

  if (error) {
    console.error("[cliAuth.getByToken] Supabase error:", error);
    throw new Error(`Failed to fetch auth session: ${error.message}`);
  }

  console.log("[cliAuth.getByToken] Result:", data ? "found" : "not found");
  if (!data) return null;

  return {
    ...data,
    profile: data.profiles as ProfilesRow | null,
  };
};

const complete = async (
  supabase: SupabaseClient<Database>,
  sessionToken: string,
  updates: CliAuthUpdate,
): Promise<void> => {
  console.log("[cliAuth.complete] Completing session:", sessionToken);
  const { error } = await supabase
    .from("cli_auth_sessions")
    .update(updates)
    .eq("sessionToken", sessionToken);

  if (error) {
    console.error("[cliAuth.complete] Supabase error:", error);
    throw new Error("Failed to complete auth session");
  }
  console.log("[cliAuth.complete] Success");
};

export const cliAuth = { create, getByToken, complete };
