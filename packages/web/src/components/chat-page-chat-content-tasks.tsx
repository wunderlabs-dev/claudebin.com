import type { TasksBlock, TaskItem } from "@/supabase/types/message";

import { cn } from "@/utils/helpers";

type ChatPageChatContentTasksProps = {
  block: TasksBlock;
};

const TaskStatusIcon = ({ status }: { status: TaskItem["status"] }) => {
  switch (status) {
    case "completed":
      return <span className="text-green-600">✓</span>;
    case "in_progress":
      return <span className="text-blue-500">●</span>;
    default:
      return <span className="text-gray-400">◻</span>;
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
      <ul className="space-y-1">
        {block.tasks.map((task) => (
          <li
            key={task.id}
            className={cn(
              "flex items-center gap-2 text-sm",
              task.status === "completed" && "text-gray-400 line-through",
            )}
          >
            <TaskStatusIcon status={task.status} />
            <span className="text-gray-500">#{task.id}</span>
            <span>{task.subject}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { ChatPageChatContentTasks };
