import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type ProfilesRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfilesInsert = Database["public"]["Tables"]["profiles"]["Insert"];

export type Profile = ProfilesRow;

const getById = async (
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }

  return data;
};

const upsert = async (
  supabase: SupabaseClient<Database>,
  profile: ProfilesInsert,
): Promise<void> => {
  const { error } = await supabase
    .from("profiles")
    .upsert(profile, { onConflict: "id", ignoreDuplicates: true });

  if (error) {
    throw new Error(`Failed to upsert profile: ${error.message}`);
  }
};

export const profiles = { getById, upsert };
