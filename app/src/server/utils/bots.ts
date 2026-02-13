import { createHash } from "node:crypto";

// ABOUTME: Bot patterns covering major crawlers, headless browsers, and SEO tools
const BOT_PATTERNS = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /slurp/i,
  /mediapartners/i,
  /headlesschrome/i,
  /lighthouse/i,
  /pagespeed/i,
  /prerender/i,
];

export const isBot = (userAgent: string | null): boolean => {
  if (!userAgent) return true;
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
};

export const getVisitorHash = (ip: string | null, userAgent: string | null): string => {
  const fingerprint = `${ip ?? "unknown"}:${userAgent ?? "unknown"}`;
  return createHash("sha256").update(fingerprint).digest("hex").slice(0, 16);
};

export const getClientIp = (headers: Headers): string | null => {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headers.get("x-real-ip") ?? null;
};
