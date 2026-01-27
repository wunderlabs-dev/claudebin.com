import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/supabase/types";

type ProfilesRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfilesInsert = Database["public"]["Tables"]["profiles"]["Insert"];

export type Profile = ProfilesRow;

const getById = async (supabase: SupabaseClient<Database>, id: string): Promise<Profile | null> => {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }

  return data;
};

const getByUsername = async (
  supabase: SupabaseClient<Database>,
  username: string,
): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error) {
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

const incrementViewCount = async (
  supabase: SupabaseClient<Database>,
  profileId: string,
): Promise<void> => {
  await supabase.rpc("increment_profile_view_count", { profile_id: profileId });
};

export const profiles = { getById, getByUsername, upsert, incrementViewCount };
