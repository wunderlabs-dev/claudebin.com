import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { isNil } from "ramda";
import { format } from "date-fns";

import { getProjectName } from "@/utils/helpers";

import { sessions } from "@/supabase/repos/sessions";
import { createClient } from "@/supabase/server";

import { SvgIconArrowLeft } from "@/components/icon/svg-icon-arrow-left";
import { Container } from "@/components/ui/container";
import { NavLink, NavLabel } from "@/components/ui/nav";

import { ThreadPageAuthorMeta } from "@/components/thread-page-author-meta";
import { ThreadPageConversationSkeleton } from "@/components/thread-page-conversation-skeleton";
import { ThreadPageSidebarContainer } from "@/containers/thread-page-sidebar-container";
import { ThreadPageConversationContainer } from "@/containers/thread-page-conversation-container";

type ThreadPageProps = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = async ({ params }: ThreadPageProps): Promise<Metadata> => {
  const { id } = await params;

  const supabase = await createClient();
  const thread = await sessions.getByIdWithAuthor(supabase, id);

  if (isNil(thread)) {
    return { title: "Thread Not Found" };
  }

  const title = thread.title ?? "Untitled Session";
  const author = thread.profiles?.username ?? "Anonymous";
  const model = thread.modelName;
  const promptCount = thread.messageCount ?? 0;

  const description = `${author} • ${model} • ${promptCount} prompts`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      authors: [author],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
  const isAuthor = user?.id === thread?.userId;

  if (isNil(thread)) {
    notFound();
  }

  sessions.incrementViewCount(supabase, id);

  return (
    <Container size="lg" spacing="none" className="grid grid-cols-1 lg:grid-cols-12">
      <div className="flex flex-col col-span-1 gap-12 pt-9 pb-12 lg:col-span-9 lg:gap-18 lg:pb-0">
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
            author={thread.profiles?.username ?? t("common.deactivated")}
          />
        </div>

        <Suspense fallback={<ThreadPageConversationSkeleton />}>
          <ThreadPageConversationContainer
            id={thread.id}
            avatarUrl={thread.profiles?.avatarUrl}
            author={thread.profiles?.username ?? t("common.deactivated")}
            isAuthor={isAuthor}
            isPublic={thread.isPublic}
          />
        </Suspense>
      </div>

      <div className="sticky top-0 flex flex-col justify-between self-start col-span-1 px-0 pt-12 border-t border-gray-250 overflow-y-auto lg:col-span-3 lg:h-screen lg:px-6 lg:pt-24 lg:pb-12 lg:border-t-0 lg:border-l">
        <ThreadPageSidebarContainer
          id={thread.id}
          isAuthor={isAuthor}
          isPublic={thread.isPublic}
          initialLiked={thread.hasLiked}
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
  );
};

export default ThreadPage;
