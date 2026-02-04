"use client";

import type { ReactNode } from "react";

import { Chip } from "@/components/ui/chip";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

type ChatPageChatContentChipProps = {
  icon?: ReactNode;
  label: string;
};

const ChatPageChatContentChip = ({ icon, label }: ChatPageChatContentChipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Chip icon={icon} label={label} />
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { ChatPageChatContentChip };
