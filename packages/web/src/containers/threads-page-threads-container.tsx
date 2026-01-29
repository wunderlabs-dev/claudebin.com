"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounceValue } from "usehooks-ts";
import { isEmpty, not, trim } from "ramda";

import type { ThreadWithAuthor } from "@/supabase/repos/sessions";

import { getPublicThreads, THREADS_PAGE_INITIAL } from "@/actions/threads";

import { renderers } from "@/utils/renderers";
import { SEARCH_INPUT_DEBOUNCE_MS } from "@/utils/constants";

import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { FormControl, Input } from "@/components/ui/form-control";
import { Typography } from "@/components/ui/typography";
import { SvgIconMagnifier } from "@/components/icon";

import {
  DividerGrid,
  DividerGridRow,
  DividerGridEdge,
  DividerGridCell,
  DividerGridDivider,
} from "@/components/ui/divider-grid";

import { ThreadsPageThreadGridItem } from "@/components/threads-page-thread-grid-item";

type ThreadsPageThreadsContainerProps = {
  initialThreads: ThreadWithAuthor[];
  initialTotal: number;
  initialNextOffset: number | null;
  initialQuery?: string;
};

const ThreadsPageThreadsContainer = ({
  initialThreads,
  initialTotal,
  initialNextOffset,
  initialQuery = "",
}: ThreadsPageThreadsContainerProps) => {
  const t = useTranslations();
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [queryDebounced] = useDebounceValue(query, SEARCH_INPUT_DEBOUNCE_MS);

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["threads", queryDebounced],
    queryFn: ({ pageParam }) => getPublicThreads(queryDebounced, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: THREADS_PAGE_INITIAL,
    initialData: {
      pageParams: [THREADS_PAGE_INITIAL],
      pages: [{ threads: initialThreads, total: initialTotal, nextOffset: initialNextOffset }],
    },
  });

  const threads = data?.pages.flatMap((page) => page.threads) ?? [];
  const hasSearchQuery = trim(queryDebounced).length;
  const hasActiveSearch = isFetching && not(isFetchingNextPage);
  const hasNoResult = hasSearchQuery && not(isFetching) && isEmpty(threads);

  useEffect(() => {
    if (queryDebounced) {
      router.replace(`/threads?query=${encodeURIComponent(queryDebounced)}`);
    } else {
      router.replace("/threads");
    }
  }, [queryDebounced, router]);

  return (
    <DividerGrid>
      <DividerGridRow>
        <DividerGridEdge position="left" className="col-span-1" />
        <DividerGridCell className="col-span-6 border-b">
          <DividerGridDivider variant="top" />
        </DividerGridCell>
        <DividerGridCell className="flex col-span-4 justify-between border-b">
          <DividerGridDivider variant="top" />
          <DividerGridDivider variant="top" />
        </DividerGridCell>
        <DividerGridEdge position="right" className="col-span-1" />
      </DividerGridRow>

      <DividerGridRow>
        <DividerGridEdge position="left" className="col-span-1" />
        <DividerGridCell className="col-span-6 border-l border-r border-b">
          <FormControl className="flex-row items-center">
            <Input
              placeholder={t("threads.searchPlaceholder")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Button variant="outline" disabled={hasActiveSearch}>
              <SvgIconMagnifier size="sm" />
              {hasActiveSearch ? t("threads.searching") : t("threads.search")}
            </Button>
          </FormControl>
        </DividerGridCell>
        <DividerGridCell className="flex col-span-4 items-center justify-end px-3 border-r border-b">
          {hasSearchQuery ? (
            <Typography variant="small" color="muted">
              {t("threads.threadCount", { count: threads.length })}
            </Typography>
          ) : null}
        </DividerGridCell>
        <DividerGridEdge position="right" className="col-span-1" />
      </DividerGridRow>

      <DividerGridRow>
        <DividerGridEdge position="left" className="col-span-1" />
        <DividerGridCell className="col-span-6 py-6 border-l border-r border-b" />
        <DividerGridCell className="flex col-span-4 items-center justify-end py-6 border-r border-b" />
        <DividerGridEdge position="right" className="col-span-1" />
      </DividerGridRow>

      {hasNoResult ? (
        <DividerGridRow>
          <DividerGridEdge position="left" className="col-span-1" />
          <DividerGridCell className="col-span-10 px-12 py-24 border-l border-r border-b">
            <div className="flex flex-col max-w-lg mx-auto gap-6">
              <Typography variant="h2" leading="normal" className="whitespace-break-spaces">
                {t.rich("threads.emptyTitle", { ...renderers, query: queryDebounced })}
              </Typography>
              <Typography variant="body" color="muted">
                {t("threads.emptyDescription")}
              </Typography>
            </div>
          </DividerGridCell>
          <DividerGridEdge position="right" className="col-span-1" />
        </DividerGridRow>
      ) : null}

      {threads.length ? (
        <>
          {threads.map((thread) => (
            <DividerGridRow key={thread.id}>
              <DividerGridEdge position="left" className="col-span-1" />
              <DividerGridCell className="col-span-10">
                <ThreadsPageThreadGridItem thread={thread} />
              </DividerGridCell>
              <DividerGridEdge position="right" className="col-span-1" />
            </DividerGridRow>
          ))}

          {hasNextPage ? (
            <DividerGridRow>
              <DividerGridEdge position="left" className="col-span-1" />
              <DividerGridCell className="col-span-10">
                <Card variant="grid">
                  <CardBody />
                  <CardBody className="items-center justify-center p-0">
                    <Button
                      variant="secondary"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? t("threads.loadingMore") : t("threads.loadMore")}
                    </Button>
                  </CardBody>
                  <CardBody />
                </Card>
              </DividerGridCell>
              <DividerGridEdge position="right" className="col-span-1" />
            </DividerGridRow>
          ) : null}
        </>
      ) : null}

      <DividerGridRow>
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
    </DividerGrid>
  );
};

export { ThreadsPageThreadsContainer };
