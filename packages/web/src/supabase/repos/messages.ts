import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { ContentBlock, Role } from "@/supabase/types/message";
import type { Database } from "@/supabase/types";

import { jsonToContentBlocks } from "@/supabase/types/json-cast";

type MessagesRow = Database["public"]["Tables"]["messages"]["Row"];
type MessagesInsert = Database["public"]["Tables"]["messages"]["Insert"];

// Message with typed content for UI consumption
export type Message = Omit<MessagesRow, "content" | "rawMessage" | "role"> & {
  role: Role;
  content: ContentBlock[];
};

interface GetBySessionOptions {
  excludeMeta?: boolean;
  excludeSidechain?: boolean;
  limit?: number;
  offset?: number;
}

export interface PaginatedMessages {
  messages: Message[];
  total: number;
}

const mapRowToMessage = (row: MessagesRow): Message => ({
  ...row,
  content: jsonToContentBlocks(row.content),
});

const DEFAULT_LIMIT = 50;

const getBySessionId = async (
  supabase: SupabaseClient<Database>,
  sessionId: string,
  options?: GetBySessionOptions,
): Promise<PaginatedMessages> => {
  let query = supabase.from("messages").select("*", { count: "exact" }).eq("sessionId", sessionId);

  if (options?.excludeMeta) {
    query = query.eq("isMeta", false);
  }
  if (options?.excludeSidechain) {
    query = query.eq("isSidechain", false);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    const limit = options.limit ?? DEFAULT_LIMIT;
    query = query.range(options.offset, options.offset + limit - 1);
  }

  const { data, error, count } = await query.order("idx", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }

  return {
    messages: (data ?? []).map(mapRowToMessage),
    total: count ?? 0,
  };
};

const insertBatch = async (
  supabase: SupabaseClient<Database>,
  rows: MessagesInsert[],
): Promise<void> => {
  const { error } = await supabase.from("messages").insert(rows);

  if (error) {
    throw new Error(`Message insert failed: ${error.message}`);
  }
};

export const messages = { getBySessionId, insertBatch };
