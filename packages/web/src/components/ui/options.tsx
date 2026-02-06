import type { HTMLAttributes } from "react";

import { cn } from "@/utils/helpers";

type OptionsProps = HTMLAttributes<HTMLDivElement>;

const Options = ({ className, ...props }: OptionsProps) => {
  return (
    <div
      data-slot="options"
      className={cn(
        "flex flex-col items-start",
        "w-fit",
        "gap-1 p-1",
        "bg-gray-200",
        "border border-gray-50 rounded-xl",
        className,
      )}
      {...props}
    />
  );
};

type OptionsListItemProps = HTMLAttributes<HTMLDivElement> & {
  selected?: boolean;
};

const OptionsListItem = ({ className, selected, ...props }: OptionsListItemProps) => {
  return (
    <div
      data-slot="options-list-item"
      data-selected={selected}
      className={cn(
        "inline-flex items-center justify-start",
        "w-full",
        "px-3 py-2",
        "rounded-lg",
        "text-base font-normal",
        "transition ease-in-out",
        selected ? "bg-gray-100 text-white" : "text-gray-450 line-through",
        className,
      )}
      {...props}
    />
  );
};

export { Options, OptionsListItem };
