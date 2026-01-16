// packages/web/lib/repos/messages.repo.ts

import type { Json, TablesInsert } from "@/lib/supabase/database.types";
import { createServiceClient } from "@/lib/supabase/service";
import type { Message } from "@/lib/types/domain";
import type { ContentBlock } from "@/lib/types/message";

const mapRowToMessage = (row: {
  id: number;
  idx: number;
  role: string | null;
  model: string | null;
  content: Json;
  has_tool_calls: boolean;
  tool_names: string[];
  text_preview: string;
}): Message => ({
  id: row.id,
  idx: row.idx,
  role: row.role as Message["role"],
  model: row.model,
  content: row.content as unknown as ContentBlock[],
  hasToolCalls: row.has_tool_calls,
  toolNames: row.tool_names,
  textPreview: row.text_preview,
});

export const getMessagesBySessionId = async (
  sessionId: string,
  options?: { excludeMeta?: boolean; excludeSidechain?: boolean },
): Promise<Message[]> => {
  const supabase = createServiceClient();
  let query = supabase
    .from("messages")
    .select(
      "id, idx, role, model, content, has_tool_calls, tool_names, text_preview",
    )
    .eq("session_id", sessionId);

  if (options?.excludeMeta) {
    query = query.eq("is_meta", false);
  }
  if (options?.excludeSidechain) {
    query = query.eq("is_sidechain", false);
  }

  const { data, error } = await query.order("idx", { ascending: true });

  if (error || !data) return [];
  return data.map(mapRowToMessage);
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

  const rows = messages.map((m) => ({
    session_id: m.sessionId,
    idx: m.idx,
    uuid: m.uuid,
    parent_uuid: m.parentUuid,
    type: m.type,
    role: m.role,
    model: m.model,
    timestamp: m.timestamp,
    is_meta: m.isMeta,
    is_sidechain: m.isSidechain,
    content: m.content as unknown as Json,
    has_tool_calls: m.hasToolCalls,
    tool_names: m.toolNames,
    text_preview: m.textPreview,
    raw_message: m.rawMessage as Json,
  }));

  const { error } = await supabase
    .from("messages")
    .insert(rows as TablesInsert<"messages">[]);

  if (error) {
    throw new Error(`Message insert failed: ${error.message}`);
  }
};
