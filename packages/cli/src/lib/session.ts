import os from "node:os";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { not, isEmpty, isNil } from "ramda";

import { ONE_HOUR_MS } from "@/helpers/constants";
import { getProjectDirName, getFilesWithStats } from "@/helpers/utils";

export const getClaudeProjectPath = (projectDirName: string) => {
  return path.join(os.homedir(), ".claude", "projects", projectDirName);
};

export const findRecentSessionPath = (
  files: { file: string; mtime: Date }[],
  projectPath: string
) => {
  const [session] = files
    .filter((entry) => not(entry.file.startsWith("agent-")))
    .filter((entry) => entry.mtime.getTime() > Date.now() - ONE_HOUR_MS)
    .sort((file1, file2) => file2.mtime.getTime() - file1.mtime.getTime());

  if (isNil(session)) return null;
  return path.join(projectPath, session.file);
};

export const resolveSessionPath = async () => {
  const cwd = process.cwd();
  const projectDirName = getProjectDirName(cwd);
  const projectPath = getClaudeProjectPath(projectDirName);

  const files = await fs.readdir(projectPath);
  if (isEmpty(files)) return null;
  const filesWithStats = await getFilesWithStats(files, projectPath);

  return findRecentSessionPath(filesWithStats, projectPath);
};

export const readSessionContent = async () => {
  const sessionPath = await resolveSessionPath();
  if (isNil(sessionPath)) return null;

  return fs.readFile(sessionPath, "utf8");
};
