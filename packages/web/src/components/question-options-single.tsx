import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type QuestionOption = {
  label: string;
  description: string;
};

type QuestionOptionsSingleProps = {
  options: QuestionOption[];
  selected?: string;
};

const QuestionOptionsSingle = ({ options, selected }: QuestionOptionsSingleProps) => {
  return (
    <Tabs variant="list" value={selected}>
      <TabsList>
        {options.map((option) => (
          <TabsTrigger key={option.label} value={option.label}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export { QuestionOptionsSingle };
