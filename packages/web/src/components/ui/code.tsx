import { createHighlighter } from "shiki";

import type { Role } from "@/supabase/types/message";

import { cn } from "@/utils/helpers";

type CodeProps = {
  code: string;
  lang?: string;
  variant?: Role;
  className?: string;
};

const highlighter = await createHighlighter({
  themes: ["plastic"],
  langs: ["typescript", "javascript", "json", "bash", "tsx", "jsx", "css", "html", "sql", "diff"],
});

const Code = ({ code, lang = "typescript", variant = "assistant", className }: CodeProps) => {
  const html = highlighter.codeToHtml(code, {
    lang,
    theme: "plastic",
    colorReplacements: {
      "#21252b": "transparent",
    },
  });

  return (
    <div
      data-slot="code"
      className={cn(
        "overflow-x-auto scrollbar-hidden min-w-0 rounded-lg",
        variant === "assistant" ? "bg-gray-200" : "bg-gray-100",
        "[&_pre]:font-mono [&_pre]:text-sm [&_pre]:px-4 [&_pre]:py-3",
        className,
      )}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates safe HTML
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export { Code };
