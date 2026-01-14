import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getValidToken } from "../auth.js";
import { extractSession } from "../session.js";
import { createApiClient } from "../trpc.js";

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
                error: "Not authenticated. Run authenticate first.",
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

      const api = createApiClient();

      try {
        const result = await api.sessions.publish.mutate({
          title,
          conversation_data: sessionResult.content,
          is_public: is_public ?? true,
          access_token: token,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                id: result.id,
                url: result.url,
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
