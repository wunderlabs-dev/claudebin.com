const createLogger = (module: string) => ({
  error: (message: string, error?: unknown) => {
    console.error(`[${module}] ${message}`, error ?? "");
  },
  warn: (message: string, data?: unknown) => {
    console.warn(`[${module}] ${message}`, data ?? "");
  },
  info: (message: string, data?: unknown) => {
    console.info(`[${module}] ${message}`, data ?? "");
  },
});

export const logger = {
  parser: createLogger("parser"),
  sessions: createLogger("sessions"),
  auth: createLogger("auth"),
  pixel: createLogger("pixel"),
};
