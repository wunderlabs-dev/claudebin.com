"use client";

import { useTranslations } from "next-intl";

import type { TaskStopBlock } from "@/supabase/types/message";

import { cn } from "@/utils/helpers";

import { SvgIconGauge } from "@/components/icon/svg-icon-gauge";
import { SvgIconCheck } from "@/components/icon/svg-icon-check";

import { Badge } from "@/components/ui/badge";
import { Action } from "@/components/ui/action";

type ThreadPageConversationTaskStopProps = {
  block: TaskStopBlock;
};

const ThreadPageConversationTaskStop = ({ block }: ThreadPageConversationTaskStopProps) => {
  const t = useTranslations();

  return (
    <Action
      title={block.success ? t("chat.taskStopped") : t("chat.taskStopFailed")}
      icon={block.success ? <SvgIconCheck size="sm" /> : <SvgIconGauge size="sm" />}
      className={cn(block.success ? "text-green-50" : "text-red-50")}
    >
      <Badge variant={block.success ? "success" : "error"} size="sm">
        {block.task_id}
      </Badge>
    </Action>
  );
};

export { ThreadPageConversationTaskStop };
