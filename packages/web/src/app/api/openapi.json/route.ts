import { NextResponse } from "next/server";

import { createOpenApiSpec } from "@/api/openapi";

export const GET = () => {
  const spec = createOpenApiSpec();
  return NextResponse.json(spec);
};
