// packages/web/lib/repos/sessions.repo.ts
import { createServiceClient } from "@/lib/supabase/service";
import type { Session } from "@/lib/types/domain";

const mapRowToSession = (row: {
  id: string;
  title: string | null;
  status: string;
  message_count: number | null;
  error_message: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}): Session => ({
  id: row.id,
  title: row.title,
  status: row.status as Session["status"],
  messageCount: row.message_count,
  errorMessage: row.error_message,
  isPublic: row.is_public,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

export const getSessionById = async (id: string): Promise<Session | null> => {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("sessions")
    .select(
      "id, title, status, message_count, error_message, is_public, created_at, updated_at",
    )
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapRowToSession(data);
};

export const getSessionByIdWithStoragePath = async (
  id: string,
): Promise<(Session & { storagePath: string | null }) | null> => {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("sessions")
    .select(
      "id, title, status, message_count, error_message, is_public, created_at, updated_at, storage_path",
    )
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return { ...mapRowToSession(data), storagePath: data.storage_path };
};

export const createSession = async (session: {
  id: string;
  userId: string;
  title?: string;
  isPublic: boolean;
  status: Session["status"];
  storagePath: string;
}): Promise<void> => {
  const supabase = createServiceClient();
  const { error } = await supabase.from("sessions").insert({
    id: session.id,
    user_id: session.userId,
    title: session.title,
    is_public: session.isPublic,
    status: session.status,
    storage_path: session.storagePath,
  });

  if (error) {
    console.error("Session insert failed:", error);
    throw new Error("Failed to create session. Please try again.");
  }
};

export const updateSessionStatus = async (
  id: string,
  status: Session["status"],
  extra?: { messageCount?: number; errorMessage?: string },
): Promise<void> => {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("sessions")
    .update({
      status,
      message_count: extra?.messageCount,
      error_message: extra?.errorMessage,
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
