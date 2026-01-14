import { exec } from "node:child_process";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { startAuth } from "../auth.js";
import { writeConfig } from "../config.js";
import type { Config } from "../types.js";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const openUrl = (url: string) => {
  const platform = process.platform;
  const cmd =
    platform === "darwin" ? "open" : platform === "win32" ? "start" : "xdg-open";
  exec(`${cmd} "${url}"`);
};

const pollForCompletion = async (
  code: string,
  apiUrl: string,
  timeoutMs = 60_000,
): Promise<
  | { success: true; token: string; refresh_token: string; user: { id: string; username: string; avatar_url: string } }
  | { success: false; error: string }
> => {
  const deadline = Date.now() + timeoutMs;
  const pollInterval = 2000;

  while (Date.now() < deadline) {
    try {
      const url = `${apiUrl}/api/trpc/auth.poll?input=${encodeURIComponent(JSON.stringify({ code }))}`;
      const res = await fetch(url);
      const json = await res.json();
      const result = json.result?.data;

      if (result?.status === "success") {
        return {
          success: true,
          token: result.token,
          refresh_token: result.refresh_token,
          user: result.user,
        };
      }

      if (result?.status === "expired") {
        return { success: false, error: "Authentication code expired" };
      }
    } catch {}

    await sleep(pollInterval);
  }

  return { success: false, error: "Authentication timed out" };
};

export const registerAuthenticate = (server: McpServer): void => {
  server.registerTool(
    "authenticate",
    {
      description:
        "Authenticate with Claudebin. Opens browser, waits for sign-in, saves credentials.",
    },
    async () => {
      const apiUrl = process.env.CLAUDEBIN_API_URL || "http://localhost:3000";

      // Start auth session
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

      // Open browser
      openUrl(startResult.url);

      // Poll for completion
      const pollResult = await pollForCompletion(startResult.code, apiUrl);

      if (!pollResult.success) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: pollResult.error,
              }),
            },
          ],
          isError: true,
        };
      }

      // Save config
      const config: Config = {
        auth: {
          token: pollResult.token,
          refresh_token: pollResult.refresh_token,
          expires_at: Date.now() + 30 * 24 * 60 * 60 * 1000,
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
            }),
          },
        ],
      };
    },
  );
};
