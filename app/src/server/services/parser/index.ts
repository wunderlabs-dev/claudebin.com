import type { Json } from "@/supabase/types";

import { MessageRole } from "@/supabase/types/message";
import { contentBlocksToJson, toJson } from "@/supabase/types/json-cast";

import { RawJsonlMessageSchema } from "./schemas";
import { createPipeline, type IntermediateMessage } from "./pipeline";

export type { RawContentBlock, RawJsonlMessage } from "./schemas";
export type { IntermediateMessage } from "./pipeline";

export interface ParsedMessage {
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
  content: Json;
  hasToolCalls: boolean;
  toolNames: string[];
  textPreview: string;
  rawMessage: Json;
}

export const extractWorkingDir = (jsonl: string): string | null => {
  for (const line of jsonl.split("\n")) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      if (typeof parsed?.cwd === "string") return parsed.cwd;
    } catch {}
  }
  return null;
};

export const parseJsonl = (jsonl: string, sessionId: string): ParsedMessage[] => {
  const workingDir = extractWorkingDir(jsonl);
  const pipeline = createPipeline(workingDir);

  for (const line of jsonl.split("\n")) {
    if (!line.trim()) continue;
    try {
      const result = RawJsonlMessageSchema.safeParse(JSON.parse(line));
      if (result.success) pipeline.ingest(result.data);
    } catch {}
  }
  pipeline.flush();

  return pipeline
    .getMessages()
    .flatMap(({ raw, content, toolNames, textParts }: IntermediateMessage, idx: number) => {
      if (content.length === 0) return [];

      return {
        sessionId,
        idx,
        uuid: raw.uuid,
        parentUuid: raw.parentUuid,
        type: raw.type,
        role: raw.type === MessageRole.USER ? MessageRole.USER : MessageRole.ASSISTANT,
        model: raw.message.model ?? null,
        timestamp: raw.timestamp,
        isMeta: raw.isMeta ?? false,
        isSidechain: raw.isSidechain ?? false,
        content: contentBlocksToJson(content),
        hasToolCalls: toolNames.length > 0,
        toolNames,
        textPreview: textParts.join("\n").slice(0, 500),
        rawMessage: toJson(raw),
      };
    });
};
