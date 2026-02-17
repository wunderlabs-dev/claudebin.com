import { describe, expect, test } from "bun:test";

import { extractWorkingDir } from "./index";

describe("extractWorkingDir", () => {
  test("returns cwd from first line", () => {
    const jsonl =
      '{"type":"user","cwd":"/Users/john/projects/myapp","uuid":"1","parentUuid":null,"timestamp":"2025-01-01","message":{"content":"hi"}}\n{"type":"assistant","uuid":"2","parentUuid":"1","timestamp":"2025-01-01","message":{"content":"hello"}}';
    expect(extractWorkingDir(jsonl)).toBe("/Users/john/projects/myapp");
  });

  test("returns cwd from later line when first line has none", () => {
    const jsonl =
      '{"type":"user","uuid":"1","parentUuid":null,"timestamp":"2025-01-01","message":{"content":"hi"}}\n{"type":"assistant","cwd":"/Users/john/projects/myapp","uuid":"2","parentUuid":"1","timestamp":"2025-01-01","message":{"content":"hello"}}';
    expect(extractWorkingDir(jsonl)).toBe("/Users/john/projects/myapp");
  });

  test("returns null when no cwd field exists", () => {
    const jsonl =
      '{"type":"user","uuid":"1","parentUuid":null,"timestamp":"2025-01-01","message":{"content":"hi"}}\n{"type":"assistant","uuid":"2","parentUuid":"1","timestamp":"2025-01-01","message":{"content":"hello"}}';
    expect(extractWorkingDir(jsonl)).toBeNull();
  });

  test("returns Windows cwd value as-is", () => {
    const jsonl =
      '{"type":"user","cwd":"C:\\\\Users\\\\john\\\\projects\\\\myapp","uuid":"1","parentUuid":null,"timestamp":"2025-01-01","message":{"content":"hi"}}';
    expect(extractWorkingDir(jsonl)).toBe("C:\\Users\\john\\projects\\myapp");
  });

  test("skips empty lines", () => {
    const jsonl =
      '\n\n{"type":"user","cwd":"/tmp/project","uuid":"1","parentUuid":null,"timestamp":"2025-01-01","message":{"content":"hi"}}\n';
    expect(extractWorkingDir(jsonl)).toBe("/tmp/project");
  });

  test("skips malformed JSON lines", () => {
    const jsonl =
      'not json\n{"type":"user","cwd":"/tmp/project","uuid":"1","parentUuid":null,"timestamp":"2025-01-01","message":{"content":"hi"}}';
    expect(extractWorkingDir(jsonl)).toBe("/tmp/project");
  });
});
