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
        <DividerGridCell className="col-span-10 grid grid-cols-12 border-b">
          <DividerGridCell className="col-span-8 flex justify-between">
            <DividerGridDivider variant="top" />
            <DividerGridDivider variant="top" />
          </DividerGridCell>
          <DividerGridCell className="col-span-4 flex justify-end">
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
        <DividerGridEdge position="left" className="col-span-1 hidden lg:flex" />
        <DividerGridCell className="col-span-12 grid grid-cols-12 border-r border-l lg:col-span-10">
          <DividerGridRow>
            <DividerGridCell className="col-span-12 py-6 md:col-span-9 md:border-r lg:col-span-8" />
            <DividerGridCell className="col-span-12 hidden px-4 md:col-span-3 lg:col-span-4 lg:flex" />
          </DividerGridRow>
        </DividerGridCell>
        <DividerGridEdge position="right" className="col-span-1 hidden lg:flex" />
      </DividerGridRow>
    );
  }
  if (variant === "end") {
    return (
      <DividerGridRow className="hidden lg:grid">
        <DividerGridCell className="col-span-1" />
        <DividerGridCell className="col-span-10">
          <DividerGridRow>
            <DividerGridCell className="col-span-4 flex justify-between">
              <DividerGridDivider variant="bottom" />
              <DividerGridDivider variant="bottom" />
            </DividerGridCell>
            <DividerGridCell className="col-span-4 flex justify-end">
              <DividerGridDivider variant="bottom" />
            </DividerGridCell>
            <DividerGridCell className="col-span-4 flex justify-end">
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
