"use client";

import type { BashBlock } from "@/supabase/types/message";

import { SvgIconBash } from "@/components/icon";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Code } from "@/components/ui/code";

type ChatPageChatContentBashProps = {
  block: BashBlock;
};

const ChatPageChatContentBash = ({ block }: ChatPageChatContentBashProps) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="bash">
        <AccordionTrigger>
          <SvgIconBash size="sm" color="primary" />
          {block.description ?? block.command}
        </AccordionTrigger>
        <AccordionContent>
          <Code code={block.command} lang="bash" />
          {block.result && <Code code={block.result} />}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ChatPageChatContentBash };
