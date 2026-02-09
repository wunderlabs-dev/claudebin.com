"use client";

import { useTranslations } from "next-intl";

import type { TaskBlock } from "@/supabase/types/message";

import { SvgIconCircle } from "@/components/icon/svg-icon-circle";

import { Badge } from "@/components/ui/badge";
import { Action } from "@/components/ui/action";

type ThreadPageConversationTaskProps = {
  block: TaskBlock;
};

const ThreadPageConversationTask = ({ block }: ThreadPageConversationTaskProps) => {
  const t = useTranslations();

  return (
    <Action icon={<SvgIconCircle size="sm" color="neutral" />} title={t("chat.agent")}>
      <Badge variant="neutral" size="sm">
        {block.description}
      </Badge>
    </Action>
  );
};

export { ThreadPageConversationTask };
