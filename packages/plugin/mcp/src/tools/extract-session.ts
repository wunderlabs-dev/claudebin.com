import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { extractSession } from "../session.js";

export const registerExtractSession = (server: McpServer): void => {
  server.registerTool(
    "extract_session",
    {
      description:
        "Extract the most recent Claude Code session for a project as raw JSONL",
      inputSchema: {
        project_path: z
          .string()
          .describe("Absolute path to the project directory"),
      },
    },
    async ({ project_path }) => {
      const result = await extractSession(project_path);

      if ("error" in result) {
        return {
          content: [{ type: "text", text: result.error }],
          isError: true,
        };
      }

      return {
        content: [{ type: "text", text: result.content }],
      };
    },
  );
};
