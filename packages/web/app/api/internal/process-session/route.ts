import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

const BATCH_SIZE = 100;

export const POST = async (request: Request): Promise<Response> => {
  // Verify internal request
  const secret = request.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { session_id } = await request.json();

  if (!session_id || typeof session_id !== "string") {
    return NextResponse.json({ error: "Invalid session_id" }, { status: 400 });
  }

  const supabase = createServiceClient();

  try {
    // Fetch session metadata
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("storage_path, status")
      .eq("id", session_id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.status !== "processing") {
      return NextResponse.json(
        { error: "Session already processed" },
        { status: 400 },
      );
    }

    if (!session.storage_path) {
      throw new Error("Session has no storage_path");
    }

    // Download JSONL from Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("sessions")
      .download(session.storage_path);

    if (downloadError || !fileData) {
      throw new Error(`Download failed: ${downloadError?.message}`);
    }

    const jsonlContent = await fileData.text();
    const lines = jsonlContent.split("\n").filter((line) => line.trim());

    // Parse and prepare messages
    const messages: {
      session_id: string;
      idx: number;
      type: string;
      message: unknown;
    }[] = [];

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      try {
        const parsed = JSON.parse(line);
        messages.push({
          session_id,
          idx,
          type: parsed.type || "unknown",
          message: parsed,
        });
      } catch (parseError) {
        // Log but continue - don't fail entire session for one bad line
        console.error(`Line ${idx} parse error:`, parseError);
      }
    }

    // Insert in batches
    for (let i = 0; i < messages.length; i += BATCH_SIZE) {
      const batch = messages.slice(i, i + BATCH_SIZE);
      const { error: batchError } = await supabase
        .from("messages")
        .insert(batch);

      if (batchError) {
        throw new Error(`Batch insert failed at ${i}: ${batchError.message}`);
      }
    }

    // Update session to ready
    const { error: updateError } = await supabase
      .from("sessions")
      .update({
        status: "ready",
        message_count: messages.length,
      })
      .eq("id", session_id);

    if (updateError) {
      throw new Error(`Failed to update session: ${updateError.message}`);
    }

    return NextResponse.json({
      success: true,
      message_count: messages.length,
    });
  } catch (error) {
    // Mark session as failed
    const { error: updateError } = await supabase
      .from("sessions")
      .update({
        status: "failed",
        error_message: error instanceof Error ? error.message : String(error),
      })
      .eq("id", session_id);

    if (updateError) {
      console.error(
        `Failed to mark session ${session_id} as failed:`,
        updateError,
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
};
