"use client";

import { useMemo, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { isNil } from "ramda";

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

import { Chip } from "@/components/ui/chip";
import { Todo, TodoItem, TodoItemIcon, TodoItemLabel } from "@/components/ui/todo";

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

  const label = useMemo(() => {
    if (isNil(block.lastChange)) {
      return null;
    }
    if (block.lastChange.action === "created") {
      return t("chat.taskCreated");
    }

    const labels: Record<TaskItem["status"], string> = {
      pending: t("chat.taskPending"),
      completed: t("chat.taskCompleted"),
      in_progress: t("chat.taskInProgress"),
    };

    return labels[block.lastChange.newStatus];
  }, [block.lastChange, t]);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="tasks">
        <AccordionTrigger>
          <SvgIconLine size="sm" color="primary" />
          {t("chat.todos")}
          {block.lastChange && label ? (
            <Chip icon={statusChipIcons[block.lastChange.newStatus]} label={label} />
          ) : null}
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
