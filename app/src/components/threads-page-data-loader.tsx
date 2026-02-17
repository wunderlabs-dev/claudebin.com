import { createClient } from "@/server/supabase/server";
import { sessions } from "@/server/repos/sessions";

import { ThreadsPageThreadsContainer } from "@/containers/threads-page-threads-container";

type ThreadsPageDataLoaderProps = {
  searchParams: Promise<{ query?: string }>;
};

const ThreadsPageDataLoader = async ({ searchParams }: ThreadsPageDataLoaderProps) => {
  const { query } = await searchParams;
  const supabase = await createClient();
  const { threads, total, nextOffset } = await sessions.getPublicThreads(supabase, { query });

  return (
    <ThreadsPageThreadsContainer
      initialQuery={query}
      initialTotal={total}
      initialNextOffset={nextOffset}
      initialThreads={threads}
    />
  );
};

export { ThreadsPageDataLoader };
