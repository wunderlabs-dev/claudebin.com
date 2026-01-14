"use client";

import { useState, type HTMLAttributes } from "react";
import { useCopyToClipboard } from "usehooks-ts";

import { cn } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { SvgIconCopy, SvgIconCheck, SvgIconBash } from "@/components/icon";

type CopyInputProps = {
  value: string;
  disabled?: boolean;
} & HTMLAttributes<HTMLDivElement>;

const CopyInput = ({
  value,
  disabled = false,
  className,
  ...props
}: CopyInputProps) => {
  const [copied, setCopied] = useState(false);
  const [, copy] = useCopyToClipboard();

  const handleCopy = () => {
    if (!disabled) {
      copy(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      data-slot="copy-input"
      data-disabled={disabled}
      className={cn(
        "group flex items-center gap-3",
        "h-14 pl-5 pr-2",
        "rounded-full",
        "bg-gray-150 outline outline-gray-50",
        "transition ease-in-out",
        "hover:outline-orange-50",
        "has-[:focus]:outline-orange-50",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        className,
      )}
      {...props}
    >
      <SvgIconBash className="shrink-0 text-orange-50" />
      <span className="flex-1 truncate font-mono text-base text-white">
        {value}
      </span>
      <Button
        variant="outline"
        color={copied ? "success" : "default"}
        onClick={handleCopy}
        disabled={disabled}
      >
        {copied ? "Copied !" : "Copy"}
        {copied ? <SvgIconCheck /> : <SvgIconCopy />}
      </Button>
    </div>
  );
};

export { CopyInput };
