import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readConfig, writeConfig } from "../config.js";

export const registerLogout = (server: McpServer): void => {
  server.registerTool(
    "logout",
    { description: "Clear Claudebin credentials" },
    async () => {
      try {
        const config = await readConfig();

        delete config.auth;
        delete config.user;

        await writeConfig(config);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: true }),
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
                error: `Failed to clear credentials: ${error instanceof Error ? error.message : String(error)}`,
              }),
            },
          ],
          isError: true,
        };
      }
    },
  );
};
