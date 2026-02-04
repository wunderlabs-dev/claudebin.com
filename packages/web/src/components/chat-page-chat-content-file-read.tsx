"use client";

import { useTranslations } from "next-intl";

import type { FileReadBlock } from "@/supabase/types/message";

import { SvgIconEye } from "@/components/icon";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Code } from "@/components/ui/code";

import { ChatPageChatContentChip } from "@/components/chat-page-chat-content-chip";

type ChatPageChatContentFileReadProps = {
  block: FileReadBlock;
};

const ChatPageChatContentFileRead = ({ block }: ChatPageChatContentFileReadProps) => {
  const t = useTranslations();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="file-read">
        <AccordionTrigger>
          <SvgIconEye size="sm" color="primary" />
          {t("chat.read")}
          <ChatPageChatContentChip label={block.file_path} />
        </AccordionTrigger>
        <AccordionContent>{block.content ? <Code code={block.content} /> : null}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ChatPageChatContentFileRead };
