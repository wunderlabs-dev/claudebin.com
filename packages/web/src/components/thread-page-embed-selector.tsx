"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/utils/helpers";

import { Typography } from "@/components/ui/typography";
import { X } from "lucide-react";

type ThreadPageEmbedSelectorProps = {
  sessionId: string;
  fromIdx: number | null;
  toIdx: number | null;
  onClear: () => void;
};

const ThreadPageEmbedSelector = ({
  sessionId,
  fromIdx,
  toIdx,
  onClear,
}: ThreadPageEmbedSelectorProps) => {
  const t = useTranslations();

  const hasSelection = fromIdx !== null;
  const rangeSelected = fromIdx !== null && toIdx !== null;

  if (!hasSelection) {
    return null;
  }

  const messageCount = rangeSelected ? toIdx - fromIdx + 1 : 1;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 z-50 -translate-x-1/2",
        "flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg",
        "dark:border-gray-700 dark:bg-gray-800"
      )}
    >
      <Typography variant="small" color="muted">
        {rangeSelected
          ? t("thread.messagesSelected", { count: messageCount })
          : t("thread.selectEndMessage")}
      </Typography>

      <button
        type="button"
        onClick={onClear}
        className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export { ThreadPageEmbedSelector };
