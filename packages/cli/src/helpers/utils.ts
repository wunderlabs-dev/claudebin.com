import fs from "node:fs/promises";
import path from "node:path";

import { NON_ALPHANUMERIC_PATTERN } from "@/helpers/constants";

export const getProjectDirName = (path: string) => {
  return path.replace(NON_ALPHANUMERIC_PATTERN, "-");
};

export const getFilesWithStats = async (
  files: string[],
  historyPath: string
) => {
  return Promise.all(
    files.map(async (file) => {
      const filePath = path.join(historyPath, file);
      const stats = await fs.stat(filePath);

      return {
        file,
        mtime: stats.mtime,
      };
    })
  );
};
