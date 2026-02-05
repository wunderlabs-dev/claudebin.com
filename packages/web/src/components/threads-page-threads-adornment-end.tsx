"use client";

import { isServer } from "@tanstack/react-query";
import { useMediaQuery } from "usehooks-ts";

import { breakpoints } from "@/utils/breakpoints";

import { DividerGridRow, DividerGridCell, DividerGridDivider } from "@/components/ui/divider-grid";

const ThreadsPageThreadsAdornmentEnd = () => {
  const lg = useMediaQuery(breakpoints.lg, { initializeWithValue: isServer });

  if (!lg) return null;

  return (
    <DividerGridRow>
      <DividerGridCell className="col-span-1" />
      <DividerGridCell className="col-span-10">
        <DividerGridRow>
          <DividerGridCell className="flex justify-between col-span-4">
            <DividerGridDivider variant="bottom" />
            <DividerGridDivider variant="bottom" />
          </DividerGridCell>
          <DividerGridCell className="flex justify-end col-span-4">
            <DividerGridDivider variant="bottom" />
          </DividerGridCell>
          <DividerGridCell className="flex justify-end col-span-4">
            <DividerGridDivider variant="bottom" />
          </DividerGridCell>
        </DividerGridRow>
      </DividerGridCell>
      <DividerGridCell className="col-span-1" />
    </DividerGridRow>
  );
};

export { ThreadsPageThreadsAdornmentEnd };
