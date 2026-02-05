"use client";

import { isServer } from "@tanstack/react-query";
import { useMediaQuery } from "usehooks-ts";

import { breakpoints } from "@/utils/breakpoints";

import { DividerGridRow, DividerGridEdge, DividerGridCell } from "@/components/ui/divider-grid";

const ThreadsPageThreadsAdornmentSpacer = () => {
  const lg = useMediaQuery(breakpoints.lg, { initializeWithValue: isServer });

  return (
    <DividerGridRow>
      {lg ? <DividerGridEdge position="left" className="col-span-1" /> : null}
      <DividerGridCell className="grid grid-cols-12 col-span-12 lg:col-span-10 border-r border-l">
        <DividerGridRow>
          <DividerGridCell className="col-span-9 lg:col-span-8 py-6 border-r" />
          <DividerGridCell className="flex items-center justify-end col-span-3 lg:col-span-4 px-4" />
        </DividerGridRow>
      </DividerGridCell>
      {lg ? <DividerGridEdge position="right" className="col-span-1" /> : null}
    </DividerGridRow>
  );
};

export { ThreadsPageThreadsAdornmentSpacer };
