"use client";

import { useTranslations } from "next-intl";

import type { WebSearchBlock } from "@/supabase/types/message";

import { SvgIconWorld } from "@/components/icon/svg-icon-world";
import { Action } from "@/components/ui/action";

type ThreadPageConversationWebSearchProps = {
  block: WebSearchBlock;
};

const ThreadPageConversationWebSearch = ({ block }: ThreadPageConversationWebSearchProps) => {
  const t = useTranslations();

  return (
    <Action icon={<SvgIconWorld size="sm" color="primary" />} title={t("chat.search")}>
      {block.query}
    </Action>
  );
};

export { ThreadPageConversationWebSearch };
