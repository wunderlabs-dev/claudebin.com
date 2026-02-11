"use client";

import { useEffect, useState } from "react";
import { isNil } from "ramda";
import { type BundledLanguage, createHighlighter } from "shiki";

import { cn } from "@/utils/helpers";
import { useChatItemRole } from "@/components/ui/chat";

type CodeProps = {
  code: string;
  lang?: string;
  className?: string;
};

const PRELOADED_LANGS = [
  "typescript",
  "javascript",
  "json",
  "bash",
  "tsx",
  "jsx",
  "css",
  "html",
  "diff",
  "python",
];

const highlighter = await createHighlighter({
  themes: ["plastic"],
  langs: PRELOADED_LANGS,
});

const codeToHtml = (code: string, lang: string) => {
  return highlighter.codeToHtml(code, {
    lang,
    theme: "plastic",
    colorReplacements: {
      "#21252b": "transparent",
    },
  });
};

const Code = ({ code, lang = "typescript", className }: CodeProps) => {
  const [dynamicHtml, setDynamicHtml] = useState(code);

  const role = useChatItemRole();
  const isLoaded = highlighter.getLoadedLanguages().includes(lang);

  useEffect(() => {
    if (isLoaded) {
      return;
    }

    const loadAndHighlight = async () => {
      try {
        await highlighter.loadLanguage(lang as BundledLanguage);
      } catch { }

      const loaded = highlighter.getLoadedLanguages();
      const effectiveLang = loaded.includes(lang) ? lang : "plaintext";

      if (isNil(code)) {
        return;
      }
      setDynamicHtml(codeToHtml(code, effectiveLang));
    };

    loadAndHighlight();
  }, [code, lang, isLoaded]);

  const html = isLoaded ? codeToHtml(code, lang) : dynamicHtml;

  return (
    <div
      data-slot="code"
      className={cn(
        "overflow-x-auto scrollbar-hidden",
        "min-w-0 w-full",
        role === "assistant" ? "bg-gray-200" : "bg-gray-100",
        "rounded-lg",
        "[&_pre]:px-4 [&_pre]:py-3 [&_pre]:font-mono [&_pre]:text-sm",
        className,
      )}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates safe HTML
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export { Code };
