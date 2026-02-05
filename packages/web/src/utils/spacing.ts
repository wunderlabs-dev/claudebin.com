export type Spacing = "none" | "sm" | "md" | "lg";

export const spacingClassNames: Record<Spacing, string> = {
  none: "pt-0",
  sm: "pt-9",
  md: "pt-18 xl:pt-24",
  lg: "pt-32 xl:pt-48",
} as const;
