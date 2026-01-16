import { nanoid } from "nanoid";
import { z } from "zod";
import { profiles } from "@/lib/repos/profiles.repo";
import { sessions } from "@/lib/repos/sessions.repo";
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
      const serviceSupabase = createServiceClient();

      // Verify the token and get user
      const {
        data: { user },
        error: authError,
      } = await serviceSupabase.auth.getUser(input.access_token);

      if (authError || !user) {
        throw new Error("Invalid or expired token");
      }

      // Ensure profile exists (handles users created before trigger was added)
      await profiles.upsert(serviceSupabase, {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.user_metadata?.full_name,
        avatarUrl:
          user.user_metadata?.avatar_url || user.user_metadata?.picture,
      });

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

      // Upload to Storage
      await sessions.uploadJsonl(
        serviceSupabase,
        storagePath,
        input.conversation_data,
      );

      // Insert session record with processing status
      try {
        await sessions.create(serviceSupabase, {
          id,
          userId: user.id,
          title: input.title,
          isPublic: input.is_public,
          status: SessionStatus.PROCESSING,
          storagePath,
        });
      } catch (error) {
        // Cleanup uploaded file on failure
        await sessions.deleteFile(serviceSupabase, storagePath);
        throw error;
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
      const supabase = createServiceClient();
      const session = await sessions.getById(supabase, input.id);

      if (!session) {
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
          error: session.errorMessage || "Processing failed",
        };
      }

      return {
        status: SessionStatus.READY,
        url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/s/${input.id}`,
      };
    }),
});
