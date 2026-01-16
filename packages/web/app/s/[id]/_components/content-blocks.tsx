const TextContent = ({ text }: { text: string }) => (
  <div className="whitespace-pre-wrap text-sm">{text}</div>
);

const ToolResultContent = ({
  content,
  isError,
}: {
  content: string;
  isError?: boolean;
}) => (
  <div
    className={`mt-2 p-3 rounded border ${
      isError
        ? "bg-red-50 border-red-200 text-red-800"
        : "bg-green-50 border-green-200 text-green-800"
    }`}
  >
    <pre className="text-xs whitespace-pre-wrap overflow-x-auto">
      {content.slice(0, 1000)}
      {content.length > 1000 && "..."}
    </pre>
  </div>
);

const GenericToolContent = ({
  name,
  input,
}: {
  name: string;
  input: Record<string, unknown>;
}) => (
  <div className="mt-2 p-3 bg-gray-100 rounded border border-gray-200">
    <div className="text-xs font-mono text-purple-600 mb-1">{name}</div>
    <pre className="text-xs overflow-x-auto">
      {JSON.stringify(input, null, 2)}
    </pre>
  </div>
);

const BashContent = ({
  command,
  description,
}: {
  command: string;
  description?: string;
}) => (
  <div className="mt-2 p-3 bg-gray-900 rounded border border-gray-700">
    <div className="text-xs text-gray-400 mb-1">
      {description || "Terminal"}
    </div>
    <pre className="text-sm text-green-400 font-mono overflow-x-auto">
      $ {command}
    </pre>
  </div>
);

const FileReadContent = ({ file_path }: { file_path: string }) => (
  <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
    <div className="text-xs text-green-600 mb-1">Read</div>
    <code className="text-sm font-mono text-green-800">{file_path}</code>
  </div>
);

const FileWriteContent = ({ file_path }: { file_path: string }) => (
  <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
    <div className="text-xs text-blue-600 mb-1">Write</div>
    <code className="text-sm font-mono text-blue-800">{file_path}</code>
  </div>
);

const FileEditContent = ({ file_path }: { file_path: string }) => (
  <div className="mt-2 p-3 bg-yellow-50 rounded border border-yellow-200">
    <div className="text-xs text-yellow-600 mb-1">Edit</div>
    <code className="text-sm font-mono text-yellow-800">{file_path}</code>
  </div>
);

const GlobContent = ({ pattern, path }: { pattern: string; path?: string }) => (
  <div className="mt-2 p-3 bg-cyan-50 rounded border border-cyan-200">
    <div className="text-xs text-cyan-600 mb-1">Glob</div>
    <code className="text-sm font-mono text-cyan-800">
      {path ? `${path}/` : ""}
      {pattern}
    </code>
  </div>
);

const GrepContent = ({ pattern, path }: { pattern: string; path?: string }) => (
  <div className="mt-2 p-3 bg-cyan-50 rounded border border-cyan-200">
    <div className="text-xs text-cyan-600 mb-1">Grep</div>
    <code className="text-sm font-mono text-cyan-800">
      /{pattern}/ {path && `in ${path}`}
    </code>
  </div>
);

const TodoContent = ({
  todos,
}: {
  todos: Array<{
    content: string;
    status: "pending" | "in_progress" | "completed";
  }>;
}) => (
  <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
    <div className="text-xs text-green-600 mb-2">Todos</div>
    <ul className="space-y-1">
      {todos.map((todo) => (
        <li key={todo.content} className="flex items-center gap-2 text-sm">
          <span
            className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
              todo.status === "completed"
                ? "bg-green-500 border-green-500 text-white"
                : todo.status === "in_progress"
                  ? "bg-yellow-500 border-yellow-500 text-white"
                  : "border-gray-300"
            }`}
          >
            {todo.status === "completed" && "✓"}
            {todo.status === "in_progress" && "→"}
          </span>
          <span
            className={
              todo.status === "completed" ? "text-gray-500 line-through" : ""
            }
          >
            {todo.content}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

const QuestionContent = ({
  questions,
}: {
  questions: Array<{
    question: string;
    header: string;
    options: Array<{ label: string; description: string }>;
  }>;
}) => (
  <div className="mt-2 p-3 bg-pink-50 rounded border border-pink-200">
    <div className="text-xs text-pink-600 mb-2">Question</div>
    {questions.map((q) => (
      <div key={q.question} className="mb-2 last:mb-0">
        <div className="text-sm font-medium text-pink-800">{q.question}</div>
        <div className="mt-1 space-y-1">
          {q.options.map((opt) => (
            <div key={opt.label} className="text-xs text-pink-700 pl-2">
              • {opt.label}
              {opt.description && (
                <span className="text-pink-500"> — {opt.description}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const TaskContent = ({
  description,
  subagent_type,
}: {
  description: string;
  subagent_type: string;
}) => (
  <div className="mt-2 p-3 bg-purple-50 rounded border border-purple-200">
    <div className="text-xs text-purple-600 mb-1">Task ({subagent_type})</div>
    <div className="text-sm text-purple-800">{description}</div>
  </div>
);

const WebSearchContent = ({ query }: { query: string }) => (
  <div className="mt-2 p-3 bg-indigo-50 rounded border border-indigo-200">
    <div className="text-xs text-indigo-600 mb-1">Web Search</div>
    <div className="text-sm text-indigo-800">{query}</div>
  </div>
);

const WebFetchContent = ({ url }: { url: string }) => (
  <div className="mt-2 p-3 bg-indigo-50 rounded border border-indigo-200">
    <div className="text-xs text-indigo-600 mb-1">Web Fetch</div>
    <code className="text-sm font-mono text-indigo-800">{url}</code>
  </div>
);

export {
  TextContent,
  ToolResultContent,
  GenericToolContent,
  BashContent,
  FileReadContent,
  FileWriteContent,
  FileEditContent,
  GlobContent,
  GrepContent,
  TodoContent,
  QuestionContent,
  TaskContent,
  WebSearchContent,
  WebFetchContent,
};
