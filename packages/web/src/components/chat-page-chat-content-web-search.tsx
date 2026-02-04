"use client";

import { useTranslations } from "next-intl";

import type { WebSearchBlock } from "@/supabase/types/message";

import { SvgIconWorld } from "@/components/icon";
import { Action } from "@/components/ui/action";

type ChatPageChatContentWebSearchProps = {
  block: WebSearchBlock;
};

const ChatPageChatContentWebSearch = ({ block }: ChatPageChatContentWebSearchProps) => {
  const t = useTranslations();

  return (
    <Action icon={<SvgIconWorld size="sm" color="primary" />} title={t("chat.search")}>
      {block.query}
    </Action>
  );
};

export { ChatPageChatContentWebSearch };
