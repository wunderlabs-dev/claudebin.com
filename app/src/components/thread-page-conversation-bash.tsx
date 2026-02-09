"use client";

import type { BashBlock } from "@/supabase/types/message";

import { SvgIconBash } from "@/components/icon/svg-icon-bash";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Code } from "@/components/ui/code";

type ThreadPageConversationBashProps = {
  block: BashBlock;
};

const ThreadPageConversationBash = ({ block }: ThreadPageConversationBashProps) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="bash">
        <AccordionTrigger>
          <SvgIconBash size="sm" color="primary" />
          {block.description ?? block.command}
        </AccordionTrigger>
        <AccordionContent>
          <Code code={block.command} lang="bash" />
          {block.stdout ? <Code code={block.stdout} /> : null}
          {block.stderr ? <Code code={block.stderr} /> : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ThreadPageConversationBash };
