import os from "node:os";
import path from "node:path";

export const ONE_HOUR_MS = 60 * 60 * 1000;
export const NON_ALPHANUMERIC_PATTERN = /[^a-zA-Z0-9]/g;

export const CONFIG_INDENT = 2;
export const CONFIG_DIR = path.join(os.homedir(), ".claudebin");
export const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");
