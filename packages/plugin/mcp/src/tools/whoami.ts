import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readConfig } from "../config.js";

export const registerWhoami = (server: McpServer): void => {
  server.tool(
    "whoami",
    "Check current Claudebin authentication status",
    {},
    async () => {
      const config = await readConfig();

      if (!config.auth?.token || !config.user) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ authenticated: false }),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              authenticated: true,
              username: config.user.username,
              avatar_url: config.user.avatar_url,
            }),
          },
        ],
      };
    },
  );
};
