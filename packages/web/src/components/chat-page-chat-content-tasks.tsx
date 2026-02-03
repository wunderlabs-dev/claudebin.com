"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import type { TasksBlock, TaskItem } from "@/supabase/types/message";

import { SvgIconCircleLine, SvgIconCheck, SvgIconGauge, SvgIconLine } from "@/components/icon";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Todo, TodoItem, TodoItemIcon, TodoItemLabel } from "@/components/ui/todo";

type ChatPageChatContentTasksProps = {
  block: TasksBlock;
};

const icons: Record<TaskItem["status"], ReactNode> = {
  pending: <SvgIconCircleLine size="sm" />,
  in_progress: <SvgIconGauge size="sm" />,
  completed: <SvgIconCheck size="sm" />,
};

const ChatPageChatContentTasks = ({ block }: ChatPageChatContentTasksProps) => {
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

export { ChatPageChatContentTasks };
