import { NextResponse } from "next/server";

import { createOpenApiSpec } from "@/server/api/openapi";

export const GET = () => {
  const spec = createOpenApiSpec();
  return NextResponse.json(spec);
};
