import { nanoid } from "nanoid";
import { z } from "zod";

import { config } from "@/supabase/config/env";
import { cliAuth } from "@/supabase/repos/cli-auth";
import { createServiceClient } from "@/supabase/service";
import { publicProcedure, router } from "@/trpc/init";

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

    await cliAuth.create(supabase, {
      sessionToken,
      expiresAt: expiresAt.toISOString(),
    });

    return {
      code: sessionToken,
      url: `${config.appUrl}/cli/auth?code=${sessionToken}`,
      expires_at: expiresAt.toISOString(),
    };
  }),

  poll: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input }): Promise<PollResponse> => {
      const supabase = createServiceClient();
      const session = await cliAuth.getByToken(supabase, input.code);

      if (!session) {
        return { status: PollStatus.EXPIRED };
      }

      if (!session.expiresAt || new Date(session.expiresAt) < new Date()) {
        return { status: PollStatus.EXPIRED };
      }

      if (session.completedAt) {
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
        return { success: false, error: error?.message ?? "Failed to refresh" };
      }

      return {
        success: true,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      };
    }),

  validate: publicProcedure.input(z.object({ token: z.string() })).query(async ({ input }) => {
    const supabase = createServiceClient();
    const { data, error } = await supabase.auth.getUser(input.token);
    return { valid: !error && !!data.user };
  }),
});
