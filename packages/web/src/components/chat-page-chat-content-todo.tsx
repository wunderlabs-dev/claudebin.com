import type { TodoBlock } from "@/supabase/types/message";

type ChatPageChatContentTodoProps = {
  block: TodoBlock;
};

const ChatPageChatContentTodo = ({ block }: ChatPageChatContentTodoProps) => {
  return (
    <div className="flex flex-col gap-1 text-xs">
      {block.todos.map((todo) => (
        <div key={todo.content} className="flex items-center gap-2">
          <span className="text-gray-400">
            {todo.status === "completed" ? "✓" : todo.status === "in_progress" ? "●" : "○"}
          </span>
          <span className={todo.status === "completed" ? "text-gray-400 line-through" : ""}>
            {todo.content}
          </span>
        </div>
      ))}
    </div>
  );
};

export { ChatPageChatContentTodo };
