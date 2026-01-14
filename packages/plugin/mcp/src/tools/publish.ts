import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getValidToken } from "../auth.js";
import { extractSession } from "../session.js";
import { createApiClient } from "../trpc.js";

// Matches SessionStatus from @claudebin/web/trpc/routers/sessions
const SessionStatus = {
  PROCESSING: "processing",
  READY: "ready",
  FAILED: "failed",
} as const;

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const pollForProcessing = async (
  sessionId: string,
  apiUrl: string,
  timeoutMs = 120_000, // 2 minutes
): Promise<{ success: true; url: string } | { success: false; error: string }> => {
  const deadline = Date.now() + timeoutMs;
  const pollInterval = 2000;

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

      // Still processing, continue polling
    } catch {
      // Network error, continue polling
    }

    await sleep(pollInterval);
  }

  return { success: false, error: "Processing timed out after 2 minutes" };
};

export const registerPublish = (server: McpServer): void => {
  server.registerTool(
    "publish",
    {
      description: "Publish the current Claude Code session to Claudebin",
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
      const token = await getValidToken();

      if (!token) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: "Not authenticated. Run /auth first.",
              }),
            },
          ],
          isError: true,
        };
      }

      const sessionResult = await extractSession(project_path);

      if ("error" in sessionResult) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: sessionResult.error,
              }),
            },
          ],
          isError: true,
        };
      }

      // Check size before upload
      const sizeBytes = new TextEncoder().encode(sessionResult.content).length;
      if (sizeBytes > MAX_SIZE_BYTES) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: `Session too large: ${(sizeBytes / 1024 / 1024).toFixed(1)}MB exceeds 50MB limit`,
              }),
            },
          ],
          isError: true,
        };
      }

      const api = createApiClient();
      const apiUrl = process.env.CLAUDEBIN_API_URL || "http://localhost:3000";

      try {
        // Phase 1: Upload
        const result = await api.sessions.publish.mutate({
          title,
          conversation_data: sessionResult.content,
          is_public: is_public ?? true,
          access_token: token,
        });

        // Phase 2: Poll for completion
        const pollResult = await pollForProcessing(result.id, apiUrl);

        if (!pollResult.success) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: false,
                  error: pollResult.error,
                  id: result.id,
                }),
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                id: result.id,
                url: pollResult.url,
              }),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
          isError: true,
        };
      }
    },
  );
};
