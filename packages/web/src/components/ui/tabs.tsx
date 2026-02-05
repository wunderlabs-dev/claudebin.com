"use client";

import { createContext, useContext } from "react";
import type * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/utils/helpers";

const TabsVariants = ["default", "transparent"] as const;

type TabsVariant = (typeof TabsVariants)[number];

const TabsContext = createContext<TabsVariant>("default");

type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root> & {
  variant?: TabsVariant;
};

const Tabs = ({ className, variant = "default", ...props }: TabsProps) => {
  return (
    <TabsContext.Provider value={variant}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-variant={variant}
        className={cn("flex flex-col", className)}
        {...props}
      />
    </TabsContext.Provider>
  );
};

const tabsListVariantClassNames: Record<TabsVariant, string> = {
  default: "p-1 bg-gray-200 border border-gray-50 rounded-full",
  transparent: "p-1 border border-transparent rounded-full",
} as const;

const TabsList = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) => {
  const variant = useContext(TabsContext);

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex items-center",
        "h-14 w-fit",
        "gap-1",
        tabsListVariantClassNames[variant],
        className,
      )}
      {...props}
    />
  );
};

const tabsTriggerVariantClassNames: Record<TabsVariant, string> = {
  default: "data-[state=active]:bg-gray-100 data-[state=active]:text-white",
  transparent:
    "border border-transparent data-[state=active]:border-gray-50 data-[state=active]:text-white",
} as const;

const TabsTrigger = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) => {
  const variant = useContext(TabsContext);

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center",
        "h-full",
        "px-6 py-2",
        "rounded-full",
        "font-normal text-base text-gray-450",
        "cursor-pointer select-none",
        "transition ease-in-out",
        "hover:text-white",
        "disabled:pointer-events-none disabled:opacity-50",
        tabsTriggerVariantClassNames[variant],
        className,
      )}
      {...props}
    />
  );
};

const TabsContent = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) => {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
