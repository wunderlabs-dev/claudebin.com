import { nanoid } from "nanoid";
import { z } from "zod";
import {
  createCliAuthSession,
  getCliAuthSessionByToken,
} from "@/lib/repos/cli-auth.repo";
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

    await createCliAuthSession(supabase, {
      sessionToken,
      expiresAt: expiresAt.toISOString(),
    });

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
      const session = await getCliAuthSessionByToken(supabase, input.code);

      if (!session) {
        return { status: PollStatus.EXPIRED };
      }

      if (!session.expiresAt || new Date(session.expiresAt) < new Date()) {
        return { status: PollStatus.EXPIRED };
      }

      if (
        session.completedAt &&
        session.userId &&
        session.accessToken &&
        session.refreshToken
      ) {
        return {
          status: PollStatus.SUCCESS,
          token: session.accessToken,
          refresh_token: session.refreshToken,
          user: {
            id: session.profile?.id ?? session.userId,
            name: session.profile?.name ?? null,
            email: session.profile?.email ?? null,
            avatar_url: session.profile?.avatarUrl ?? null,
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
