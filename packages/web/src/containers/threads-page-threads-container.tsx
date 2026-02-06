"use client";

import { useState, useMemo, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { isServer, useInfiniteQuery } from "@tanstack/react-query";
import { useDebounceValue, useMediaQuery } from "usehooks-ts";
import { not, isEmpty } from "ramda";

import type { ThreadWithAuthor } from "@/supabase/repos/sessions";

import { SEARCH_DEBOUNCE_MS } from "@/utils/constants";
import { getPublicThreads, THREADS_PAGE_INITIAL } from "@/actions/threads";

import { gradient } from "@/utils/renderers";
import { breakpoints } from "@/utils/breakpoints";

import { SvgIconMagnifier } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { FormControl, Input } from "@/components/ui/form-control";
import { Typography } from "@/components/ui/typography";

import {
  DividerGrid,
  DividerGridRow,
  DividerGridEdge,
  DividerGridCell,
} from "@/components/ui/divider-grid";

import { ThreadsPageThreadGridItem } from "@/components/threads-page-thread-grid-item";
import { ThreadsPageThreadsAdornment } from "@/components/threads-page-threads-adornment";

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
  initialQuery,
}: ThreadsPageThreadsContainerProps) => {
  const t = useTranslations();
  const router = useRouter();
  const lg = useMediaQuery(breakpoints.lg, { initializeWithValue: isServer });

  const [query, setQuery] = useState(initialQuery);
  const [queryDebounced] = useDebounceValue(query, SEARCH_DEBOUNCE_MS);

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

  const threads = useMemo(() => data?.pages.flatMap((page) => page.threads) ?? [], [data?.pages]);

  const hasSearchQuery = queryDebounced?.trim().length;
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
      <ThreadsPageThreadsAdornment variant="start" />

      <DividerGridRow>
        {lg ? <DividerGridEdge position="left" className="col-span-1" /> : null}
        <DividerGridCell className="grid grid-cols-12 col-span-12 border-t border-r border-b border-l lg:col-span-10 lg:border-t-0">
          <DividerGridRow>
            <DividerGridCell className="col-span-9 border-r lg:col-span-8">
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
            <DividerGridCell className="flex items-center justify-end col-span-3 px-4 lg:col-span-4">
              {hasSearchQuery ? (
                <Typography variant="small" color="muted">
                  {t("threads.threadCount", { count: threads.length })}
                </Typography>
              ) : null}
            </DividerGridCell>
          </DividerGridRow>
        </DividerGridCell>
        {lg ? <DividerGridEdge position="right" className="col-span-1" /> : null}
      </DividerGridRow>

      <ThreadsPageThreadsAdornment variant="spacer" />

      {hasNoResult ? (
        <DividerGridRow>
          {lg ? <DividerGridEdge position="left" className="col-span-1" /> : null}
          <DividerGridCell className="col-span-12 px-8 py-24 border-t border-r border-b border-l lg:px-12">
            <div className="flex flex-col max-w-lg gap-6 mx-auto">
              <Typography variant="h2" leading="normal" className="whitespace-break-spaces">
                {t.rich("threads.emptyTitle", { gradient, query: queryDebounced })}
              </Typography>
              <Typography variant="body" color="muted">
                {t("threads.emptyDescription")}
              </Typography>
            </div>
          </DividerGridCell>
          {lg ? <DividerGridEdge position="right" className="col-span-1" /> : null}
        </DividerGridRow>
      ) : null}

      {threads.length ? (
        <Fragment>
          {threads.map((thread) => (
            <DividerGridRow key={thread.id}>
              <DividerGridEdge position="left" className="col-span-1" />
              <DividerGridCell className="col-span-12 lg:col-span-10">
                <ThreadsPageThreadGridItem thread={thread} />
              </DividerGridCell>
              <DividerGridEdge position="right" className="col-span-1" />
            </DividerGridRow>
          ))}

          {hasNextPage ? (
            <DividerGridRow>
              {lg ? <DividerGridEdge position="left" className="col-span-1" /> : null}
              <DividerGridCell className="col-span-12 lg:col-span-10">
                <Card variant="grid">
                  {lg ? <CardBody /> : null}
                  <CardBody className="items-center justify-center md:p-0">
                    <Button
                      variant="secondary"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? t("threads.loadingMore") : t("threads.loadMore")}
                    </Button>
                  </CardBody>
                  {lg ? <CardBody /> : null}
                </Card>
              </DividerGridCell>
              {lg ? <DividerGridEdge position="right" className="col-span-1" /> : null}
            </DividerGridRow>
          ) : null}
        </Fragment>
      ) : null}

      <ThreadsPageThreadsAdornment variant="end" />
    </DividerGrid>
  );
};

export { ThreadsPageThreadsContainer };
