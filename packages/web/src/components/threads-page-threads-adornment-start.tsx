"use client";

import { isServer } from "@tanstack/react-query";
import { useMediaQuery } from "usehooks-ts";

import { breakpoints } from "@/utils/breakpoints";

import {
  DividerGridRow,
  DividerGridEdge,
  DividerGridCell,
  DividerGridDivider,
} from "@/components/ui/divider-grid";

const ThreadsPageThreadsAdornmentStart = () => {
  const lg = useMediaQuery(breakpoints.lg, { initializeWithValue: isServer });

  if (!lg) return null;

  return (
    <DividerGridRow>
      <DividerGridEdge position="left" className="col-span-1" />
      <DividerGridCell className="grid grid-cols-12 col-span-10 border-b">
        <DividerGridCell className="flex justify-between col-span-8">
          <DividerGridDivider variant="top" />
          <DividerGridDivider variant="top" />
        </DividerGridCell>
        <DividerGridCell className="flex justify-end col-span-4">
          <DividerGridDivider variant="top" />
        </DividerGridCell>
      </DividerGridCell>
      <DividerGridEdge position="right" className="col-span-1" />
    </DividerGridRow>
  );
};

export { ThreadsPageThreadsAdornmentStart };
