"use client";

import { useTranslations } from "next-intl";

import type { WebSearchBlock } from "@/supabase/types/message";

import { SvgIconMagnifier } from "@/components/icon/svg-icon-magnifier";
import { Action } from "@/components/ui/action";

type ThreadPageConversationWebSearchProps = {
  block: WebSearchBlock;
};

const ThreadPageConversationWebSearch = ({ block }: ThreadPageConversationWebSearchProps) => {
  const t = useTranslations();

  return (
    <Action icon={<SvgIconMagnifier size="sm" color="primary" />} title={t("chat.search")}>
      <pre className="font-mono text-sm inline-block rounded-sm py-1 px-2 bg-gray-200">{block.query}</pre>
    </Action>
  );
};

export { ThreadPageConversationWebSearch };
