import type { NextRequest } from "next/server";

import { createPixelResponse } from "@/server/utils/pixel";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = async (request: NextRequest, context: RouteContext) => {
  const { id } = await context.params;
  return createPixelResponse("session", id, request.headers);
};
