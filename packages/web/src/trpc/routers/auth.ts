import { nanoid } from "nanoid";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { publicProcedure, router } from "../init";

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

interface User {
  id: string;
  username: string;
  avatar_url: string;
}

export type PollResponse =
  | { status: "pending" }
  | { status: "expired" }
  | { status: "success"; token: string; user: User };

export const authRouter = router({
  start: publicProcedure.mutation(async () => {
    const supabase = await createClient();
    const code = nanoid(21);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const { error } = await supabase.from("cli_auth_sessions").insert({
      code,
      expires_at: expiresAt.toISOString(),
    });

    if (error) {
      throw new Error("Failed to create auth session");
    }

    const baseUrl = getBaseUrl();

    return {
      code,
      url: `${baseUrl}/cli/auth?code=${code}`,
      expires_at: expiresAt.toISOString(),
    };
  }),

  poll: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input }): Promise<PollResponse> => {
      const supabase = await createClient();

      const { data: session, error } = await supabase
        .from("cli_auth_sessions")
        .select("*, profiles(*)")
        .eq("code", input.code)
        .single();

      if (error || !session) {
        return { status: "expired" };
      }

      if (new Date(session.expires_at) < new Date()) {
        return { status: "expired" };
      }

      if (session.completed_at && session.user_id && session.access_token) {
        return {
          status: "success",
          token: session.access_token,
          user: {
            id: session.profiles.id,
            username: session.profiles.username,
            avatar_url: session.profiles.avatar_url,
          },
        };
      }

      return { status: "pending" };
    }),
});
