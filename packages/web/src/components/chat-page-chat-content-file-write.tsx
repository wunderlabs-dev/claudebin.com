"use client";

import { useTranslations } from "next-intl";

import type { FileWriteBlock } from "@/supabase/types/message";

import { SvgIconFile, SvgIconPen } from "@/components/icon";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Chip } from "@/components/ui/chip";
import { Code } from "@/components/ui/code";

type ChatPageChatContentFileWriteProps = {
  block: FileWriteBlock;
};

const ChatPageChatContentFileWrite = ({ block }: ChatPageChatContentFileWriteProps) => {
  const t = useTranslations();
  const filename = block.file_path.split("/").pop() ?? block.file_path;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="file-write">
        <AccordionTrigger>
          <SvgIconPen size="sm" color="primary" />
          {t("chat.write")}
          <Chip icon={<SvgIconFile size="xs" />} label={filename} />
        </AccordionTrigger>
        <AccordionContent>
          <Code code={block.content} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ChatPageChatContentFileWrite };
