import { describe, expect, test } from "bun:test";

import { sanitizeResult, toRelativePath } from "./transforms";

describe("toRelativePath", () => {
  describe("Unix paths", () => {
    test("extracts packages/ segment", () => {
      expect(toRelativePath("/Users/john/projects/myapp/packages/core/index.ts")).toBe(
        "packages/core/index.ts",
      );
    });

    test("extracts src/ segment", () => {
      expect(toRelativePath("/Users/john/projects/myapp/src/utils/helpers.ts")).toBe(
        "src/utils/helpers.ts",
      );
    });

    test("extracts filename with known extension", () => {
      expect(toRelativePath("/Users/john/projects/myapp/config.json")).toBe("config.json");
    });

    test("strips /Users/username/project/repo/ prefix as fallback", () => {
      expect(toRelativePath("/Users/john/projects/myapp/lib/foo.py")).toBe("lib/foo.py");
    });
  });

  describe("Windows paths with backslashes", () => {
    test("extracts packages/ segment", () => {
      expect(toRelativePath("C:\\Users\\john\\projects\\myapp\\packages\\core\\index.ts")).toBe(
        "packages/core/index.ts",
      );
    });

    test("extracts src/ segment", () => {
      expect(toRelativePath("C:\\Users\\john\\projects\\myapp\\src\\utils\\helpers.ts")).toBe(
        "src/utils/helpers.ts",
      );
    });

    test("extracts filename with known extension", () => {
      expect(toRelativePath("C:\\Users\\john\\projects\\myapp\\config.json")).toBe("config.json");
    });

    test("strips C:\\Users\\username\\project\\repo\\ prefix as fallback", () => {
      expect(toRelativePath("C:\\Users\\john\\projects\\myapp\\lib\\foo.py")).toBe("lib/foo.py");
    });

    test("handles D: drive letter", () => {
      expect(toRelativePath("D:\\Users\\john\\projects\\myapp\\src\\app.tsx")).toBe("src/app.tsx");
    });
  });

  describe("Windows paths with forward slashes", () => {
    test("extracts src/ segment from drive-letter path", () => {
      expect(toRelativePath("C:/Users/john/projects/myapp/src/utils/helpers.ts")).toBe(
        "src/utils/helpers.ts",
      );
    });

    test("strips C:/Users/username/project/repo/ prefix as fallback", () => {
      expect(toRelativePath("C:/Users/john/projects/myapp/lib/foo.py")).toBe("lib/foo.py");
    });
  });
});

describe("sanitizeResult", () => {
  describe("strips Unix paths in free text", () => {
    test("strips /Users/ paths from bash output", () => {
      const input = "Error in /Users/john/projects/myapp/src/index.ts:42";
      const result = sanitizeResult("Bash", input);
      expect(result).not.toContain("/Users/john");
      expect(result).toContain("src/index.ts:42");
    });
  });

  describe("strips Windows paths in free text", () => {
    test("strips C:\\Users\\ paths from bash output", () => {
      const input = "Error in C:\\Users\\john\\projects\\myapp\\src\\index.ts:42";
      const result = sanitizeResult("Bash", input);
      expect(result).not.toContain("\\Users\\john");
      expect(result).toContain("src/index.ts");
    });

    test("strips C:/Users/ paths from bash output", () => {
      const input = "Error in C:/Users/john/projects/myapp/src/index.ts:42";
      const result = sanitizeResult("Bash", input);
      expect(result).not.toContain("C:/Users/john");
      expect(result).toContain("src/index.ts");
    });

    test("strips multiple Windows paths in one string", () => {
      const input = "Comparing C:\\Users\\john\\src\\a.ts and C:\\Users\\john\\src\\b.ts";
      const result = sanitizeResult("Bash", input);
      expect(result).not.toContain("\\Users\\john");
      expect(result).toContain("src/a.ts");
      expect(result).toContain("src/b.ts");
    });

    test("handles mixed Unix and Windows paths", () => {
      const input =
        "Unix: /Users/john/projects/app/src/a.ts Windows: C:\\Users\\john\\projects\\app\\src\\b.ts";
      const result = sanitizeResult("Bash", input);
      expect(result).not.toContain("/Users/john");
      expect(result).not.toContain("\\Users\\john");
    });
  });

  describe("strips system reminders", () => {
    test("removes system-reminder tags", () => {
      const input = "output <system-reminder>secret</system-reminder> more";
      const result = sanitizeResult("Bash", input);
      expect(result).not.toContain("system-reminder");
      expect(result).not.toContain("secret");
    });
  });
});
