// ABOUTME: Whitelist-based URL sanitizer to prevent XSS via javascript:, data:, vbscript: protocols
const SAFE_URL_PATTERN = /^(https?:|mailto:|\/|#)/i;

export const sanitizeUrl = (url: string | undefined): string => {
  if (!url) return "";
  const trimmed = url.replace(/^[\s\t\n\r]+/, "");
  if (!trimmed) return "";
  return SAFE_URL_PATTERN.test(trimmed) ? url : "";
};
