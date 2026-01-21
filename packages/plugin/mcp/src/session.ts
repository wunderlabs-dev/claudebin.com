import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { FileWithStats } from "./types.js";

const NON_ALPHANUMERIC_PATTERN = /[^a-zA-Z0-9]/g;

const normalizeProjectPath = (projectPath: string): string => {
  return projectPath.replace(NON_ALPHANUMERIC_PATTERN, "-");
};

const getClaudeProjectPath = (normalizedPath: string): string => {
  return path.join(os.homedir(), ".claude", "projects", normalizedPath);
};

const getFilesWithStats = async (
  files: string[],
  directoryPath: string,
): Promise<FileWithStats[]> => {
  return Promise.all(
    files.map(async (file) => {
      const filePath = path.join(directoryPath, file);
      const stats = await fs.stat(filePath);
      return { file, mtime: stats.mtime };
    }),
  );
};

const findMostRecentSession = (files: FileWithStats[]): string | null => {
  const sessions = files
    .filter((entry) => entry.file.endsWith(".jsonl"))
    .filter((entry) => !entry.file.startsWith("agent-"))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

  return sessions.length > 0 ? sessions[0].file : null;
};

/**
 * Extract the most recent Claude session content for a project.
 * Throws if no session is found.
 */
const extract = async (projectPath: string): Promise<string> => {
  const normalizedPath = normalizeProjectPath(projectPath);
  const claudeProjectPath = getClaudeProjectPath(normalizedPath);

  try {
    await fs.access(claudeProjectPath);
  } catch {
    throw new Error(
      `No Claude sessions found for project path: ${projectPath}`,
    );
  }

  const files = await fs.readdir(claudeProjectPath);

  if (files.length === 0) {
    throw new Error(`No session files found in: ${claudeProjectPath}`);
  }

  const filesWithStats = await getFilesWithStats(files, claudeProjectPath);
  const mostRecentSession = findMostRecentSession(filesWithStats);

  if (!mostRecentSession) {
    throw new Error(
      `No valid session files found (excluding agent-* files) in: ${claudeProjectPath}`,
    );
  }

  const sessionPath = path.join(claudeProjectPath, mostRecentSession);
  return fs.readFile(sessionPath, "utf8");
};

export const session = { extract };
