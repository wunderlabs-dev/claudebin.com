import { describe, it, expect } from "bun:test";

import { messagesToMarkdown } from "../messageToMarkdown";
import { BlockType } from "@/supabase/types/message";
import type { Message } from "@/supabase/repos/messages";

const createMessage = (role: "user" | "assistant", content: Message["content"]): Message => ({
  id: 1,
  sessionId: "test",
  idx: 0,
  uuid: "test-uuid",
  role,
  content,
  isMeta: false,
  isSidechain: false,
  hasToolCalls: false,
  toolNames: [],
  textPreview: "",
  model: null,
  parentUuid: null,
  timestamp: new Date().toISOString(),
  type: "message",
  createdAt: new Date().toISOString(),
});

describe("messagesToMarkdown", () => {
  it("converts text blocks to markdown", () => {
    const messages: Message[] = [
      createMessage("user", [{ type: BlockType.TEXT, text: "Hello" }]),
      createMessage("assistant", [{ type: BlockType.TEXT, text: "Hi there!" }]),
    ];

    const markdown = messagesToMarkdown(messages);

    expect(markdown).toContain("## User");
    expect(markdown).toContain("Hello");
    expect(markdown).toContain("## Assistant");
    expect(markdown).toContain("Hi there!");
  });

  it("converts thinking blocks with tags", () => {
    const messages: Message[] = [
      createMessage("assistant", [
        { type: BlockType.THINKING, thinking: "Let me think..." },
        { type: BlockType.TEXT, text: "Here is my answer" },
      ]),
    ];

    const markdown = messagesToMarkdown(messages);

    expect(markdown).toContain("<thinking>");
    expect(markdown).toContain("Let me think...");
    expect(markdown).toContain("</thinking>");
    expect(markdown).toContain("Here is my answer");
  });

  it("converts bash blocks to summary format", () => {
    const messages: Message[] = [
      createMessage("assistant", [
        {
          type: BlockType.BASH,
          id: "1",
          command: "ls -la",
          stdout: "file1.txt\nfile2.txt",
          exitCode: 0,
        },
      ]),
    ];

    const markdown = messagesToMarkdown(messages);

    expect(markdown).toContain("> Ran `ls -la`");
  });

  it("converts file read blocks to summary format", () => {
    const messages: Message[] = [
      createMessage("assistant", [
        {
          type: BlockType.FILE_READ,
          id: "1",
          file_path: "src/index.ts",
          content: "const x = 1;",
        },
      ]),
    ];

    const markdown = messagesToMarkdown(messages);

    expect(markdown).toContain("> Read `src/index.ts`");
  });

  it("converts file write blocks to summary format", () => {
    const messages: Message[] = [
      createMessage("assistant", [
        {
          type: BlockType.FILE_WRITE,
          id: "1",
          file_path: "src/new.ts",
          content: "export const y = 2;",
          success: true,
        },
      ]),
    ];

    const markdown = messagesToMarkdown(messages);

    expect(markdown).toContain("> Wrote `src/new.ts`");
  });

  it("converts file edit blocks to summary format", () => {
    const messages: Message[] = [
      createMessage("assistant", [
        {
          type: BlockType.FILE_EDIT,
          id: "1",
          file_path: "src/edit.ts",
          old_string: "const x = 1",
          new_string: "const x = 2",
          success: true,
        },
      ]),
    ];

    const markdown = messagesToMarkdown(messages);

    expect(markdown).toContain("> Edited `src/edit.ts`");
  });

  it("handles multiple messages correctly", () => {
    const messages: Message[] = [
      createMessage("user", [{ type: BlockType.TEXT, text: "Fix the bug" }]),
      createMessage("assistant", [
        { type: BlockType.TEXT, text: "Let me check" },
        { type: BlockType.FILE_READ, id: "1", file_path: "src/bug.ts", content: "..." },
      ]),
      createMessage("user", [{ type: BlockType.TEXT, text: "Thanks!" }]),
    ];

    const markdown = messagesToMarkdown(messages);

    const userCount = (markdown.match(/## User/g) || []).length;
    const assistantCount = (markdown.match(/## Assistant/g) || []).length;

    expect(userCount).toBe(2);
    expect(assistantCount).toBe(1);
  });
});
