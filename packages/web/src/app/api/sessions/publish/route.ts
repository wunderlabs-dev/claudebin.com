import { nanoid } from "nanoid";
import { after } from "next/server";
import { NextResponse, type NextRequest } from "next/server";

import { sessions } from "@/supabase/repos/sessions";
import { processSession } from "@/supabase/services/processor";
import { createServiceClient } from "@/supabase/service";
import { SESSION_MAX_SIZE_BYTES, SESSION_ID_LENGTH } from "@/utils/constants";
import {
  sessionsPublishInputSchema,
  SessionStatus,
  type SessionsPublishResponse,
} from "@/api/schemas/sessions";

export const POST = async (request: NextRequest): Promise<NextResponse<SessionsPublishResponse | { error: string }>> => {
  const body = await request.json();
  const parsed = sessionsPublishInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { title, conversation_data, is_public, access_token } = parsed.data;

  const serviceSupabase = createServiceClient();

  // Verify the token and get user
  const {
    data: { user },
    error: authError,
  } = await serviceSupabase.auth.getUser(access_token);

  if (authError || !user) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  // Validate size
  const sizeBytes = new TextEncoder().encode(conversation_data).length;
  if (sizeBytes > SESSION_MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: `Session too large: ${(sizeBytes / 1024 / 1024).toFixed(1)}MB exceeds 50MB limit` },
      { status: 400 }
    );
  }

  // Generate IDs and paths
  const id = nanoid(SESSION_ID_LENGTH);
  const storagePath = `${user.id}/${id}.jsonl`;

  // Upload to Storage
  await sessions.uploadJsonl(serviceSupabase, storagePath, conversation_data);

  // Insert session record with processing status
  try {
    await sessions.create(serviceSupabase, {
      id,
      userId: user.id,
      title,
      isPublic: is_public,
      status: SessionStatus.PROCESSING,
      storagePath,
    });
  } catch (error) {
    // Cleanup uploaded file on failure
    await sessions.deleteFile(serviceSupabase, storagePath);
    throw error;
  }

  after(() => processSession(serviceSupabase, id));

  return NextResponse.json({
    id,
    status: SessionStatus.PROCESSING,
  });
};
