import { spawn } from "node:child_process";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { startAuth } from "../auth.js";
import { writeConfig } from "../config.js";
import type { Config } from "../types.js";

const getStatusFilePath = (code: string) =>
  join(tmpdir(), `claudebin-auth-${code}.json`);

export const registerAuthenticate = (server: McpServer): void => {
  server.registerTool(
    "auth_start",
    {
      description:
        "Start Claudebin authentication. Returns URL immediately and polls in background.",
    },
    async () => {
      const result = await startAuth();

      if (!result.success) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: result.error,
              }),
            },
          ],
          isError: true,
        };
      }

      const statusFile = getStatusFilePath(result.code);
      writeFileSync(statusFile, JSON.stringify({ status: "pending" }));

      const pollerScript = `
        const { createTRPCClient, httpLink } = require("@trpc/client");
        const fs = require("fs");

        const statusFile = "${statusFile}";
        const code = "${result.code}";
        const deadline = Date.now() + 5 * 60 * 1000;
        const pollInterval = 2000;

        const api = createTRPCClient({
          links: [httpLink({ url: "${process.env.CLAUDEBIN_API_URL || "http://localhost:3000"}/api/trpc" })],
        });

        const poll = async () => {
          if (Date.now() >= deadline) {
            fs.writeFileSync(statusFile, JSON.stringify({ status: "timeout" }));
            process.exit(0);
          }

          try {
            const result = await api.auth.poll.query({ code });
            if (result.status === "success") {
              fs.writeFileSync(statusFile, JSON.stringify({
                status: "success",
                token: result.token,
                refresh_token: result.refresh_token,
                user: result.user,
              }));
              process.exit(0);
            } else if (result.status === "expired") {
              fs.writeFileSync(statusFile, JSON.stringify({ status: "expired" }));
              process.exit(0);
            }
          } catch (e) {}

          setTimeout(poll, pollInterval);
        };

        poll();
      `;

      // Spawn background process
      const child = spawn("node", ["-e", pollerScript], {
        detached: true,
        stdio: "ignore",
        env: { ...process.env },
      });
      child.unref();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              code: result.code,
              url: result.url,
            }),
          },
        ],
      };
    },
  );

  server.registerTool(
    "auth_status",
    {
      description: "Check authentication status. Call after auth_start.",
      inputSchema: {
        code: z.string().describe("The auth code from auth_start"),
      },
    },
    async ({ code }) => {
      const statusFile = getStatusFilePath(code);

      if (!existsSync(statusFile)) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "not_found",
                error: "No auth session found for this code",
              }),
            },
          ],
          isError: true,
        };
      }

      const data = JSON.parse(readFileSync(statusFile, "utf-8"));

      if (data.status === "success") {
        // Save config and cleanup
        const config: Config = {
          auth: {
            token: data.token,
            refresh_token: data.refresh_token,
            expires_at: Date.now() + 30 * 24 * 60 * 60 * 1000,
          },
          user: data.user,
        };
        await writeConfig(config);

        try {
          unlinkSync(statusFile);
        } catch {}

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "success",
                username: data.user.username,
              }),
            },
          ],
        };
      }

      if (data.status === "expired" || data.status === "timeout") {
        try {
          unlinkSync(statusFile);
        } catch {}

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: data.status,
                error:
                  data.status === "expired"
                    ? "Authentication code expired"
                    : "Authentication timed out",
              }),
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ status: "pending" }),
          },
        ],
      };
    },
  );
};
