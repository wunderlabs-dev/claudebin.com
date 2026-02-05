"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounceValue } from "usehooks-ts";
import { not, isEmpty } from "ramda";

import type { ThreadWithAuthor } from "@/supabase/repos/sessions";

import { SEARCH_DEBOUNCE_MS } from "@/utils/constants";
import { getPublicThreads, THREADS_PAGE_INITIAL } from "@/actions/threads";

import { renderers } from "@/utils/renderers";

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

  const threads = data?.pages.flatMap((page) => page.threads) ?? [];

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
      <DividerGridRow>
        <DividerGridEdge position="left" className="col-span-1" />
        <DividerGridCell className="grid grid-cols-12 col-span-10  border-b">
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

      <DividerGridRow>
        <DividerGridEdge position="left" className="col-span-1" />
        <DividerGridCell className="grid grid-cols-12 col-span-10 border-r border-b border-l">
          <DividerGridRow>
            <DividerGridCell className="col-span-8 border-r">
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
            <DividerGridCell className="col-span-4 flex items-center justify-end px-4">
              {hasSearchQuery ? (
                <Typography variant="small" color="muted">
                  {t("threads.threadCount", { count: threads.length })}
                </Typography>
              ) : null}
            </DividerGridCell>
          </DividerGridRow>
        </DividerGridCell>
        <DividerGridEdge position="right" className="col-span-1" />
      </DividerGridRow>

      <DividerGridRow>
        <DividerGridEdge position="left" className="col-span-1" />
        <DividerGridCell className="grid grid-cols-12 col-span-10 border-r border-b border-l">
          <DividerGridRow>
            <DividerGridCell className="col-span-8 border-r py-6" />
            <DividerGridCell className="col-span-4 flex items-center justify-end px-4" />
          </DividerGridRow>
        </DividerGridCell>
        <DividerGridEdge position="right" className="col-span-1" />
      </DividerGridRow>

      {hasNoResult ? (
        <DividerGridRow>
          <DividerGridEdge position="left" className="col-span-1" />
          <DividerGridCell className="col-span-12 border-r border-b border-l px-8 py-24 lg:px-12">
            <div className="mx-auto flex max-w-lg flex-col gap-6">
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
              <DividerGridCell className="col-span-12 lg:col-span-10">
                <ThreadsPageThreadGridItem thread={thread} />
              </DividerGridCell>
              <DividerGridEdge position="right" className="col-span-1" />
            </DividerGridRow>
          ))}

          {hasNextPage ? (
            <DividerGridRow>
              <DividerGridEdge position="left" className="col-span-1" />
              <DividerGridCell className="col-span-12 lg:col-span-10">
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
    </DividerGrid>
  );
};

export { ThreadsPageThreadsContainer };
