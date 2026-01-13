import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { Config } from "./types.js";

const CONFIG_DIR = path.join(os.homedir(), ".claudebin");
const CONFIG_PATH = path.join(CONFIG_DIR, "config.json");

export const getApiBaseUrl = (): string => {
  return process.env.CLAUDEBIN_API_URL || "http://localhost:3000";
};

export const readConfig = async (): Promise<Config> => {
  try {
    const content = await fs.readFile(CONFIG_PATH, "utf8");
    return JSON.parse(content) as Config;
  } catch {
    return {};
  }
};

export const writeConfig = async (config: Config): Promise<void> => {
  await fs.mkdir(CONFIG_DIR, { recursive: true, mode: 0o700 });
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), {
    mode: 0o600,
  });
};
