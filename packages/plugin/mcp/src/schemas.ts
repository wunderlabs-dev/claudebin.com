import { z } from "zod";

export const UserConfigSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatar_url: z.string(),
});

export const AuthStartResponseSchema = z.object({
  code: z.string(),
  url: z.string(),
  expires_at: z.string(),
});

export const AuthPollResponseSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("pending") }),
  z.object({ status: z.literal("expired") }),
  z.object({
    status: z.literal("success"),
    token: z.string(),
    user: UserConfigSchema,
  }),
]);

export type UserConfig = z.infer<typeof UserConfigSchema>;
export type AuthStartResponse = z.infer<typeof AuthStartResponseSchema>;
export type AuthPollResponse = z.infer<typeof AuthPollResponseSchema>;
