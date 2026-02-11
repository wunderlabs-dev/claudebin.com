export type MediaQuery = "sm" | "md" | "lg" | "xl" | "2xl";

export const mediaQueries: Record<MediaQuery, string> = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
} as const;
