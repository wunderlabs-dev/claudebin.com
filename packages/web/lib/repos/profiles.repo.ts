// packages/web/lib/repos/profiles.repo.ts
import { createServiceClient } from "@/lib/supabase/service";
import type { Profile } from "@/lib/types/domain";

const mapRowToProfile = (row: {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
}): Profile => ({
  id: row.id,
  email: row.email,
  name: row.name,
  avatarUrl: row.avatar_url,
});

export const getProfileById = async (id: string): Promise<Profile | null> => {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, name, avatar_url")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapRowToProfile(data);
};

export const upsertProfile = async (profile: {
  id: string;
  email?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
}): Promise<void> => {
  const supabase = createServiceClient();
  await supabase.from("profiles").upsert(
    {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      avatar_url: profile.avatarUrl,
    },
    { onConflict: "id", ignoreDuplicates: true },
  );
};
