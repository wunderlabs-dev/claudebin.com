"use client";

import { useTranslations } from "next-intl";

import type { TaskOutputBlock } from "@/supabase/types/message";

import { SvgIconDownload } from "@/components/icon/svg-icon-download";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Code } from "@/components/ui/code";
import { Typography } from "@/components/ui/typography";

type ThreadPageConversationTaskOutputProps = {
  block: TaskOutputBlock;
};

const ThreadPageConversationTaskOutput = ({ block }: ThreadPageConversationTaskOutputProps) => {
  const t = useTranslations();

  const statusColor =
    block.status === "completed"
      ? "text-green-600"
      : block.status === "running"
        ? "text-orange-500"
        : "text-gray-500";

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="task-output">
        <AccordionTrigger>
          <SvgIconDownload size="sm" color="primary" />
          {t("chat.taskOutput", { taskId: block.task_id })}
          <span className={`ml-2 text-xs ${statusColor}`}>{block.status ?? "pending"}</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-2">
            {block.description ? (
              <Typography variant="small" color="muted">
                {block.description}
              </Typography>
            ) : null}
            {block.output ? <Code code={block.output} /> : null}
            {block.exitCode !== undefined ? (
              <Typography variant="small" color="muted">
                {t("chat.exitCode", { code: block.exitCode })}
              </Typography>
            ) : null}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ThreadPageConversationTaskOutput };
