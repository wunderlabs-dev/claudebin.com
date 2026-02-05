"use client";

import { useTranslations } from "next-intl";

import type { TaskStopBlock } from "@/supabase/types/message";

import { SvgIconCircle } from "@/components/icon";
import { Action } from "@/components/ui/action";

type ThreadPageConversationTaskStopProps = {
  block: TaskStopBlock;
};

const ThreadPageConversationTaskStop = ({ block }: ThreadPageConversationTaskStopProps) => {
  const t = useTranslations();

  const statusColor = block.success ? "text-green-600" : "text-red-500";
  const statusText = block.success ? t("chat.taskStopped") : t("chat.taskStopFailed");

  return (
    <Action icon={<SvgIconCircle size="sm" color="primary" />} title={t("chat.taskStop")}>
      <span className={statusColor}>{statusText}</span>
      <span className="text-gray-500 ml-1">({block.task_id})</span>
    </Action>
  );
};

export { ThreadPageConversationTaskStop };
