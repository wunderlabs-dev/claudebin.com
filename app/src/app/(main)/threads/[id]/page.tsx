import { Suspense } from "react";
import type { Metadata } from "next";
import { isNil } from "ramda";

import { getCachedThread } from "@/server/cache/thread";

import copy from "@/copy/en-EN.json";

import { ThreadPageConversationSkeleton } from "@/components/thread-page-conversation-skeleton";
import { ThreadPageContent } from "@/components/thread-page-content";

type ThreadPageProps = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = async ({
  params,
}: ThreadPageProps): Promise<Metadata | undefined> => {
  const { id } = await params;

  const thread = await getCachedThread(id);

  if (isNil(thread) || isNil(thread.title) || isNil(thread.profiles?.username)) {
    return;
  }

  return {
    title: thread.title,
    description: copy.metadata.description,
    openGraph: {
      title: thread.title,
      description: copy.metadata.description,
      type: "article",
      authors: [thread.profiles.username],
    },
    twitter: {
      card: "summary_large_image",
      title: thread.title,
      description: copy.metadata.description,
    },
  };
};

const ThreadPage = ({ params }: ThreadPageProps) => {
  return (
    <Suspense fallback={<ThreadPageConversationSkeleton />}>
      <ThreadPageContent params={params} />
    </Suspense>
  );
};

export default ThreadPage;
