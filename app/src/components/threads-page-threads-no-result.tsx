import { useTranslations } from "next-intl";

import { gradient } from "@/utils/renderers";

import { Typography } from "@/components/ui/typography";

import { DividerGridRow, DividerGridEdge, DividerGridCell } from "@/components/ui/divider-grid";

type ThreadsPageThreadsNoResultProps = {
  query?: string;
};

const ThreadsPageThreadsNoResult = ({ query }: ThreadsPageThreadsNoResultProps) => {
  const t = useTranslations();

  if (query) {
    return (
      <DividerGridRow>
        <DividerGridEdge position="left" className="hidden lg:flex col-span-1" />
        <DividerGridCell className="col-span-12 lg:col-span-10 px-8 py-24 lg:px-12 border-t border-r border-b border-l">
          <div className="flex flex-col max-w-lg gap-6 mx-auto">
            <Typography variant="h2" leading="normal" className="whitespace-break-spaces">
              {t.rich("threads.emptyTitle", { gradient, query })}
            </Typography>
            <Typography variant="body" color="muted">
              {t("threads.emptyDescription")}
            </Typography>
          </div>
        </DividerGridCell>
        <DividerGridEdge position="right" className="hidden lg:flex col-span-1" />
      </DividerGridRow>
    );
  }
  return (
    <DividerGridRow>
      <DividerGridEdge position="left" className="hidden lg:flex col-span-1" />
      <DividerGridCell className="col-span-12 lg:col-span-10 px-8 py-24 lg:px-12 border-t border-r border-b border-l">
        <div className="flex flex-col max-w-lg gap-6 mx-auto">
          <Typography variant="h2" leading="normal" className="whitespace-break-spaces">
            {t.rich("threads.noThreadsTitle", { gradient })}
          </Typography>
          <Typography variant="body" color="muted">
            {t("threads.noThreadsDescription")}
          </Typography>
        </div>
      </DividerGridCell>
      <DividerGridEdge position="right" className="hidden lg:flex col-span-1" />
    </DividerGridRow>
  );
};

export { ThreadsPageThreadsNoResult };
