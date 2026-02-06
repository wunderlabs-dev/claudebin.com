"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import type { TasksBlock, TaskItem } from "@/supabase/types/message";

import { SvgIconCircleLine } from "@/components/icon/svg-icon-circle-line";
import { SvgIconCheck } from "@/components/icon/svg-icon-check";
import { SvgIconGauge } from "@/components/icon/svg-icon-gauge";
import { SvgIconLine } from "@/components/icon/svg-icon-line";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Todo, TodoItem, TodoItemIcon, TodoItemLabel } from "@/components/ui/todo";

type ThreadPageConversationTasksProps = {
  block: TasksBlock;
};

const icons: Record<TaskItem["status"], ReactNode> = {
  pending: <SvgIconCircleLine size="sm" />,
  in_progress: <SvgIconGauge size="sm" />,
  completed: <SvgIconCheck size="sm" />,
};

const ThreadPageConversationTasks = ({ block }: ThreadPageConversationTasksProps) => {
  const t = useTranslations();
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="tasks">
        <AccordionTrigger>
          <SvgIconLine size="sm" color="primary" />
          {t("chat.todos")}
        </AccordionTrigger>
        <AccordionContent>
          <Todo>
            {block.tasks.map((task) => (
              <TodoItem key={task.id} variant={task.status}>
                <TodoItemIcon variant={task.status}>{icons[task.status]}</TodoItemIcon>
                <TodoItemLabel>{task.subject}</TodoItemLabel>
              </TodoItem>
            ))}
          </Todo>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ThreadPageConversationTasks };
