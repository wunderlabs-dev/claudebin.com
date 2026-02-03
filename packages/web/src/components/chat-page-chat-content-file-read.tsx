"use client";

import { useTranslations } from "next-intl";

import type { FileReadBlock } from "@/supabase/types/message";

import { SvgIconEye, SvgIconFile } from "@/components/icon";
import { Chip } from "@/components/ui/chip";

type ChatPageChatContentFileReadProps = {
  block: FileReadBlock;
};

const ChatPageChatContentFileRead = ({ block }: ChatPageChatContentFileReadProps) => {
  const t = useTranslations();

  return (
    <div className="flex items-center gap-2">
      <SvgIconEye size="sm" color="primary" />
      {t("chat.read")}
      <Chip icon={<SvgIconFile size="xs" />} label={block.file_path} />
    </div>
  );
};

export { ChatPageChatContentFileRead };
