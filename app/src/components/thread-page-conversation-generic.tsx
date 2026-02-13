"use client";

import { useTranslations } from "next-intl";

import type { GenericBlock } from "@/supabase/types/message";

import { stringifyJSON } from "@/utils/helpers";

import { SvgIconHammer } from "@/components/icon/svg-icon-hammer";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { Code } from "@/components/ui/code";

type ThreadPageConversationGenericProps = {
  block: GenericBlock;
};

const ThreadPageConversationGeneric = ({ block }: ThreadPageConversationGenericProps) => {
  const t = useTranslations();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="generic">
        <AccordionTrigger>
          <SvgIconHammer size="sm" color="primary" />
          {block.name ?? t("chat.unknownTool")}
        </AccordionTrigger>

        <AccordionContent>
          <Code code={stringifyJSON(block.input)} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ThreadPageConversationGeneric };
