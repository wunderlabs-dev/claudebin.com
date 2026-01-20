import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export type Spacing = "none" | "sm" | "lg";

export const spacingClassNames: Record<Spacing, string> = {
  none: "pt-0",
  sm: "pt-24",
  lg: "pt-48",
};
