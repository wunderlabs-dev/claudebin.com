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
      "#21252b": "#303030",
    },
  });

  return (
    <div
      data-slot="code"
      className={cn(
        "overflow-x-auto rounded-lg",
        "[&+pre]:font-mono [&_pre]:px-4 [&_pre]:py-3",
        className,
      )}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates safe HTML
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export { Code };
