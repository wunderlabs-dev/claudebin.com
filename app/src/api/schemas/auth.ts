import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

// ============ auth.start ============

export const authStartResponseSchema = z
  .object({
    code: z.string(),
    url: z.string().url(),
    expires_at: z.string().datetime(),
  })
  .openapi("AuthStartResponse");

// ============ auth.poll ============

export const authPollInputSchema = z
  .object({
    code: z.string(),
  })
  .openapi("AuthPollInput");

export const PollStatus = {
  PENDING: "pending",
  EXPIRED: "expired",
  SUCCESS: "success",
} as const;

export const userSchema = z
  .object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    avatar_url: z.string().nullable(),
  })
  .openapi("User");

export const authPollResponseSchema = z
  .discriminatedUnion("status", [
    z.object({ status: z.literal(PollStatus.PENDING) }),
    z.object({ status: z.literal(PollStatus.EXPIRED) }),
    z.object({
      status: z.literal(PollStatus.SUCCESS),
      token: z.string(),
      refresh_token: z.string(),
      user: userSchema,
    }),
  ])
  .openapi("AuthPollResponse");

// ============ auth.refresh ============

export const authRefreshInputSchema = z
  .object({
    refresh_token: z.string(),
  })
  .openapi("AuthRefreshInput");

export const authRefreshResponseSchema = z
  .discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      access_token: z.string(),
      refresh_token: z.string(),
      expires_at: z.number().optional(),
    }),
    z.object({
      success: z.literal(false),
      error: z.string().optional(),
    }),
  ])
  .openapi("AuthRefreshResponse");

// ============ auth.validate ============

export const authValidateInputSchema = z
  .object({
    token: z.string(),
  })
  .openapi("AuthValidateInput");

export const authValidateResponseSchema = z
  .object({
    valid: z.boolean(),
  })
  .openapi("AuthValidateResponse");

// ============ Type exports ============

export type AuthStartResponse = z.infer<typeof authStartResponseSchema>;
export type AuthPollInput = z.infer<typeof authPollInputSchema>;
export type AuthPollResponse = z.infer<typeof authPollResponseSchema>;
export type AuthRefreshInput = z.infer<typeof authRefreshInputSchema>;
export type AuthRefreshResponse = z.infer<typeof authRefreshResponseSchema>;
export type AuthValidateInput = z.infer<typeof authValidateInputSchema>;
export type AuthValidateResponse = z.infer<typeof authValidateResponseSchema>;
export type User = z.infer<typeof userSchema>;
