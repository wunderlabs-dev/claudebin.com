import { getTranslations } from "next-intl/server";

import { createClient } from "@/supabase/server";
import { sessions } from "@/supabase/repos/sessions";

import { renderers } from "@/utils/renderers";

import { Container } from "@/components/ui/container";
import { Typography } from "@/components/ui/typography";

import { ThreadsPageThreadsContainer } from "@/containers/threads-page-threads-container";

type ThreadsPageProps = {
  searchParams: Promise<{ query?: string }>;
};

const ThreadsPage = async ({ searchParams }: ThreadsPageProps) => {
  const t = await getTranslations();
  const supabase = await createClient();

  const { query } = await searchParams;
  const { threads, total } = await sessions.getPublicThreads(supabase, { query });

  return (
    <Container size="md" spacing="md" className="flex flex-col gap-8">
      <div className="flex flex-col gap-18">
        <Typography variant="h1" leading="none" className="whitespace-break-spaces">
          {t.rich("threads.title", renderers)}
        </Typography>
        <Typography variant="body" color="muted">
          {t("threads.description")}
        </Typography>
      </div>

      <ThreadsPageThreadsContainer
        initialThreads={threads}
        initialTotal={total}
        initialQuery={query}
      />
    </Container>
  );
};

export default ThreadsPage;
