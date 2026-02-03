"use client";

import { useTranslations } from "next-intl";

import type { FileReadBlock } from "@/supabase/types/message";

import { SvgIconEye, SvgIconFile } from "@/components/icon";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Chip } from "@/components/ui/chip";

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
          <Chip icon={<SvgIconFile size="xs" />} label={block.file_path} />
        </AccordionTrigger>
        <AccordionContent />
      </AccordionItem>
    </Accordion>
  );
};

export { ChatPageChatContentFileRead };
