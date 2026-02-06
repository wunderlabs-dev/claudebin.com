"use client";

import type { ReactNode } from "react";

import { Chip } from "@/components/ui/chip";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

type ThreadPageConversationChipProps = {
  icon?: ReactNode;
  label: string;
};

const ThreadPageConversationChip = ({ icon, label }: ThreadPageConversationChipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Chip icon={icon} label={label} className="max-w-full truncate sm:max-w-2xs" />
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { ThreadPageConversationChip };
