import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

import { config } from "@/server/supabase/config/env";
import { cliAuth } from "@/server/repos/cli-auth";
import { createServiceClient } from "@/server/supabase/service";
import { AUTH_SESSION_TIMEOUT_MS, AUTH_TOKEN_LENGTH } from "@/utils/constants";
import type { AuthStartResponse } from "@/server/api/schemas/auth";

export const POST = async (): Promise<NextResponse<AuthStartResponse>> => {
  const supabase = createServiceClient();
  const sessionToken = nanoid(AUTH_TOKEN_LENGTH);
  const expiresAt = new Date(Date.now() + AUTH_SESSION_TIMEOUT_MS);

  await cliAuth.create(supabase, {
    sessionToken,
    expiresAt: expiresAt.toISOString(),
  });

  return NextResponse.json({
    code: sessionToken,
    url: `${config.appUrl}/cli/auth?code=${sessionToken}`,
    expires_at: expiresAt.toISOString(),
  });
};
