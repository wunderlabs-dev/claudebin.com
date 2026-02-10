"use client";

import type { ReactNode } from "react";

import { useCopyToClipboard } from "usehooks-ts";
import { useTranslations } from "next-intl";

import { SvgIconBash } from "@/components/icon/svg-icon-bash";
import { SvgIconCheck } from "@/components/icon/svg-icon-check";
import { SvgIconCopy } from "@/components/icon/svg-icon-copy";

import { THREAD_SNIPPET_TEXTAREA_ROWS } from "@/utils/constants";

import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/form-control";

export const CopyInputVariants = ["command", "link", "snippet"] as const;
export type CopyInputVariant = (typeof CopyInputVariants)[number];

type CopyInputProps = {
  value: string;
  variant?: CopyInputVariant;
};

const CopyInput = ({ value, variant = "command" }: CopyInputProps): ReactNode => {
  const t = useTranslations();
  const [copiedText, copy] = useCopyToClipboard();

  const handleCopy = () => {
    copy(value);
  };

  if (variant === "command") {
    return (
      <div className="flex items-center justify-between gap-5 min-w-0 p-1 bg-gray-200 border border-gray-50 rounded-full transition-colors duration-150 ease-in-out hover:border-orange-50/60 active:border-orange-50">
        <div className="flex items-center gap-5 min-w-0 pl-6">
          <SvgIconBash className="shrink-0 text-orange-300" />
          <span className="font-mono text-base text-orange-50 truncate">{value}</span>
        </div>

        <Button
          className="shrink-0"
          variant="outline"
          color={copiedText === value ? "success" : "default"}
          onClick={handleCopy}
        >
          {copiedText === value ? t("common.copied") : t("common.copy")}
          {copiedText === value ? <SvgIconCheck /> : <SvgIconCopy />}
        </Button>
      </div>
    );
  }
  if (variant === "link") {
    return (
      <div className="flex flex-col gap-4">
        <Input variant="filled" value={value} readOnly />
        <Button
          variant="outline"
          color={copiedText === value ? "success" : "default"}
          onClick={handleCopy}
        >
          {copiedText === value ? <SvgIconCheck /> : <SvgIconCopy />}
          {copiedText === value ? t("common.copied") : t("common.copy")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Textarea value={value} rows={THREAD_SNIPPET_TEXTAREA_ROWS} readOnly />
      <Button
        variant="outline"
        color={copiedText === value ? "success" : "default"}
        onClick={handleCopy}
      >
        {copiedText === value ? <SvgIconCheck /> : <SvgIconCopy />}
        {copiedText === value ? t("common.copied") : t("common.copySnippet")}
      </Button>
    </div>
  );
};

export { CopyInput };
