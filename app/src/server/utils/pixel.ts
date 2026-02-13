import { NextResponse, after } from "next/server";

import { createServiceClient } from "@/server/supabase/service";
import { getClientIp, getVisitorHash, isBot } from "@/server/utils/bots";
import { logger } from "@/server/utils/logger";

const PIXEL_GIF = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");

const PIXEL_HEADERS = {
  "Content-Type": "image/gif",
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

const EntityTypes = ["session", "profile"] as const;
type EntityType = (typeof EntityTypes)[number];

const MAX_ENTITY_ID_LENGTH = 36;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isValidEntityId = (entityType: EntityType, entityId: string): boolean => {
  if (!entityId || entityId.length > MAX_ENTITY_ID_LENGTH) return false;
  if (entityType === "profile") return UUID_PATTERN.test(entityId);
  return true;
};

export const createPixelResponse = (entityType: EntityType, entityId: string, headers: Headers) => {
  const response = new NextResponse(PIXEL_GIF, {
    status: 200,
    headers: PIXEL_HEADERS,
  });

  if (!isValidEntityId(entityType, entityId)) return response;

  after(async () => {
    const userAgent = headers.get("user-agent");

    if (isBot(userAgent)) return;

    const ip = getClientIp(headers);
    const visitorHash = getVisitorHash(ip, userAgent);
    const supabase = createServiceClient();

    // @ts-expect-error -- track_page_view RPC exists after migration 20250213000001; regenerate types to remove
    const { error } = await supabase.rpc("track_page_view", {
      p_entity_type: entityType,
      p_entity_id: entityId,
      p_visitor_hash: visitorHash,
    });

    if (error) {
      logger.pixel.error(`${entityType} view tracking failed`, error);
    }
  });

  return response;
};
