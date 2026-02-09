"use client";

import { useTranslations } from "next-intl";

import type { TaskStopBlock } from "@/supabase/types/message";

import { SvgIconCircle } from "@/components/icon/svg-icon-circle";
import { Action } from "@/components/ui/action";

type ThreadPageConversationTaskStopProps = {
  block: TaskStopBlock;
};

const ThreadPageConversationTaskStop = ({ block }: ThreadPageConversationTaskStopProps) => {
  const t = useTranslations();

  return (
    <Action
      className="gap-1"
      title={t("chat.taskStop")}
      icon={<SvgIconCircle size="sm" color="primary" />}
    >
      <span className={block.success ? "text-green-600" : "text-red-500"}>
        {block.success ? t("chat.taskStopped") : t("chat.taskStopFailed")}
      </span>
      <span className="text-gray-500">({block.task_id})</span>
    </Action>
  );
};

export { ThreadPageConversationTaskStop };
