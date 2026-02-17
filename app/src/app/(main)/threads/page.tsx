import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { gradient } from "@/utils/renderers";

import { Container } from "@/components/ui/container";
import { Typography } from "@/components/ui/typography";

import { ThreadsPageDataLoader } from "@/components/threads-page-data-loader";
import { ThreadsPageSkeleton } from "@/components/threads-page-skeleton";

type ThreadsPageProps = {
  searchParams: Promise<{ query?: string }>;
};

const ThreadsPage = async ({ searchParams }: ThreadsPageProps) => {
  const t = await getTranslations();

  return (
    <Container size="md" spacing="md" className="flex flex-col gap-8">
      <div className="flex flex-col gap-12 xl:gap-18">
        <Typography variant="h1" leading="none" className="whitespace-break-spaces">
          {t.rich("threads.title", { gradient })}
        </Typography>
        <Typography variant="body" color="muted">
          {t("threads.description")}
        </Typography>
      </div>

      <Suspense fallback={<ThreadsPageSkeleton />}>
        <ThreadsPageDataLoader searchParams={searchParams} />
      </Suspense>
    </Container>
  );
};

export default ThreadsPage;
