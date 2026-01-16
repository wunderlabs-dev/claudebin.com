import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { ContentBlock } from "@/lib/types/message";

type MessagesRow = Database["public"]["Tables"]["messages"]["Row"];
type MessagesInsert = Database["public"]["Tables"]["messages"]["Insert"];

// Message with typed content for UI consumption
export type Message = Omit<MessagesRow, "content" | "rawMessage"> & {
  content: ContentBlock[];
};

const mapRowToMessage = (row: MessagesRow): Message => ({
  ...row,
  // content is Json in DB, we trust it's ContentBlock[] at runtime
  content: row.content as unknown as ContentBlock[],
});

const getBySessionId = async (
  supabase: SupabaseClient<Database>,
  sessionId: string,
  options?: { excludeMeta?: boolean; excludeSidechain?: boolean },
): Promise<Message[]> => {
  let query = supabase.from("messages").select("*").eq("sessionId", sessionId);

  if (options?.excludeMeta) {
    query = query.eq("isMeta", false);
  }
  if (options?.excludeSidechain) {
    query = query.eq("isSidechain", false);
  }

  const { data, error } = await query.order("idx", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }

  return (data ?? []).map(mapRowToMessage);
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
