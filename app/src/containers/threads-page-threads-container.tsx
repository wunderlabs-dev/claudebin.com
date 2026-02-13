"use client";

import { useState, useMemo, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounceValue } from "usehooks-ts";
import { not, isEmpty } from "ramda";

import type { ThreadWithAuthor } from "@/server/repos/sessions";
import { getPublicThreads } from "@/server/actions/threads";

import { SEARCH_DEBOUNCE_MS, THREADS_PAGE_INITIAL } from "@/utils/constants";
import { cn } from "@/utils/helpers";

import { SvgIconMagnifier } from "@/components/icon/svg-icon-magnifier";
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
import { ThreadsPageThreadsNoResult } from "@/components/threads-page-threads-no-result";

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
        <DividerGridEdge position="left" className="col-span-1 hidden lg:flex" />
        <DividerGridCell className="col-span-12 grid grid-cols-12 border-t border-r border-b border-l lg:col-span-10 lg:border-t-0">
          <DividerGridRow>
            <DividerGridCell className="col-span-12 md:col-span-9 md:border-r lg:col-span-8">
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
            <DividerGridCell
              className={cn(
                "col-span-12 flex items-center px-4 md:col-span-3 md:justify-end lg:col-span-4",
                hasSearchQuery ? "border-t py-3 md:border-t-0" : undefined,
              )}
            >
              {hasSearchQuery ? (
                <Typography variant="small" color="muted">
                  {t("threads.threadCount", { count: threads.length })}
                </Typography>
              ) : null}
            </DividerGridCell>
          </DividerGridRow>
        </DividerGridCell>
        <DividerGridEdge position="right" className="col-span-1 hidden lg:flex" />
      </DividerGridRow>

      <ThreadsPageThreadsAdornment variant="spacer" />
      {hasNoResult ? <ThreadsPageThreadsNoResult query={queryDebounced} /> : null}

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
              <DividerGridEdge position="left" className="col-span-1 hidden lg:flex" />
              <DividerGridCell className="col-span-12 lg:col-span-10">
                <Card variant="grid">
                  <CardBody className="hidden lg:flex" />
                  <CardBody className="items-center justify-center md:p-0">
                    <Button
                      variant="secondary"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? t("threads.loadingMore") : t("threads.loadMore")}
                    </Button>
                  </CardBody>
                  <CardBody className="hidden lg:flex" />
                </Card>
              </DividerGridCell>
              <DividerGridEdge position="right" className="col-span-1 hidden lg:flex" />
            </DividerGridRow>
          ) : null}
        </Fragment>
      ) : null}

      {isEmpty(threads) && isEmpty(queryDebounced) ? <ThreadsPageThreadsNoResult /> : null}
      <ThreadsPageThreadsAdornment variant="end" />
    </DividerGrid>
  );
};

export { ThreadsPageThreadsContainer };
