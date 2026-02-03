"use client";

import { useTranslations } from "next-intl";

import type { GrepBlock } from "@/supabase/types/message";

import { SvgIconMagnifier } from "@/components/icon";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Code } from "@/components/ui/code";

type ChatPageChatContentGrepProps = {
  block: GrepBlock;
};

const ChatPageChatContentGrep = ({ block }: ChatPageChatContentGrepProps) => {
  const t = useTranslations();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="grep">
        <AccordionTrigger>
          <SvgIconMagnifier size="sm" color="primary" />
          {t("chat.grep")}
        </AccordionTrigger>
        <AccordionContent>
          <Code code={block.pattern} lang="bash" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ChatPageChatContentGrep };
