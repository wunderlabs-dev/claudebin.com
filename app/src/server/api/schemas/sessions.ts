import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

// ============ sessions.publish ============

export const sessionsPublishInputSchema = z
  .object({
    title: z.string().optional(),
    conversation_data: z.string(),
    is_public: z.boolean().default(true),
    access_token: z.string(),
  })
  .openapi("SessionsPublishInput");

export const SessionStatus = {
  PROCESSING: "processing",
  READY: "ready",
  FAILED: "failed",
} as const;

export const sessionsPublishResponseSchema = z
  .object({
    id: z.string(),
    status: z.enum([SessionStatus.PROCESSING, SessionStatus.READY, SessionStatus.FAILED]),
  })
  .openapi("SessionsPublishResponse");

// ============ sessions.poll ============

export const sessionsPollInputSchema = z
  .object({
    id: z.string(),
  })
  .openapi("SessionsPollInput");

export const sessionsPollResponseSchema = z
  .discriminatedUnion("status", [
    z.object({ status: z.literal(SessionStatus.PROCESSING) }),
    z.object({ status: z.literal(SessionStatus.READY), url: z.string().url() }),
    z.object({ status: z.literal(SessionStatus.FAILED), error: z.string() }),
  ])
  .openapi("SessionsPollResponse");

// ============ Type exports ============

export type SessionsPublishInput = z.infer<typeof sessionsPublishInputSchema>;
export type SessionsPublishResponse = z.infer<typeof sessionsPublishResponseSchema>;
export type SessionsPollInput = z.infer<typeof sessionsPollInputSchema>;
export type SessionsPollResponse = z.infer<typeof sessionsPollResponseSchema>;
