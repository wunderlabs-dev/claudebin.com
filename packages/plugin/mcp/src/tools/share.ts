import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  getValidToken,
  POLL_INTERVAL_MS,
  runAuthFlow,
  SESSION_POLL_TIMEOUT_MS,
} from "../auth.js";
import { extractSession } from "../session.js";
import { createApiClient } from "../trpc.js";

const SessionStatus = {
  PROCESSING: "processing",
  READY: "ready",
  FAILED: "failed",
} as const;

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

type PollResult =
  | { success: true; url: string }
  | { success: false; error: string };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const pollForProcessing = async (
  sessionId: string,
  apiUrl: string,
  timeoutMs = SESSION_POLL_TIMEOUT_MS,
): Promise<PollResult> => {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const url = `${apiUrl}/api/trpc/sessions.poll?input=${encodeURIComponent(
        JSON.stringify({ id: sessionId }),
      )}`;
      const res = await fetch(url);
      const json = await res.json();
      const result = json.result?.data;

      if (result?.status === SessionStatus.READY) {
        return { success: true, url: result.url };
      }

      if (result?.status === SessionStatus.FAILED) {
        return { success: false, error: result.error || "Processing failed" };
      }
    } catch {
      // Network error, continue polling
    }

    await sleep(POLL_INTERVAL_MS);
  }

  return { success: false, error: "Processing timed out after 2 minutes" };
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

      if ("error" in sessionResult) {
        return errorResponse(sessionResult.error);
      }

      // Check size
      const sizeBytes = new TextEncoder().encode(sessionResult.content).length;
      if (sizeBytes > MAX_SIZE_BYTES) {
        return errorResponse(
          `Session too large: ${(sizeBytes / 1024 / 1024).toFixed(1)}MB exceeds 50MB limit`,
        );
      }

      // Publish
      const api = createApiClient();
      const apiUrl = process.env.CLAUDEBIN_API_URL || "http://localhost:3000";

      try {
        const result = await api.sessions.publish.mutate({
          title,
          conversation_data: sessionResult.content,
          is_public: is_public ?? true,
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
