import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { auth } from "../auth.js";
import { getApiBaseUrl } from "../config.js";
import {
  MAX_SESSION_SIZE_BYTES,
  POLL_INTERVAL_MS,
  SESSION_POLL_TIMEOUT_MS,
  SessionStatus,
} from "../constants.js";
import { session } from "../session.js";
import { createApiClient } from "../trpc.js";
import { poll, safeOpenUrl } from "../utils.js";

interface SessionPollData {
  status: string;
  url?: string;
  error?: string;
}

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
): Promise<string> => {
  const result = await poll<SessionPollData>({
    fn: () => fetchSessionPollData(sessionId, apiUrl),
    isSuccess: (data) => data.status === SessionStatus.READY && data.url !== undefined,
    isFailure: (data) => data.status === SessionStatus.FAILED,
    getFailureError: (data) => data.error || "Processing failed",
    intervalMs: POLL_INTERVAL_MS,
    timeoutMs,
    timeoutError: "Processing timed out after 2 minutes",
  });

  if (!result.url) {
    throw new Error("Invalid session response");
  }

  return result.url;
};

export const registerShare = (server: McpServer): void => {
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
        const apiUrl = getApiBaseUrl();

        const result = await api.sessions.publish.mutate({
          title,
          conversation_data: content,
          is_public,
          access_token: token,
        });

        const url = await pollForProcessing(result.id, apiUrl);
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
