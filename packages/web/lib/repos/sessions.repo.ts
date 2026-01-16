import type { Tables, TablesInsert } from "@/lib/supabase/database.types";
import { createServiceClient } from "@/lib/supabase/service";

export type Session = Tables<"sessions">;

export const getSessionById = async (id: string): Promise<Session | null> => {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
};

// Alias for backwards compat - storagePath is already in Session
export const getSessionByIdWithStoragePath = getSessionById;

export const createSession = async (
  session: TablesInsert<"sessions">,
): Promise<void> => {
  const supabase = createServiceClient();
  const { error } = await supabase.from("sessions").insert(session);

  if (error) {
    console.error("Session insert failed:", error);
    throw new Error("Failed to create session. Please try again.");
  }
};

export const updateSessionStatus = async (
  id: string,
  status: string,
  extra?: { messageCount?: number; errorMessage?: string },
): Promise<void> => {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("sessions")
    .update({
      status,
      messageCount: extra?.messageCount,
      errorMessage: extra?.errorMessage,
    })
    .eq("id", id);

  if (error) {
    console.error("Session update failed:", error);
    throw new Error("Failed to update session.");
  }
};

// Storage operations
export const uploadSessionJsonl = async (
  storagePath: string,
  content: string,
): Promise<void> => {
  const supabase = createServiceClient();
  const { error } = await supabase.storage
    .from("sessions")
    .upload(storagePath, content, {
      contentType: "application/jsonl",
      upsert: false,
    });

  if (error) {
    console.error("Storage upload failed:", error);
    throw new Error("Failed to upload session. Please try again.");
  }
};

export const downloadSessionJsonl = async (
  storagePath: string,
): Promise<string> => {
  const supabase = createServiceClient();
  const { data, error } = await supabase.storage
    .from("sessions")
    .download(storagePath);

  if (error || !data) {
    throw new Error(`Download failed: ${error?.message}`);
  }

  return data.text();
};

export const deleteSessionFile = async (storagePath: string): Promise<void> => {
  const supabase = createServiceClient();
  await supabase.storage.from("sessions").remove([storagePath]);
};
