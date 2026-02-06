"use client";

import { not } from "ramda";
import { isServer } from "@tanstack/react-query";
import { useMediaQuery } from "usehooks-ts";

import { breakpoints } from "@/utils/breakpoints";

import {
  DividerGridRow,
  DividerGridEdge,
  DividerGridCell,
  DividerGridDivider,
} from "@/components/ui/divider-grid";

const ThreadsPageThreadsAdornmentVariants = ["start", "spacer", "end"] as const;
type ThreadsPageThreadsAdornmentVariant = (typeof ThreadsPageThreadsAdornmentVariants)[number];

type ThreadsPageThreadsAdornmentProps = {
  variant: ThreadsPageThreadsAdornmentVariant;
};

const ThreadsPageThreadsAdornment = ({ variant }: ThreadsPageThreadsAdornmentProps) => {
  const lg = useMediaQuery(breakpoints.lg, { initializeWithValue: isServer });

  if (variant === "start") {
    if (not(lg)) {
      return null;
    }
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
  }

  if (variant === "spacer") {
    return (
      <DividerGridRow>
        {lg ? <DividerGridEdge position="left" className="col-span-1" /> : null}
        <DividerGridCell className="grid grid-cols-12 col-span-12 border-l border-r lg:col-span-10">
          <DividerGridRow>
            <DividerGridCell className="col-span-9 py-6 border-r lg:col-span-8" />
            <DividerGridCell className="flex items-center justify-end col-span-3 px-4 lg:col-span-4" />
          </DividerGridRow>
        </DividerGridCell>
        {lg ? <DividerGridEdge position="right" className="col-span-1" /> : null}
      </DividerGridRow>
    );
  }

  if (variant === "end") {
    if (not(lg)) {
      return null;
    }
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
  }

  return null;
};

export { ThreadsPageThreadsAdornment };
