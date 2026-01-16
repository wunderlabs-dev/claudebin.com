import { nanoid } from "nanoid";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { publicProcedure, router } from "../init";

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

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
    const supabase = createServiceClient();
    const sessionToken = nanoid(21);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const { error } = await supabase.from("cli_auth_sessions").insert({
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
    });

    if (error) {
      console.error("Failed to create auth session:", error);
      throw new Error("Failed to create auth session");
    }

    const baseUrl = getBaseUrl();

    return {
      code: sessionToken,
      url: `${baseUrl}/cli/auth?code=${sessionToken}`,
      expires_at: expiresAt.toISOString(),
    };
  }),

  poll: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input }): Promise<PollResponse> => {
      const supabase = createServiceClient();

      const { data: session, error } = await supabase
        .from("cli_auth_sessions")
        .select("*, profiles(*)")
        .eq("session_token", input.code)
        .single();

      if (error || !session) {
        return { status: PollStatus.EXPIRED };
      }

      if (!session.expires_at || new Date(session.expires_at) < new Date()) {
        return { status: PollStatus.EXPIRED };
      }

      if (
        session.completed_at &&
        session.user_id &&
        session.access_token &&
        session.refresh_token
      ) {
        const profile = session.profiles as {
          id: string;
          name: string | null;
          email: string | null;
          avatar_url: string | null;
        } | null;
        return {
          status: PollStatus.SUCCESS,
          token: session.access_token,
          refresh_token: session.refresh_token,
          user: {
            id: profile?.id ?? session.user_id,
            name: profile?.name ?? null,
            email: profile?.email ?? null,
            avatar_url: profile?.avatar_url ?? null,
          },
        };
      }

      return { status: PollStatus.PENDING };
    }),

  refresh: publicProcedure
    .input(z.object({ refresh_token: z.string() }))
    .mutation(async ({ input }) => {
      const supabase = createServiceClient();

      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: input.refresh_token,
      });

      if (error || !data.session) {
        return {
          success: false as const,
          error: error?.message ?? "Failed to refresh",
        };
      }

      return {
        success: true as const,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      };
    }),
});
