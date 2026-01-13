#!/usr/bin/env node
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

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

  const transport = new StdioServerTransport();
  await server.connect(transport);
};

main().catch(console.error);
