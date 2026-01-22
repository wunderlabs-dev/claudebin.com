import { nanoid } from "nanoid";
import { z } from "zod";
import { config } from "@/lib/config/env";
import { cliAuth } from "@/lib/repos/cli-auth.repo";
import { createServiceClient } from "@/lib/supabase/service";
import { publicProcedure, router } from "../init";

export const PollStatus = {
  PENDING: "pending",
  EXPIRED: "expired",
  SUCCESS: "success",
} as const;

export type PollStatusType = (typeof PollStatus)[keyof typeof PollStatus];

interface User {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
}

export type PollResponse =
  | { status: typeof PollStatus.PENDING }
  | { status: typeof PollStatus.EXPIRED }
  | {
      status: typeof PollStatus.SUCCESS;
      token: string;
      refresh_token: string;
      user: User;
    };

export const authRouter = router({
  start: publicProcedure.mutation(async () => {
    console.log("[auth.start] Creating new CLI auth session...");
    const supabase = createServiceClient();
    const sessionToken = nanoid(21);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    try {
      await cliAuth.create(supabase, {
        sessionToken,
        expiresAt: expiresAt.toISOString(),
      });
      console.log("[auth.start] Session created successfully:", { sessionToken, expiresAt });
    } catch (error) {
      console.error("[auth.start] Failed to create session:", error);
      throw error;
    }

    return {
      code: sessionToken,
      url: `${config.appUrl}/cli/auth?code=${sessionToken}`,
      expires_at: expiresAt.toISOString(),
    };
  }),

  poll: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input }): Promise<PollResponse> => {
      console.log("[auth.poll] Polling for code:", input.code);
      const supabase = createServiceClient();

      try {
        const session = await cliAuth.getByToken(supabase, input.code);
        console.log("[auth.poll] Session result:", session ? "found" : "not found");

        if (!session) {
          console.log("[auth.poll] Returning EXPIRED - no session");
          return { status: PollStatus.EXPIRED };
        }

        if (!session.expiresAt || new Date(session.expiresAt) < new Date()) {
          console.log("[auth.poll] Returning EXPIRED - session expired");
          return { status: PollStatus.EXPIRED };
        }

        if (session.completedAt) {
          console.log("[auth.poll] Returning SUCCESS - session completed");
          return {
            status: PollStatus.SUCCESS,
            token: session.accessToken!,
            refresh_token: session.refreshToken!,
            user: {
              id: session.profile?.id ?? session.userId!,
              name: session.profile?.name ?? null,
              email: session.profile?.email ?? null,
              avatar_url: session.profile?.avatarUrl ?? null,
            },
          };
        }

        console.log("[auth.poll] Returning PENDING - waiting for completion");
        return { status: PollStatus.PENDING };
      } catch (error) {
        console.error("[auth.poll] Error:", error);
        throw error;
      }
    }),

  refresh: publicProcedure
    .input(z.object({ refresh_token: z.string() }))
    .mutation(async ({ input }) => {
      console.log("[auth.refresh] Refreshing token...");
      const supabase = createServiceClient();

      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: input.refresh_token,
      });

      if (error || !data.session) {
        console.error("[auth.refresh] Failed:", error?.message);
        return { success: false, error: error?.message ?? "Failed to refresh" };
      }

      console.log("[auth.refresh] Success");
      return {
        success: true,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      };
    }),

  validate: publicProcedure.input(z.object({ token: z.string() })).query(async ({ input }) => {
    console.log("[auth.validate] Validating token...");
    const supabase = createServiceClient();

    const { data, error } = await supabase.auth.getUser(input.token);

    const isValid = !error && !!data.user;
    console.log("[auth.validate] Result:", isValid ? "valid" : "invalid", error?.message ?? "");
    return { valid: isValid };
  }),
});
