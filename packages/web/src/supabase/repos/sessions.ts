import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/supabase/types";

type SessionsRow = Database["public"]["Tables"]["sessions"]["Row"];
type SessionsInsert = Database["public"]["Tables"]["sessions"]["Insert"];
type SessionsUpdate = Database["public"]["Tables"]["sessions"]["Update"];

export type Session = SessionsRow;

// No ownership check - session ID is treated as capability token.
// For owner-only operations, use getByIdForUser instead.
const getById = async (supabase: SupabaseClient<Database>, id: string): Promise<Session | null> => {
  const { data, error } = await supabase.from("sessions").select("*").eq("id", id).maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch session: ${error.message}`);
  }

  return data;
};

const getByIdForUser = async (
  supabase: SupabaseClient<Database>,
  id: string,
  userId: string,
): Promise<Session | null> => {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", id)
    .eq("userId", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch session: ${error.message}`);
  }

  return data;
};

const create = async (
  supabase: SupabaseClient<Database>,
  session: SessionsInsert,
): Promise<void> => {
  const { error } = await supabase.from("sessions").insert(session);

  if (error) {
    console.error("Session insert failed:", error);
    throw new Error("Failed to create session. Please try again.");
  }
};

const update = async (
  supabase: SupabaseClient<Database>,
  id: string,
  updates: SessionsUpdate,
): Promise<void> => {
  const { error } = await supabase.from("sessions").update(updates).eq("id", id);

  if (error) {
    console.error("Session update failed:", error);
    throw new Error("Failed to update session.");
  }
};

const uploadJsonl = async (
  supabase: SupabaseClient<Database>,
  storagePath: string,
  content: string,
): Promise<void> => {
  const { error } = await supabase.storage.from("sessions").upload(storagePath, content, {
    contentType: "application/jsonl",
    upsert: false,
  });

  if (error) {
    console.error("Storage upload failed:", error);
    throw new Error("Failed to upload session. Please try again.");
  }
};

const downloadJsonl = async (
  supabase: SupabaseClient<Database>,
  storagePath: string,
): Promise<string> => {
  const { data, error } = await supabase.storage.from("sessions").download(storagePath);

  if (error || !data) {
    throw new Error(`Download failed: ${error?.message}`);
  }

  return data.text();
};

const downloadJsonlStream = async (
  supabase: SupabaseClient<Database>,
  storagePath: string,
): Promise<ReadableStream<Uint8Array>> => {
  const { data, error } = await supabase.storage.from("sessions").download(storagePath);

  if (error || !data) {
    throw new Error(`Download failed: ${error?.message}`);
  }

  return data.stream();
};

const deleteFile = async (
  supabase: SupabaseClient<Database>,
  storagePath: string,
): Promise<void> => {
  const { error } = await supabase.storage.from("sessions").remove([storagePath]);

  if (error) {
    console.error("Storage delete failed:", error);
  }
};

export const sessions = {
  getById,
  getByIdForUser,
  create,
  update,
  uploadJsonl,
  downloadJsonl,
  downloadJsonlStream,
  deleteFile,
};
