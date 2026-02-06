type QuestionOption = {
  label: string;
  description: string;
};

type QuestionOptionsMultiProps = {
  options: QuestionOption[];
  selected: string[];
};

const QuestionOptionsMulti = ({ options, selected }: QuestionOptionsMultiProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option.label);
        return (
          <div
            key={option.label}
            className={`px-3 py-1 rounded-sm text-sm ${
              isSelected ? "bg-orange-50 text-gray-900" : "bg-gray-800 text-gray-400"
            }`}
          >
            {option.label}
          </div>
        );
      })}
    </div>
  );
};

export { QuestionOptionsMulti };
export type { QuestionOption };
