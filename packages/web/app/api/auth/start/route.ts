import { NextResponse } from "next/server";

/**
 * POST /api/auth/start
 *
 * Generate a one-time authentication code for device authorization flow.
 * Returns a code and URL that the user should visit to complete authentication.
 */
export const POST = async () => {
  // TODO: Generate real code and store in database
  const mockCode = "abc123xyz789def456";
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  return NextResponse.json({
    code: mockCode,
    url: `https://claudebin.com/cli/auth?code=${mockCode}`,
    expires_at: expiresAt.toISOString(),
  });
};
