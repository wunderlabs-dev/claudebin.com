import type { TasksBlock, TaskItem } from "@/supabase/types/message";

import { SvgIconCircle, SvgIconCircleLine, SvgIconCheck } from "@/components/icon";
import { Todo, TodoItem, TodoItemIcon, TodoItemLabel } from "@/components/ui/todo";

type ChatPageChatContentTasksProps = {
  block: TasksBlock;
};

const statusToVariant = (status: TaskItem["status"]) => {
  switch (status) {
    case "completed":
      return "completed";
    case "in_progress":
      return "progress";
    default:
      return "pending";
  }
};

const TaskIcon = ({ status }: { status: TaskItem["status"] }) => {
  switch (status) {
    case "completed":
      return <SvgIconCheck size="sm" />;
    case "in_progress":
      return <SvgIconCircleLine size="sm" />;
    default:
      return <SvgIconCircle size="sm" />;
  }
};

const ChatPageChatContentTasks = ({ block }: ChatPageChatContentTasksProps) => {
  const completed = block.tasks.filter((t) => t.status === "completed").length;
  const total = block.tasks.length;

  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
      <div className="mb-2 font-medium text-gray-600 text-sm">
        Tasks ({completed}/{total} done)
      </div>
      <Todo>
        {block.tasks.map((task) => {
          const variant = statusToVariant(task.status);
          return (
            <TodoItem key={task.id} variant={variant}>
              <TodoItemIcon variant={variant}>
                <TaskIcon status={task.status} />
              </TodoItemIcon>
              <span className="text-gray-400 text-xs">#{task.id}</span>
              <TodoItemLabel>{task.subject}</TodoItemLabel>
            </TodoItem>
          );
        })}
      </Todo>
    </div>
  );
};

export { ChatPageChatContentTasks };
