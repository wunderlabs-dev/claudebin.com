import { nanoid } from "nanoid";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { publicProcedure, router } from "../init";

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export const SessionStatus = {
  PROCESSING: "processing",
  READY: "ready",
  FAILED: "failed",
} as const;

export type SessionStatusType =
  (typeof SessionStatus)[keyof typeof SessionStatus];

export type PollResponse =
  | { status: typeof SessionStatus.PROCESSING }
  | { status: typeof SessionStatus.READY; url: string }
  | { status: typeof SessionStatus.FAILED; error: string };

export const sessionsRouter = router({
  publish: publicProcedure
    .input(
      z.object({
        title: z.string().optional(),
        conversation_data: z.string(), // JSONL string
        is_public: z.boolean().default(true),
        access_token: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const supabase = await createClient();

      // Verify the token and get user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser(input.access_token);

      if (authError || !user) {
        throw new Error("Invalid or expired token");
      }

      // Validate size
      const sizeBytes = new TextEncoder().encode(
        input.conversation_data,
      ).length;
      if (sizeBytes > MAX_SIZE_BYTES) {
        throw new Error(
          `Session too large: ${(sizeBytes / 1024 / 1024).toFixed(1)}MB exceeds 50MB limit`,
        );
      }

      // Generate IDs and paths
      const id = nanoid(10);
      const storagePath = `${user.id}/${id}.jsonl`;

      // Use service client for storage upload (bypasses RLS)
      const serviceSupabase = createServiceClient();

      // Upload to Storage
      const { error: uploadError } = await serviceSupabase.storage
        .from("sessions")
        .upload(storagePath, input.conversation_data, {
          contentType: "application/jsonl",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Insert session record with processing status
      const { error: insertError } = await serviceSupabase
        .from("sessions")
        .insert({
          id,
          user_id: user.id,
          title: input.title,
          conversation_data: null,
          is_public: input.is_public,
          status: SessionStatus.PROCESSING,
          storage_path: storagePath,
        });

      if (insertError) {
        // Cleanup uploaded file on failure
        await serviceSupabase.storage.from("sessions").remove([storagePath]);
        throw new Error(`Failed to create session: ${insertError.message}`);
      }

      // Fire-and-forget background processing
      const internalUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/internal/process-session`;
      fetch(internalUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
        },
        body: JSON.stringify({ session_id: id }),
      }).catch((err) => {
        console.error("Failed to trigger session processing:", id, err);
      });

      return {
        id,
        status: "processing" as const,
      };
    }),

  poll: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }): Promise<PollResponse> => {
      const supabase = await createClient();

      const { data: session, error } = await supabase
        .from("sessions")
        .select("status, error_message")
        .eq("id", input.id)
        .single();

      if (error || !session) {
        return {
          status: SessionStatus.FAILED,
          error: "Session not found",
        };
      }

      if (session.status === SessionStatus.PROCESSING) {
        return { status: SessionStatus.PROCESSING };
      }

      if (session.status === SessionStatus.FAILED) {
        return {
          status: SessionStatus.FAILED,
          error: session.error_message || "Processing failed",
        };
      }

      return {
        status: SessionStatus.READY,
        url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/s/${input.id}`,
      };
    }),
});
