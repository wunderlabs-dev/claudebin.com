#!/usr/bin/env node
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Config types
interface UserConfig {
  id: string;
  username: string;
  avatar_url: string;
}

interface AuthConfig {
  token: string;
  expires_at: number;
}

interface Config {
  auth?: AuthConfig;
  user?: UserConfig;
}

// Config helpers
const CONFIG_DIR = path.join(os.homedir(), ".claudebin");
const CONFIG_PATH = path.join(CONFIG_DIR, "config.json");

const getApiBaseUrl = (): string => {
  return process.env.CLAUDEBIN_API_URL || "http://localhost:3000";
};

const readConfig = async (): Promise<Config> => {
  try {
    const content = await fs.readFile(CONFIG_PATH, "utf8");
    return JSON.parse(content) as Config;
  } catch {
    return {};
  }
};

const writeConfig = async (config: Config): Promise<void> => {
  await fs.mkdir(CONFIG_DIR, { recursive: true, mode: 0o700 });
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), {
    mode: 0o600,
  });
};

// Polling helpers
const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

interface AuthStartResponse {
  code: string;
  url: string;
  expires_at: string;
}

interface AuthPollPending {
  status: "pending";
}

interface AuthPollSuccess {
  status: "success";
  token: string;
  user: UserConfig;
}

interface AuthPollExpired {
  status: "expired";
}

type AuthPollResponse = AuthPollPending | AuthPollSuccess | AuthPollExpired;

const NON_ALPHANUMERIC_PATTERN = /[^a-zA-Z0-9]/g;

const normalizeProjectPath = (projectPath: string): string => {
  return projectPath.replace(NON_ALPHANUMERIC_PATTERN, "-");
};

const getClaudeProjectPath = (normalizedPath: string): string => {
  return path.join(os.homedir(), ".claude", "projects", normalizedPath);
};

const getFilesWithStats = async (files: string[], directoryPath: string) => {
  return Promise.all(
    files.map(async (file) => {
      const filePath = path.join(directoryPath, file);
      const stats = await fs.stat(filePath);
      return { file, mtime: stats.mtime };
    }),
  );
};

const findMostRecentSession = (
  files: { file: string; mtime: Date }[],
): string | null => {
  const sessions = files
    .filter((entry) => entry.file.endsWith(".jsonl"))
    .filter((entry) => !entry.file.startsWith("agent-"))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

  return sessions.length > 0 ? sessions[0].file : null;
};

const extractSession = async (
  projectPath: string,
): Promise<{ content: string } | { error: string }> => {
  const normalizedPath = normalizeProjectPath(projectPath);
  const claudeProjectPath = getClaudeProjectPath(normalizedPath);

  try {
    await fs.access(claudeProjectPath);
  } catch {
    return {
      error: `No Claude sessions found for project path: ${projectPath}`,
    };
  }

  const files = await fs.readdir(claudeProjectPath);

  if (files.length === 0) {
    return {
      error: `No session files found in: ${claudeProjectPath}`,
    };
  }

  const filesWithStats = await getFilesWithStats(files, claudeProjectPath);
  const mostRecentSession = findMostRecentSession(filesWithStats);

  if (!mostRecentSession) {
    return {
      error: `No valid session files found (excluding agent-* files) in: ${claudeProjectPath}`,
    };
  }

  const sessionPath = path.join(claudeProjectPath, mostRecentSession);
  const content = await fs.readFile(sessionPath, "utf8");

  return { content };
};

const main = async () => {
  const server = new McpServer({
    name: "claudebin",
    version: "0.1.0",
  });

  server.tool(
    "extract_session",
    "Extract the most recent Claude Code session for a project as raw JSONL",
    {
      project_path: z
        .string()
        .describe("Absolute path to the project directory"),
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

  server.tool(
    "authenticate",
    "Authenticate with Claudebin using the device authorization flow. Returns a URL for the user to visit, then polls for completion.",
    {},
    async () => {
      const baseUrl = getApiBaseUrl();

      // Step 1: Start auth flow
      let startResponse: AuthStartResponse;
      try {
        const response = await fetch(`${baseUrl}/api/auth/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: false,
                  error: `Failed to start authentication: ${response.statusText}`,
                }),
              },
            ],
            isError: true,
          };
        }

        startResponse = (await response.json()) as AuthStartResponse;
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: `Failed to connect to Claudebin: ${error instanceof Error ? error.message : String(error)}`,
              }),
            },
          ],
          isError: true,
        };
      }

      // Step 2: Return URL to user and start polling
      const startTime = Date.now();

      while (Date.now() - startTime < POLL_TIMEOUT_MS) {
        await sleep(POLL_INTERVAL_MS);

        try {
          const pollResponse = await fetch(
            `${baseUrl}/api/auth/poll?code=${startResponse.code}`,
          );

          if (!pollResponse.ok) {
            continue;
          }

          const pollResult = (await pollResponse.json()) as AuthPollResponse;

          if (pollResult.status === "pending") {
            continue;
          }

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

          if (pollResult.status === "success") {
            // Save to config
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
                    url: startResponse.url,
                  }),
                },
              ],
            };
          }
        } catch {}
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: "Authentication timed out after 5 minutes",
              url: startResponse.url,
            }),
          },
        ],
        isError: true,
      };
    },
  );

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

  server.tool("logout", "Clear Claudebin credentials", {}, async () => {
    try {
      const config = await readConfig();

      // Clear auth section but preserve any other config
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
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
};

main().catch(console.error);
