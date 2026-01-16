import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerShare } from "./share.js";

export const registerAllTools = (server: McpServer): void => {
  registerShare(server);
};
