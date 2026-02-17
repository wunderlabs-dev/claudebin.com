import { describe, expect, test } from "bun:test";

import { createTransforms } from "./transforms";

describe("createTransforms", () => {
  describe("with workingDir", () => {
    const workingDir = "/Users/john/projects/myapp";
    const t = createTransforms(workingDir);

    describe("toRelativePath", () => {
      test("converts absolute path to project-relative", () => {
        expect(t.toRelativePath("/Users/john/projects/myapp/src/index.ts")).toBe("src/index.ts");
      });

      test("handles root-level files", () => {
        expect(t.toRelativePath("/Users/john/projects/myapp/package.json")).toBe("package.json");
      });

      test("handles deeply nested paths", () => {
        expect(t.toRelativePath("/Users/john/projects/myapp/packages/core/lib/utils.py")).toBe(
          "packages/core/lib/utils.py",
        );
      });

      test("falls back for paths outside workingDir", () => {
        const result = t.toRelativePath("/Users/john/other/file.ts");
        expect(result).not.toContain("/Users/john");
        expect(result).toBe("other/file.ts");
      });

      test("returns path as-is when no home dir prefix and outside workingDir", () => {
        expect(t.toRelativePath("/tmp/file.ts")).toBe("/tmp/file.ts");
      });
    });
  });

  describe("with Windows workingDir", () => {
    const t = createTransforms("C:\\Users\\john\\projects\\myapp");

    test("converts Windows absolute path to project-relative", () => {
      expect(t.toRelativePath("C:\\Users\\john\\projects\\myapp\\src\\index.ts")).toBe(
        "src/index.ts",
      );
    });

    test("converts Windows path with forward slashes", () => {
      expect(t.toRelativePath("C:/Users/john/projects/myapp/src/index.ts")).toBe("src/index.ts");
    });

    test("handles root-level files", () => {
      expect(t.toRelativePath("C:\\Users\\john\\projects\\myapp\\config.json")).toBe("config.json");
    });

    test("handles D: drive letter outside workingDir", () => {
      expect(t.toRelativePath("D:\\other\\file.ts")).toBe("/other/file.ts");
    });
  });

  describe("with Linux workingDir", () => {
    const t = createTransforms("/home/john/projects/myapp");

    test("converts absolute path to project-relative", () => {
      expect(t.toRelativePath("/home/john/projects/myapp/src/index.ts")).toBe("src/index.ts");
    });

    test("falls back for paths outside workingDir", () => {
      expect(t.toRelativePath("/home/john/other/file.ts")).toBe("other/file.ts");
    });
  });

  describe("without workingDir (null)", () => {
    const t = createTransforms(null);

    test("strips macOS home dir prefix", () => {
      expect(t.toRelativePath("/Users/john/projects/myapp/src/file.ts")).toBe(
        "projects/myapp/src/file.ts",
      );
    });

    test("strips Linux home dir prefix", () => {
      expect(t.toRelativePath("/home/john/projects/myapp/src/file.ts")).toBe(
        "projects/myapp/src/file.ts",
      );
    });

    test("strips Windows home dir prefix", () => {
      expect(t.toRelativePath("C:\\Users\\john\\projects\\myapp\\src\\file.ts")).toBe(
        "projects/myapp/src/file.ts",
      );
    });

    test("returns normalized path when no home dir prefix", () => {
      expect(t.toRelativePath("/tmp/file.ts")).toBe("/tmp/file.ts");
    });
  });

  describe("sanitizeResult", () => {
    const t = createTransforms("/Users/john/projects/myapp");

    test("strips Unix paths from bash output", () => {
      const result = t.sanitizeResult(
        "Bash",
        "Error in /Users/john/projects/myapp/src/index.ts:42",
      );
      expect(result).not.toContain("/Users/john");
      expect(result).toContain("src/index.ts:42");
    });

    test("strips Windows paths from bash output", () => {
      const result = t.sanitizeResult(
        "Bash",
        "Error in C:\\Users\\john\\projects\\myapp\\src\\index.ts:42",
      );
      expect(result).not.toContain("Users\\john");
      expect(result).toContain("src/index.ts");
    });

    test("strips mixed paths", () => {
      const result = t.sanitizeResult(
        "Bash",
        "Unix: /Users/john/projects/myapp/src/a.ts Win: C:\\Users\\john\\projects\\myapp\\src\\b.ts",
      );
      expect(result).not.toContain("/Users/john");
      expect(result).not.toContain("\\Users\\john");
    });

    test("strips Linux /home/ paths from bash output", () => {
      const tLinux = createTransforms("/home/john/projects/myapp");
      const result = tLinux.sanitizeResult(
        "Bash",
        "Error in /home/john/projects/myapp/src/index.ts:42",
      );
      expect(result).not.toContain("/home/john");
      expect(result).toContain("src/index.ts:42");
    });

    test("removes system-reminder tags", () => {
      const result = t.sanitizeResult(
        "Bash",
        "output <system-reminder>secret</system-reminder> more",
      );
      expect(result).not.toContain("system-reminder");
      expect(result).not.toContain("secret");
    });
  });

  describe("transformToolUse", () => {
    const t = createTransforms("/Users/john/projects/myapp");

    test("relativizes file_path in Read tool", () => {
      const block = t.transformToolUse("id1", "Read", {
        file_path: "/Users/john/projects/myapp/src/index.ts",
      });
      expect(block).toMatchObject({
        type: "file_read",
        file_path: "src/index.ts",
      });
    });

    test("relativizes file_path in Write tool", () => {
      const block = t.transformToolUse("id2", "Write", {
        file_path: "/Users/john/projects/myapp/src/main.ts",
        content: "hello",
      });
      expect(block).toMatchObject({
        type: "file_write",
        file_path: "src/main.ts",
      });
    });

    test("relativizes file_path in Edit tool", () => {
      const block = t.transformToolUse("id3", "Edit", {
        file_path: "/Users/john/projects/myapp/src/utils.ts",
        old_string: "a",
        new_string: "b",
      });
      expect(block).toMatchObject({
        type: "file_edit",
        file_path: "src/utils.ts",
      });
    });

    test("relativizes Windows file_path in Read tool", () => {
      const tWin = createTransforms("C:\\Users\\john\\projects\\myapp");
      const block = tWin.transformToolUse("id4", "Read", {
        file_path: "C:\\Users\\john\\projects\\myapp\\src\\index.ts",
      });
      expect(block).toMatchObject({
        type: "file_read",
        file_path: "src/index.ts",
      });
    });
  });
});
