import fs from "node:fs/promises";
import path from "node:path";

import {
  CONFIG_DIR,
  CONFIG_FILE,
  CONFIG_INDENT,
  NON_ALPHANUMERIC_PATTERN,
} from "@/helpers/constants";

type Config = {
  token?: string;
};

export const getProjectDirName = (path: string) => {
  return path.replace(NON_ALPHANUMERIC_PATTERN, "-");
};

export const getFilesWithStats = async (
  files: string[],
  historyPath: string,
) => {
  return Promise.all(
    files.map(async (file) => {
      const filePath = path.join(historyPath, file);
      const stats = await fs.stat(filePath);

      return {
        file,
        mtime: stats.mtime,
      };
    }),
  );
};

export const readConfig = async (): Promise<Config | null> => {
  try {
    await fs.access(CONFIG_FILE);
  } catch {
    return null;
  }

  const fileContent = await fs.readFile(CONFIG_FILE, "utf8");
  const config = JSON.parse(fileContent);

  return config;
};

export const writeConfig = async <T>(config: T): Promise<void> => {
  try {
    await fs.access(CONFIG_DIR);
  } catch {
    await fs.mkdir(CONFIG_DIR, { recursive: true });
  }

  const existingConfig = await readConfig();

  return fs.writeFile(
    CONFIG_FILE,
    JSON.stringify({ ...existingConfig, ...config }, null, CONFIG_INDENT),
    "utf8",
  );
};
