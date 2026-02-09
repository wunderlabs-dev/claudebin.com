"use client";

import { createContext, useContext, type ComponentProps } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/utils/helpers";

const TabsVariants = ["default", "transparent"] as const;

type TabsVariant = (typeof TabsVariants)[number];

const TabsContext = createContext<TabsVariant>("default");

type TabsProps = ComponentProps<typeof TabsPrimitive.Root> & {
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

const TabsList = ({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) => {
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
  default:
    "cursor-pointer hover:text-white data-[state=active]:bg-gray-100 data-[state=active]:text-white",
  transparent:
    "border border-transparent cursor-pointer hover:text-white data-[state=active]:border-gray-50 data-[state=active]:text-white",
} as const;

const TabsTrigger = ({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) => {
  const variant = useContext(TabsContext);

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center",
        "h-full",
        "px-6 py-2",
        "rounded-full",
        "text-base font-normal text-gray-450",
        "transition-colors duration-150 ease-in-out",
        "active:scale-98",
        "disabled:pointer-events-none disabled:opacity-50",
        tabsTriggerVariantClassNames[variant],
        className,
      )}
      {...props}
    />
  );
};

const TabsContent = ({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) => {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
