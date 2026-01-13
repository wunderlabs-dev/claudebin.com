import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pollForAuth, startAuth } from "../auth.js";
import { writeConfig } from "../config.js";
import type { Config } from "../types.js";

export const registerAuthenticate = (server: McpServer): void => {
  server.tool(
    "authenticate",
    "Authenticate with Claudebin using the device authorization flow. Returns a URL for the user to visit, then polls for completion.",
    {},
    async () => {
      const startResult = await startAuth();

      if (!startResult.success) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: startResult.error,
              }),
            },
          ],
          isError: true,
        };
      }

      const pollResult = await pollForAuth(startResult.code);

      if (pollResult.status === "expired") {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: "Authentication code expired",
              }),
            },
          ],
          isError: true,
        };
      }

      if (pollResult.status === "timeout") {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: "Authentication timed out after 5 minutes",
                url: startResult.url,
              }),
            },
          ],
          isError: true,
        };
      }

      const config: Config = {
        auth: {
          token: pollResult.token,
          expires_at: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
        },
        user: pollResult.user,
      };

      await writeConfig(config);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              username: pollResult.user.username,
              url: startResult.url,
            }),
          },
        ],
      };
    },
  );
};
