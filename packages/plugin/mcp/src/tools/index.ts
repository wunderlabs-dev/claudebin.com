import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAuthenticate } from "./authenticate.js";
import { registerExtractSession } from "./extract-session.js";
import { registerLogout } from "./logout.js";
import { registerPublish } from "./publish.js";
import { registerWhoami } from "./whoami.js";

export const registerAllTools = (server: McpServer): void => {
  registerExtractSession(server);
  registerAuthenticate(server);
  registerWhoami(server);
  registerLogout(server);
  registerPublish(server);
};
