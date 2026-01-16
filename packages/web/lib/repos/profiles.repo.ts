import type { Tables, TablesInsert } from "@/lib/supabase/database.types";
import { createServiceClient } from "@/lib/supabase/service";

export type Profile = Tables<"profiles">;

export const getProfileById = async (id: string): Promise<Profile | null> => {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
};

export const upsertProfile = async (
  profile: TablesInsert<"profiles">,
): Promise<void> => {
  const supabase = createServiceClient();
  await supabase
    .from("profiles")
    .upsert(profile, { onConflict: "id", ignoreDuplicates: true });
};
