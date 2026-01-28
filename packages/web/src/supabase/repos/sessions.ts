import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/supabase/types";
import { logger } from "@/utils/logger";

type SessionsRow = Database["public"]["Tables"]["sessions"]["Row"];
type SessionsInsert = Database["public"]["Tables"]["sessions"]["Insert"];
type SessionsUpdate = Database["public"]["Tables"]["sessions"]["Update"];

export type Session = SessionsRow;

export type ThreadWithAuthor = SessionsRow & {
  profiles: {
    username: string | null;
    avatarUrl: string | null;
  } | null;
  hasLiked?: boolean;
};

type ProfileWithDeleted = {
  username: string | null;
  avatarUrl: string | null;
  deletedAt: string | null;
};

const sanitizeProfile = (profile: ProfileWithDeleted | null): ThreadWithAuthor["profiles"] => {
  if (!profile || profile.deletedAt) return null;
  return { username: profile.username, avatarUrl: profile.avatarUrl };
};

export type GetPublicThreadsResult = {
  threads: ThreadWithAuthor[];
  total: number;
};

const getPublicThreads = async (
  supabase: SupabaseClient<Database>,
  options: { query?: string; limit?: number; offset?: number } = {},
): Promise<GetPublicThreadsResult> => {
  const { query, limit = 20, offset = 0 } = options;

  let queryBuilder = supabase
    .from("sessions")
    .select("*, profiles(username, avatarUrl, deletedAt)", { count: "exact" })
    .eq("isPublic", true)
    .order("createdAt", { ascending: false });

  if (query?.trim()) {
    queryBuilder = queryBuilder.ilike("title", `%${query}%`);
  }

  const { data, error, count } = await queryBuilder.range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to fetch threads: ${error.message}`);
  }

  const threads = (data ?? []).map((thread) => ({
    ...thread,
    profiles: sanitizeProfile(thread.profiles),
  }));

  return { threads, total: count ?? 0 };
};

const getByUserId = async (
  supabase: SupabaseClient<Database>,
  userId: string,
  limit = 20,
): Promise<Session[]> => {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("userId", userId)
    .eq("isPublic", true)
    .order("createdAt", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch threads by user: ${error.message}`);
  }

  return data ?? [];
};

// No ownership check - session ID is treated as capability token.
// For owner-only operations, use getByIdForUser instead.
const getById = async (supabase: SupabaseClient<Database>, id: string): Promise<Session | null> => {
  const { data, error } = await supabase.from("sessions").select("*").eq("id", id).maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch session: ${error.message}`);
  }

  return data;
};

const getByIdWithAuthor = async (
  supabase: SupabaseClient<Database>,
  id: string,
  currentUserId?: string,
): Promise<ThreadWithAuthor | null> => {
  const query = supabase
    .from("sessions")
    .select("*, profiles(username, avatarUrl, deletedAt), session_likes(id)")
    .eq("id", id);

  if (currentUserId) {
    query.eq("session_likes.userId", currentUserId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) throw new Error(`Failed to fetch session: ${error.message}`);
  if (!data) return null;

  const { session_likes, profiles, ...session } = data;
  const hasLiked = currentUserId ? (session_likes?.length ?? 0) > 0 : false;

  return { ...session, profiles: sanitizeProfile(profiles), hasLiked };
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
    logger.sessions.error("Session insert failed", error);
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
    logger.sessions.error("Session update failed", error);
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
    logger.sessions.error("Storage upload failed", error);
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
    logger.sessions.error("Storage delete failed", error);
  }
};

const incrementViewCount = async (
  supabase: SupabaseClient<Database>,
  sessionId: string,
): Promise<void> => {
  const { error } = await supabase.rpc("increment_session_view_count", {
    session_id: sessionId,
  });

  if (error) {
    logger.sessions.error("View count increment failed", error);
  }
};

export const sessions = {
  getPublicThreads,
  getByUserId,
  getById,
  getByIdWithAuthor,
  getByIdForUser,
  create,
  update,
  uploadJsonl,
  downloadJsonl,
  downloadJsonlStream,
  deleteFile,
  incrementViewCount,
};
