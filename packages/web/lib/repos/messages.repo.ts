import type { Tables, TablesInsert } from "@/lib/supabase/database.types";
import { createServiceClient } from "@/lib/supabase/service";
import type { ContentBlock } from "@/lib/types/message";

// DB row with typed content instead of Json
export type Message = Omit<Tables<"messages">, "content" | "rawMessage"> & {
  content: ContentBlock[];
};

export const getMessagesBySessionId = async (
  sessionId: string,
  options?: { excludeMeta?: boolean; excludeSidechain?: boolean },
): Promise<Message[]> => {
  const supabase = createServiceClient();
  let query = supabase
    .from("messages")
    .select(
      "id, idx, role, model, content, hasToolCalls, toolNames, textPreview",
    )
    .eq("sessionId", sessionId);

  if (options?.excludeMeta) {
    query = query.eq("isMeta", false);
  }
  if (options?.excludeSidechain) {
    query = query.eq("isSidechain", false);
  }

  const { data, error } = await query.order("idx", { ascending: true });

  if (error || !data) return [];
  // Content is stored as Json but we know it's ContentBlock[]
  return data as unknown as Message[];
};

export const insertMessagesBatch = async (
  messages: Array<{
    sessionId: string;
    idx: number;
    uuid: string;
    parentUuid: string | null;
    type: string;
    role: string | null;
    model: string | null;
    timestamp: string;
    isMeta: boolean;
    isSidechain: boolean;
    content: ContentBlock[];
    hasToolCalls: boolean;
    toolNames: string[];
    textPreview: string;
    rawMessage: unknown;
  }>,
): Promise<void> => {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("messages")
    .insert(messages as unknown as TablesInsert<"messages">[]);

  if (error) {
    throw new Error(`Message insert failed: ${error.message}`);
  }
};
