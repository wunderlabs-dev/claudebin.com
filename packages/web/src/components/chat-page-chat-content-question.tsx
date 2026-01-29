import type { QuestionBlock } from "@/supabase/types/message";

type ChatPageChatContentQuestionProps = {
  block: QuestionBlock;
};

const ChatPageChatContentQuestion = ({ block }: ChatPageChatContentQuestionProps) => {
  return (
    <div className="flex flex-col gap-2">
      {block.questions.map((question) => (
        <div key={question.header} className="flex flex-col gap-1 text-xs">
          <span className="font-medium">{question.question}</span>
          <div className="flex flex-wrap gap-1">
            {question.options.map((option) => (
              <span
                key={option.label}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600"
              >
                {option.label}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export { ChatPageChatContentQuestion };
