import { createHighlighter } from "shiki";

import { cn } from "@/utils/helpers";

type CodeProps = {
  code: string;
  lang?: string;
  className?: string;
};

const THEME = "plastic";

const highlighter = await createHighlighter({
  themes: [THEME],
  langs: ["typescript", "javascript", "json", "bash", "tsx", "jsx", "css", "html"],
});

const Code = ({ code, lang = "typescript", className }: CodeProps) => {
  const html = highlighter.codeToHtml(code, {
    lang,
    theme: THEME,
  });

  return (
    <div
      data-slot="code"
      className={cn(
        "overflow-x-auto rounded-lg",
        "[&_pre]:px-4 [&_pre]:py-3 [&_pre]:bg-gray-175",
        className,
      )}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates safe HTML
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export { Code };
