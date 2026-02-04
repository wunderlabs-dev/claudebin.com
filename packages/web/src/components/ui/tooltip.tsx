"use client";

import type * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/utils/helpers";

type TooltipProviderProps = React.ComponentProps<typeof TooltipPrimitive.Provider>;

const TooltipProvider = (props: TooltipProviderProps) => {
  return <TooltipPrimitive.Provider {...props} />;
};

type TooltipProps = React.ComponentProps<typeof TooltipPrimitive.Root>;

const Tooltip = (props: TooltipProps) => {
  return <TooltipPrimitive.Root {...props} />;
};

type TooltipTriggerProps = React.ComponentProps<typeof TooltipPrimitive.Trigger>;

const TooltipTrigger = (props: TooltipTriggerProps) => {
  return <TooltipPrimitive.Trigger {...props} />;
};

type TooltipContentProps = React.ComponentProps<typeof TooltipPrimitive.Content>;

const TooltipContent = ({ className, sideOffset = 6, ...props }: TooltipContentProps) => {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-w-sm",
          "px-3 py-1.5",
          "rounded-lg border border-gray-250 bg-gray-100",
          "text-white text-xs break-all",
          "fade-in-0 zoom-in-95 animate-in",
          className,
        )}
        onClick={event => event.stopPropagation()}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
};

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent };
