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
        <DividerGridEdge position="left" className="hidden lg:flex col-span-1" />
        <DividerGridCell className="grid grid-cols-12 col-span-12 lg:col-span-10 border-l border-r">
          <DividerGridRow>
            <DividerGridCell className="col-span-12 md:col-span-9 lg:col-span-8 py-6 md:border-r" />
            <DividerGridCell className="hidden lg:flex col-span-12 md:col-span-3 lg:col-span-4 px-4" />
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
