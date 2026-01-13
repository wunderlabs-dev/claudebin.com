import { type NextRequest, NextResponse } from "next/server";

/**
 * GET /api/auth/poll?code=X
 *
 * Check if an authentication code has been completed.
 * Returns pending, success (with token), or expired.
 */
export const GET = async (request: NextRequest) => {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Missing code parameter" },
      { status: 400 },
    );
  }

  // TODO: Look up code in database and check status
  // For now, always return pending
  return NextResponse.json({
    status: "pending",
  });

  // Success response format (for reference):
  // return NextResponse.json({
  //   status: "success",
  //   token: "eyJhbG...",
  //   user: {
  //     id: "uuid",
  //     username: "vlad",
  //     avatar_url: "https://...",
  //   },
  // });

  // Expired response format (for reference):
  // return NextResponse.json({
  //   status: "expired",
  // });
};
