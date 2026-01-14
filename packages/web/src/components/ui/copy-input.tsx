"use client";

import type { HTMLAttributes } from "react";
import { useCopyToClipboard } from "usehooks-ts";
import { useTranslations } from "next-intl";

import { cn } from "@/utils/helpers";

import { Button } from "@/components/ui/button";
import { SvgIconCopy, SvgIconCheck, SvgIconBash } from "@/components/icon";

type CopyInputProps = {
  value: string;
  disabled?: boolean;
} & HTMLAttributes<HTMLDivElement>;

const CopyInput = ({ value, disabled, className, ...props }: CopyInputProps) => {
  const t = useTranslations("common");
  const [copiedText, copy] = useCopyToClipboard();

  const handleCopy = () => {
    if (disabled) {
      return null;
    }
    copy(value);
  };

  return (
    <div
      data-slot="copy-input"
      data-disabled={disabled}
      className={cn(
        "group flex items-center gap-5",
        "bg-gray-150 outline outline-gray-50",
        "px-1 py-1",
        "rounded-full",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-5 pl-6">
        <SvgIconBash className="shrink-0 text-orange-300" />
        <span className="flex-1 font-mono text-base text-white whitespace-nowrap">{value}</span>
      </div>

      <Button
        variant="outline"
        color={copiedText ? "success" : "default"}
        onClick={handleCopy}
        disabled={disabled}
      >
        {copiedText ? t("copied") : t("copy")}
        {copiedText ? <SvgIconCheck className="text-white" /> : <SvgIconCopy />}
      </Button>
    </div>
  );
};

export { CopyInput };
