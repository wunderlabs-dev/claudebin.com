"use client";

import { useTranslations } from "next-intl";

import type { TaskBlock } from "@/supabase/types/message";

import { SvgIconHammer } from "@/components/icon";
import { Action } from "@/components/ui/action";

type ThreadPageConversationTaskProps = {
  block: TaskBlock;
};

const ThreadPageConversationTask = ({ block }: ThreadPageConversationTaskProps) => {
  const t = useTranslations();

  return (
    <Action icon={<SvgIconHammer size="sm" color="primary" />} title={t("chat.task")}>
      {block.description}
    </Action>
  );
};

export { ThreadPageConversationTask };
