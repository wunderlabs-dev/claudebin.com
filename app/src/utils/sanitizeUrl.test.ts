import { describe, expect, test } from "bun:test";
import { sanitizeUrl } from "./sanitizeUrl";

describe("sanitizeUrl", () => {
  test("allows https URLs", () => {
    expect(sanitizeUrl("https://example.com")).toBe("https://example.com");
  });

  test("allows http URLs", () => {
    expect(sanitizeUrl("http://example.com")).toBe("http://example.com");
  });

  test("allows mailto URLs", () => {
    expect(sanitizeUrl("mailto:user@example.com")).toBe("mailto:user@example.com");
  });

  test("allows relative URLs", () => {
    expect(sanitizeUrl("/path/to/page")).toBe("/path/to/page");
  });

  test("allows fragment URLs", () => {
    expect(sanitizeUrl("#section")).toBe("#section");
  });

  test("blocks javascript: protocol", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBe("");
  });

  test("blocks javascript: with uppercase", () => {
    expect(sanitizeUrl("JavaScript:alert(1)")).toBe("");
  });

  test("blocks javascript: with mixed case", () => {
    expect(sanitizeUrl("jAvAsCrIpT:alert(1)")).toBe("");
  });

  test("blocks javascript: with leading whitespace", () => {
    expect(sanitizeUrl("  javascript:alert(1)")).toBe("");
  });

  test("blocks javascript: with tabs and newlines", () => {
    expect(sanitizeUrl("\t\njavascript:alert(1)")).toBe("");
  });

  test("blocks vbscript: protocol", () => {
    expect(sanitizeUrl("vbscript:msgbox('xss')")).toBe("");
  });

  test("blocks data: protocol", () => {
    expect(sanitizeUrl("data:text/html,<script>alert(1)</script>")).toBe("");
  });

  test("blocks data: with base64", () => {
    expect(sanitizeUrl("data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==")).toBe("");
  });

  test("returns empty string for undefined", () => {
    expect(sanitizeUrl(undefined)).toBe("");
  });

  test("returns empty string for empty string", () => {
    expect(sanitizeUrl("")).toBe("");
  });

  test("allows URLs with query params", () => {
    expect(sanitizeUrl("https://example.com?q=test&foo=bar")).toBe(
      "https://example.com?q=test&foo=bar",
    );
  });

  test("allows URLs with hash fragments", () => {
    expect(sanitizeUrl("https://example.com/page#section")).toBe(
      "https://example.com/page#section",
    );
  });
});
