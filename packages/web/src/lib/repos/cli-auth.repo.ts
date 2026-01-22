import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type CliAuthRow = Database["public"]["Tables"]["cli_auth_sessions"]["Row"];
type CliAuthInsert = Database["public"]["Tables"]["cli_auth_sessions"]["Insert"];
type CliAuthUpdate = Database["public"]["Tables"]["cli_auth_sessions"]["Update"];
type ProfilesRow = Database["public"]["Tables"]["profiles"]["Row"];

export type CliAuthSession = CliAuthRow;

const create = async (
  supabase: SupabaseClient<Database>,
  session: CliAuthInsert,
): Promise<void> => {
  const { error } = await supabase.from("cli_auth_sessions").insert(session);

  if (error) {
    console.error("Failed to create auth session:", error);
    throw new Error("Failed to create auth session");
  }
};

const getByToken = async (
  supabase: SupabaseClient<Database>,
  sessionToken: string,
): Promise<(CliAuthSession & { profile: ProfilesRow | null }) | null> => {
  const { data, error } = await supabase
    .from("cli_auth_sessions")
    .select("*, profiles(*)")
    .eq("sessionToken", sessionToken)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch auth session: ${error.message}`);
  }

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
  const { error } = await supabase
    .from("cli_auth_sessions")
    .update(updates)
    .eq("sessionToken", sessionToken);

  if (error) {
    console.error("Failed to complete auth session:", error);
    throw new Error("Failed to complete auth session");
  }
};

export const cliAuth = { create, getByToken, complete };
