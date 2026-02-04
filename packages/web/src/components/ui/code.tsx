import { createHighlighter } from "shiki";

import { cn } from "@/utils/helpers";

type CodeProps = {
  code: string;
  lang?: string;
  className?: string;
};

const highlighter = await createHighlighter({
  themes: ["plastic"],
  langs: ["typescript", "javascript", "json", "bash", "tsx", "jsx", "css", "html", "diff"],
});

const Code = ({ code, lang = "typescript", className }: CodeProps) => {
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
        "min-w-0 overflow-x-auto rounded-lg bg-gray-200",
        "[&_pre]:font-mono [&_pre]:px-4 [&_pre]:py-3",
        className,
      )}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates safe HTML
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export { Code };
