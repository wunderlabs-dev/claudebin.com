import { describe, expect, test } from "bun:test";

import { getProjectName } from "./paths";

describe("getProjectName", () => {
  test("returns last folder from POSIX path", () => {
    expect(getProjectName("/Users/john/projects/myapp")).toBe("myapp");
  });

  test("returns last folder from Windows path", () => {
    expect(
      getProjectName(
        "D:\\DevOps Workspace\\IS Agriware Logistics\\IS Agriware Logistics Branches\\IS Agriware Logistics",
      ),
    ).toBe("IS Agriware Logistics");
  });

  test("returns null for null working directory", () => {
    expect(getProjectName(null)).toBeNull();
  });
});
