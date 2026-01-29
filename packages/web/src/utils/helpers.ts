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
