import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createApiClient, type SessionsPollResponse } from "./api.js";
import { auth } from "./auth.js";
import { MAX_SESSION_SIZE_BYTES, POLL_INTERVAL_MS, SESSION_POLL_TIMEOUT_MS } from "./constants.js";
import { session } from "./session.js";
import { poll, safeOpenUrl } from "./utils.js";

const isSessionReady = (
  data: SessionsPollResponse,
): data is Extract<SessionsPollResponse, { status: "ready" }> => {
  return data.status === "ready";
};

const isSessionFailed = (
  data: SessionsPollResponse,
): data is Extract<SessionsPollResponse, { status: "failed" }> => {
  return data.status === "failed";
};

const pollForProcessing = async (
  sessionId: string,
  timeoutMs = SESSION_POLL_TIMEOUT_MS,
): Promise<string> => {
  const api = createApiClient();

  const result = await poll<SessionsPollResponse>({
    fn: () => api.sessions.poll(sessionId),
    isSuccess: isSessionReady,
    isFailure: isSessionFailed,
    getFailureError: (data) => (isSessionFailed(data) ? data.error : "Processing failed"),
    intervalMs: POLL_INTERVAL_MS,
    timeoutMs,
    timeoutError: "Processing timed out after 2 minutes",
  });

  if (!isSessionReady(result)) {
    throw new Error("Invalid session response");
  }

  return result.url;
};

const registerShare = (server: McpServer): void => {
  server.registerTool(
    "share",
    {
      description:
        "Share the current Claude Code session to Claudebin. Authenticates automatically if needed.",
      inputSchema: {
        project_path: z.string().describe("Absolute path to the project directory"),
        title: z.string().optional().describe("Optional title for the session"),
        is_public: z
          .boolean()
          .default(true)
          .describe(
            "Whether the session appears in public listings (false = unlisted, accessible via link)",
          ),
      },
    },
    async ({ project_path, title, is_public }) => {
      try {
        const token = await auth.getToken();
        const content = await session.extract(project_path);

        const sizeBytes = new TextEncoder().encode(content).length;
        if (sizeBytes > MAX_SESSION_SIZE_BYTES) {
          throw new Error(
            `Session too large: ${(sizeBytes / 1024 / 1024).toFixed(1)}MB exceeds 50MB limit`,
          );
        }

        const api = createApiClient();

        const result = await api.sessions.publish({
          title,
          conversation_data: content,
          is_public,
          access_token: token,
        });

        const url = await pollForProcessing(result.id);
        safeOpenUrl(url);

        return {
          content: [{ type: "text" as const, text: url }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text: error instanceof Error ? error.message : String(error),
            },
          ],
          isError: true,
        };
      }
    },
  );
};

export const registerAllTools = (server: McpServer): void => {
  registerShare(server);
};
