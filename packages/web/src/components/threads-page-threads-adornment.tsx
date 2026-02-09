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
  if (variant === "start") {
    return (
      <DividerGridRow className="hidden lg:grid">
        <DividerGridEdge position="left" className="col-span-1" />
        <DividerGridCell className="grid col-span-10 grid-cols-12 border-b">
          <DividerGridCell className="flex col-span-8 justify-between">
            <DividerGridDivider variant="top" />
            <DividerGridDivider variant="top" />
          </DividerGridCell>
          <DividerGridCell className="flex col-span-4 justify-end">
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
        <DividerGridEdge position="left" className="hidden lg:flex col-span-1" />
        <DividerGridCell className="grid col-span-12 grid-cols-12 border-l border-r lg:col-span-10">
          <DividerGridRow>
            <DividerGridCell className="col-span-9 py-6 border-r lg:col-span-8" />
            <DividerGridCell className="flex col-span-3 items-center justify-end px-4 lg:col-span-4" />
          </DividerGridRow>
        </DividerGridCell>
        <DividerGridEdge position="right" className="hidden lg:flex col-span-1" />
      </DividerGridRow>
    );
  }

  if (variant === "end") {
    return (
      <DividerGridRow className="hidden lg:grid">
        <DividerGridCell className="col-span-1" />
        <DividerGridCell className="col-span-10">
          <DividerGridRow>
            <DividerGridCell className="flex col-span-4 justify-between">
              <DividerGridDivider variant="bottom" />
              <DividerGridDivider variant="bottom" />
            </DividerGridCell>
            <DividerGridCell className="flex col-span-4 justify-end">
              <DividerGridDivider variant="bottom" />
            </DividerGridCell>
            <DividerGridCell className="flex col-span-4 justify-end">
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
