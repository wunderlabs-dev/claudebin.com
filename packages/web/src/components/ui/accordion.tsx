"use client";

import type * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "@/utils/helpers";

import { SvgIconArrowBottom } from "@/components/icon";
import { useChatItemRole } from "@/components/ui/chat";

type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root>;

const Accordion = ({ className, ...props }: AccordionProps) => {
  const variant = useChatItemRole();

  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn(
        "min-w-full md:min-w-sm lg:min-w-md xl:min-w-xl",
        "px-4",
        "border rounded-xl",
        variant === "user" ? "border-gray-250" : "border-gray-200",
        "[&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
};

type AccordionItemProps = React.ComponentProps<typeof AccordionPrimitive.Item>;

const AccordionItem = ({ className, ...props }: AccordionItemProps) => {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  );
};

type AccordionTriggerProps = React.ComponentProps<typeof AccordionPrimitive.Trigger>;

const AccordionTrigger = ({ className, children, ...props }: AccordionTriggerProps) => {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group",
          "flex flex-1 items-center justify-between",
          "w-full",
          "gap-3 py-3",
          "font-mono text-left text-base font-medium",
          "cursor-pointer",
          "transition ease-in-out",
          "disabled:pointer-events-none disabled:opacity-50",
          "[&[data-state=open]>span]:rotate-180",
          className,
        )}
        {...props}
      >
        <div className="flex flex-1 items-center gap-4">{children}</div>
        <span className="text-gray-400 transition-all duration-200 ease-in-out group-hover:text-white">
          <SvgIconArrowBottom size="md" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
};

type AccordionContentProps = React.ComponentProps<typeof AccordionPrimitive.Content>;

const AccordionContent = ({ className, children, ...props }: AccordionContentProps) => {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("flex flex-col items-start gap-2 pb-4", "text-gray-400", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
