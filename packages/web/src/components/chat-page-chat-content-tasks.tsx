import type { ReactNode } from "react";

import type { TasksBlock, TaskItem } from "@/supabase/types/message";

import { SvgIconCircle, SvgIconCircleLine, SvgIconCheck } from "@/components/icon";
import { Todo, TodoItem, TodoItemIcon, TodoItemLabel } from "@/components/ui/todo";

type ChatPageChatContentTasksProps = {
  block: TasksBlock;
};

const icons: Record<TaskItem["status"], ReactNode> = {
  pending: <SvgIconCircle size="sm" />,
  in_progress: <SvgIconCircleLine size="sm" />,
  completed: <SvgIconCheck size="sm" />,
};

const ChatPageChatContentTasks = ({ block }: ChatPageChatContentTasksProps) => {
  return (
    <Todo>
      {block.tasks.map((task) => (
        <TodoItem key={task.id} variant={task.status}>
          <TodoItemIcon variant={task.status}>{icons[task.status]}</TodoItemIcon>
          <span className="text-gray-400 text-xs">#{task.id}</span>
          <TodoItemLabel>{task.subject}</TodoItemLabel>
        </TodoItem>
      ))}
    </Todo>
  );
};

export { ChatPageChatContentTasks };
