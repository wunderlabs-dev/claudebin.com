"use client";

import { useTranslations } from "next-intl";

import type { WebFetchBlock } from "@/supabase/types/message";

import { SvgIconDownload } from "@/components/icon";
import { Action } from "@/components/ui/action";

type ChatPageChatContentWebFetchProps = {
  block: WebFetchBlock;
};

const ChatPageChatContentWebFetch = ({ block }: ChatPageChatContentWebFetchProps) => {
  const t = useTranslations();

  return (
    <Action icon={<SvgIconDownload size="sm" color="primary" />} title={t("chat.fetch")}>
      {block.url}
    </Action>
  );
};

export { ChatPageChatContentWebFetch };
