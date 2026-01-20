import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getValidToken, runAuthFlow } from "../auth.js";
import { getApiBaseUrl } from "../config.js";
import {
  MAX_SESSION_SIZE_BYTES,
  POLL_INTERVAL_MS,
  SESSION_POLL_TIMEOUT_MS,
  SessionStatus,
} from "../constants.js";
import { extractSession } from "../session.js";
import { createApiClient } from "../trpc.js";
import { poll } from "../utils.js";

interface SessionPollData {
  status: string;
  url?: string;
  error?: string;
}

type PollResult =
  | { success: true; url: string }
  | { success: false; error: string };

const fetchSessionPollData = async (
  sessionId: string,
  apiUrl: string,
): Promise<SessionPollData | null> => {
  const url = `${apiUrl}/api/trpc/sessions.poll?input=${encodeURIComponent(
    JSON.stringify({ id: sessionId }),
  )}`;
  const res = await fetch(url);
  const json = await res.json();
  return json.result?.data ?? null;
};

const pollForProcessing = async (
  sessionId: string,
  apiUrl: string,
  timeoutMs = SESSION_POLL_TIMEOUT_MS,
): Promise<PollResult> => {
  const result = await poll<SessionPollData>({
    fn: () => fetchSessionPollData(sessionId, apiUrl),
    isSuccess: (data) =>
      data.status === SessionStatus.READY && data.url !== undefined,
    isFailure: (data) => data.status === SessionStatus.FAILED,
    getFailureError: (data) => data.error || "Processing failed",
    intervalMs: POLL_INTERVAL_MS,
    timeoutMs,
    timeoutError: "Processing timed out after 2 minutes",
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  const { url } = result.result;

  // Guaranteed by isSuccess check, but TypeScript can't infer that
  if (!url) {
    return { success: false, error: "Invalid session response" };
  }

  return { success: true, url };
};

const errorResponse = (error: string) => ({
  content: [
    { type: "text" as const, text: JSON.stringify({ success: false, error }) },
  ],
  isError: true,
});

const successResponse = (data: Record<string, unknown>) => ({
  content: [
    { type: "text" as const, text: JSON.stringify({ success: true, ...data }) },
  ],
});

export const registerShare = (server: McpServer): void => {
  server.registerTool(
    "share",
    {
      description:
        "Share the current Claude Code session to Claudebin. Authenticates automatically if needed.",
      inputSchema: {
        project_path: z
          .string()
          .describe("Absolute path to the project directory"),
        title: z.string().optional().describe("Optional title for the session"),
        is_public: z
          .boolean()
          .default(true)
          .describe("Whether the session is public"),
      },
    },
    async ({ project_path, title, is_public }) => {
      // Get token, or run auth flow if not authenticated
      let token = await getValidToken();

      if (!token) {
        const authResult = await runAuthFlow();
        if (!authResult.success) {
          return errorResponse(authResult.error);
        }
        token = authResult.token;
      }

      // Extract session
      const sessionResult = await extractSession(project_path);

      if (!sessionResult.success) {
        return errorResponse(sessionResult.error);
      }

      const { content } = sessionResult.data;

      // Check size
      const sizeBytes = new TextEncoder().encode(content).length;
      if (sizeBytes > MAX_SESSION_SIZE_BYTES) {
        return errorResponse(
          `Session too large: ${(sizeBytes / 1024 / 1024).toFixed(1)}MB exceeds 50MB limit`,
        );
      }

      // Publish
      const api = createApiClient();
      const apiUrl = getApiBaseUrl();

      try {
        const result = await api.sessions.publish.mutate({
          title,
          conversation_data: content,
          is_public,
          access_token: token,
        });

        const pollResult = await pollForProcessing(result.id, apiUrl);

        if (!pollResult.success) {
          return errorResponse(pollResult.error);
        }

        return successResponse({ id: result.id, url: pollResult.url });
      } catch (error) {
        return errorResponse(
          error instanceof Error ? error.message : String(error),
        );
      }
    },
  );
};
