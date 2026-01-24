import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const hashString = (str: string): number => {
  return Math.abs(
    Array.from(str).reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0),
  );
};

// ABOUTME: Extracts project name from working directory path (last segment)
export const getProjectName = (workingDir: string | null): string => {
  if (!workingDir) return "Unknown";
  const segments = workingDir.split("/").filter(Boolean);
  return segments[segments.length - 1] || "Unknown";
};
