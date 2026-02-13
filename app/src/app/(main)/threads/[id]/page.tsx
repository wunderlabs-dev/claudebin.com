import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { isNil } from "ramda";
import { format } from "date-fns";

import copy from "@/copy/en-EN.json";

import { sessions } from "@/server/repos/sessions";
import { createClient } from "@/server/supabase/server";

import { getProjectName } from "@/utils/helpers";

import { SvgIconArrowLeft } from "@/components/icon/svg-icon-arrow-left";
import { Container } from "@/components/ui/container";
import { NavLink, NavLabel } from "@/components/ui/nav";

import { ThreadPageAuthorMeta } from "@/components/thread-page-author-meta";
import { ThreadPageConversationSkeleton } from "@/components/thread-page-conversation-skeleton";
import { ThreadPageSidebarContainer } from "@/containers/thread-page-sidebar-container";
import { ThreadPageConversationContainer } from "@/containers/thread-page-conversation-container";

import { ThreadEmbedProvider } from "@/context/thread-embed";
import { TrackingPixel } from "@/components/tracking-pixel";

type ThreadPageProps = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = async ({
  params,
}: ThreadPageProps): Promise<Metadata | undefined> => {
  const { id } = await params;

  const supabase = await createClient();
  const thread = await sessions.getByIdWithAuthor(supabase, id);

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

const ThreadPage = async ({ params }: ThreadPageProps) => {
  const { id } = await params;

  const t = await getTranslations();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const thread = await sessions.getByIdWithAuthor(supabase, id, user?.id);

  if (isNil(thread)) {
    notFound();
  }

  return (
    <ThreadEmbedProvider>
      <Container size="lg" spacing="none" className="grid grid-cols-1 lg:grid-cols-12">
        <div className="col-span-1 flex flex-col gap-12 pt-9 pb-12 lg:col-span-9 lg:gap-18 lg:pb-0">
          <div className="flex flex-col items-start gap-9">
            <NavLink href="/threads">
              <SvgIconArrowLeft size="sm" />
              <NavLabel>{t("thread.backToThreads")}</NavLabel>
            </NavLink>

            <ThreadPageAuthorMeta
              avatarUrl={thread.profiles?.avatarUrl}
              username={thread.profiles?.username}
              createdAt={thread.createdAt}
              title={thread.title ?? t("common.untitled")}
            />
          </div>

          <Suspense fallback={<ThreadPageConversationSkeleton />}>
            <ThreadPageConversationContainer
              id={thread.id}
              avatarUrl={thread.profiles?.avatarUrl}
              author={thread.profiles?.username ?? t("common.deactivated")}
            />
          </Suspense>
        </div>

        <div className="sticky top-0 col-span-1 flex flex-col justify-between self-start overflow-y-auto border-gray-250 border-t px-0 pt-12 lg:col-span-3 lg:h-screen lg:border-t-0 lg:border-l lg:px-6 lg:pt-24 lg:pb-12">
          <ThreadPageSidebarContainer
            id={thread.id}
            isPublic={thread.isPublic}
            initialLiked={thread.hasLiked}
            isAuthor={user?.id === thread?.userId}
            createdAt={format(thread.createdAt, "MM/dd/yyyy")}
            workingDir={getProjectName(thread.workingDir)}
            modelName={thread.modelName}
            fileCount={thread.fileCount}
            viewCount={thread.viewCount}
            likeCount={thread.likeCount}
            messageCount={thread.messageCount}
          />
        </div>
      </Container>
      <TrackingPixel type="t" id={id} />
    </ThreadEmbedProvider>
  );
};

export default ThreadPage;
