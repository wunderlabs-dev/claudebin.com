export type Spacing = "none" | "sm" | "lg";

export const spacingClassNames: Record<Spacing, string> = {
  none: "pt-0",
  sm: "pt-24",
  lg: "pt-48",
} as const;

export const THREAD_CARD_LAYOUTS = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
] as const;
