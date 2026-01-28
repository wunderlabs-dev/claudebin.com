"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounceValue } from "usehooks-ts";

import type { ThreadWithAuthor } from "@/supabase/repos/sessions";

import { getPublicThreads } from "@/actions/threads";

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
  initialQuery?: string;
};

const ThreadsPageThreadsContainer = ({
  initialThreads,
  initialTotal,
  initialQuery = "",
}: ThreadsPageThreadsContainerProps) => {
  const t = useTranslations();
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [queryDebounced] = useDebounceValue(query, SEARCH_INPUT_DEBOUNCE_MS);

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["threads", queryDebounced],
    queryFn: ({ pageParam }) => getPublicThreads(queryDebounced, pageParam),
    initialPageParam: 0,
    initialData: {
      pages: [{ threads: initialThreads, total: initialTotal }],
      pageParams: [0],
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.flatMap((page) => page.threads).length;
      return totalFetched < lastPage.total ? totalFetched : undefined;
    },
  });

  const threads = data?.pages.flatMap((page) => page.threads) ?? [];
  const total = data?.pages[0]?.total ?? 0;
  const isSearching = isFetching && !isFetchingNextPage;
  const hasNoSearchResults = !isFetching && threads.length === 0 && queryDebounced.trim() !== "";

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
        <DividerGridCell className="col-span-4 flex justify-between border-b">
          <DividerGridDivider variant="top" />
          <DividerGridDivider variant="top" />
        </DividerGridCell>
        <DividerGridEdge position="right" className="col-span-1" />
      </DividerGridRow>

      <DividerGridRow>
        <DividerGridEdge position="left" className="col-span-1" />
        <DividerGridCell className="col-span-6 border-r border-b border-l">
          <FormControl className="flex-row items-center">
            <Input
              placeholder={t("threads.searchPlaceholder")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Button variant="outline" disabled={isSearching}>
              <SvgIconMagnifier size="sm" />
              {isSearching ? t("threads.searching") : t("threads.search")}
            </Button>
          </FormControl>
        </DividerGridCell>
        <DividerGridCell className="col-span-4 flex items-center justify-end border-r border-b px-3">
          <Typography variant="small" color="muted">
            {t("threads.threadCount", { count: total })}
          </Typography>
        </DividerGridCell>
        <DividerGridEdge position="right" className="col-span-1" />
      </DividerGridRow>

      <DividerGridRow>
        <DividerGridEdge position="left" className="col-span-1" />
        <DividerGridCell className="col-span-6 border-r border-b border-l py-6" />
        <DividerGridCell className="col-span-4 flex items-center justify-end border-r border-b py-6" />
        <DividerGridEdge position="right" className="col-span-1" />
      </DividerGridRow>

      {hasNoSearchResults ? (
        <DividerGridRow>
          <DividerGridEdge position="left" className="col-span-1" />
          <DividerGridCell className="col-span-10 border-r border-b border-l px-12 py-24">
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
