"use client";

import { useCallback, type ReactNode } from "react";

import { useBoolean, useCopyToClipboard, useTimeout } from "usehooks-ts";
import { useTranslations } from "next-intl";

import { SvgIconBash } from "@/components/icon/svg-icon-bash";
import { SvgIconCheck } from "@/components/icon/svg-icon-check";
import { SvgIconCopy } from "@/components/icon/svg-icon-copy";

import { COPY_RESET_MS, THREAD_SNIPPET_TEXTAREA_ROWS } from "@/utils/constants";

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

  const [, copy] = useCopyToClipboard();
  const { value: isCopied, setTrue: setCopied, setFalse: resetCopied } = useBoolean();

  const handleCopy = useCallback(() => {
    copy(value);
    setCopied();
  }, [copy, value, setCopied]);

  useTimeout(resetCopied, isCopied ? COPY_RESET_MS : null);

  if (variant === "command") {
    return (
      <div className="flex flex-col items-end gap-4">
        <div className="flex min-w-full gap-5 rounded-lg border border-gray-50 bg-gray-200 px-6 py-2 transition-colors duration-150 ease-in-out hover:border-orange-50/60 active:border-orange-50">
          <SvgIconBash className="shrink-0 text-orange-300" />
          <span className="whitespace-break-spaces font-mono text-orange-50">{value}</span>
        </div>

        <Button
          className="shrink-0"
          variant="outline"
          color={isCopied ? "success" : "default"}
          onClick={handleCopy}
        >
          {isCopied ? t("common.copied") : t("common.copyCommand")}
          {isCopied ? <SvgIconCheck /> : <SvgIconCopy />}
        </Button>
      </div>
    );
  }
  if (variant === "link") {
    return (
      <div className="flex flex-col gap-4">
        <Input variant="filled" value={value} readOnly />
        <Button variant="outline" color={isCopied ? "success" : "default"} onClick={handleCopy}>
          {isCopied ? <SvgIconCheck /> : <SvgIconCopy />}
          {isCopied ? t("common.copied") : t("common.copy")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Textarea value={value} rows={THREAD_SNIPPET_TEXTAREA_ROWS} readOnly />
      <Button variant="outline" color={isCopied ? "success" : "default"} onClick={handleCopy}>
        {isCopied ? <SvgIconCheck /> : <SvgIconCopy />}
        {isCopied ? t("common.copied") : t("common.copySnippet")}
      </Button>
    </div>
  );
};

export { CopyInput };
