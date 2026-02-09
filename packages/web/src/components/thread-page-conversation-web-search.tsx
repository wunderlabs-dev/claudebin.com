"use client";

import { useTranslations } from "next-intl";

import type { WebSearchBlock } from "@/supabase/types/message";

import { SvgIconGlobeSearch } from "@/components/icon/svg-icon-globe-search";
import { Action } from "@/components/ui/action";

type ThreadPageConversationWebSearchProps = {
  block: WebSearchBlock;
};

const ThreadPageConversationWebSearch = ({ block }: ThreadPageConversationWebSearchProps) => {
  const t = useTranslations();

  return (
    <Action icon={<SvgIconGlobeSearch size="sm" color="primary" />} title={t("chat.search")}>
      <pre className="inline-block py-1 px-2 bg-gray-200 rounded-lg font-mono text-sm">
        {block.query}
      </pre>
    </Action>
  );
};

export { ThreadPageConversationWebSearch };
