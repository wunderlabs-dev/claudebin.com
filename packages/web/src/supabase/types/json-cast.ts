import type { Json } from "@/supabase/types";
import type { ContentBlock } from "@/supabase/types/message";

export const contentBlocksToJson = (blocks: ContentBlock[]): Json => blocks as unknown as Json;

export const jsonToContentBlocks = (json: Json): ContentBlock[] =>
  json as unknown as ContentBlock[];

export const toJson = <T>(value: T): Json => value as unknown as Json;
