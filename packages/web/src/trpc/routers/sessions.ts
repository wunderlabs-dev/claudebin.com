import { nanoid } from "nanoid";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { publicProcedure, router } from "../init";

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

      const id = nanoid(10);

      const { error } = await supabase.from("sessions").insert({
        id,
        user_id: user.id,
        title: input.title,
        conversation_data: JSON.parse(input.conversation_data),
        is_public: input.is_public,
      });

      if (error) {
        throw new Error(`Failed to publish session: ${error.message}`);
      }

      return {
        id,
        url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/s/${id}`,
      };
    }),
});
