import type { TodoBlock } from "@/supabase/types/message";

import { Todo, TodoItem, TodoItemIcon, TodoItemLabel } from "@/components/ui/todo";

type ChatPageChatContentTodoProps = {
  block: TodoBlock;
};

const todoStatusIconMap: Record<TodoBlock["todos"][number]["status"], string> = {
  completed: "✓",
  in_progress: "●",
  pending: "○",
};

const todoStatusVariantMap: Record<
  TodoBlock["todos"][number]["status"],
  "completed" | "progress" | "pending"
> = {
  completed: "completed",
  in_progress: "progress",
  pending: "pending",
};

const ChatPageChatContentTodo = ({ block }: ChatPageChatContentTodoProps) => {
  return (
    <Todo>
      {block.todos.map((todo) => (
        <TodoItem key={todo.content} variant={todoStatusVariantMap[todo.status]}>
          <TodoItemIcon>{todoStatusIconMap[todo.status]}</TodoItemIcon>
          <TodoItemLabel>{todo.content}</TodoItemLabel>
        </TodoItem>
      ))}
    </Todo>
  );
};

export { ChatPageChatContentTodo };
