"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import type { TasksBlock, TaskItem } from "@/supabase/types/message";

import { SvgIconCircleLine } from "@/components/icon/svg-icon-circle-line";
import { SvgIconCheck } from "@/components/icon/svg-icon-check";
import { SvgIconGauge } from "@/components/icon/svg-icon-gauge";
import { SvgIconLine } from "@/components/icon/svg-icon-line";
import { SvgIconDot } from "@/components/icon/svg-icon-dot";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Todo, TodoItem, TodoItemIcon, TodoItemLabel } from "@/components/ui/todo";
import { Chip } from "@/components/ui/chip";

type ThreadPageConversationTasksProps = {
  block: TasksBlock;
};

const icons: Record<TaskItem["status"], ReactNode> = {
  pending: <SvgIconCircleLine size="sm" />,
  in_progress: <SvgIconGauge size="sm" />,
  completed: <SvgIconCheck size="sm" />,
};

const statusChipIcons: Record<TaskItem["status"], ReactNode> = {
  pending: <SvgIconDot size="sm" className="text-gray-400" />,
  in_progress: <SvgIconGauge size="sm" className="text-orange-50" />,
  completed: <SvgIconCheck size="sm" className="text-green-50" />,
};

const ThreadPageConversationTasks = ({ block }: ThreadPageConversationTasksProps) => {
  const t = useTranslations();

  const statusLabels: Record<TaskItem["status"], string> = {
    pending: t("chat.taskPending"),
    in_progress: t("chat.taskInProgress"),
    completed: t("chat.taskCompleted"),
  };

  const getChangeLabel = (): string | null => {
    if (!block.lastChange) return null;
    if (block.lastChange.action === "created") return t("chat.taskCreated");
    return statusLabels[block.lastChange.newStatus];
  };

  const changeLabel = getChangeLabel();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="tasks">
        <AccordionTrigger>
          <SvgIconLine size="sm" color="primary" />
          {t("chat.todos")}
          {block.lastChange && changeLabel && (
            <Chip icon={statusChipIcons[block.lastChange.newStatus]} label={changeLabel} />
          )}
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
