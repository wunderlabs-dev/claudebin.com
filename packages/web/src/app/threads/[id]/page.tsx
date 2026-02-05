import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { isNil } from "ramda";
import { format } from "date-fns";

import { getProjectName } from "@/utils/helpers";

import { sessions } from "@/supabase/repos/sessions";
import { createClient } from "@/supabase/server";

import { SvgIconArrowLeft } from "@/components/icon";
import { Container } from "@/components/ui/container";
import { NavLink, NavLabel } from "@/components/ui/nav";

import { ThreadPageAuthorMeta } from "@/components/thread-page-author-meta";
import { ThreadPageSidebarContainer } from "@/containers/thread-page-sidebar-container";
import { ThreadPageConversationContainer } from "@/containers/thread-page-conversation-container";

type ThreadPageProps = {
  params: Promise<{ id: string }>;
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

  sessions.incrementViewCount(supabase, id);

  return (
    <Container size="lg" spacing="none" className="grid grid-cols-1 md:grid-cols-12">
      <div className="col-span-1 md:col-span-9 flex flex-col gap-18 pt-9 pb-12 md:pb-0">
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

        <ThreadPageConversationContainer
          id={thread.id}
          avatarUrl={thread.profiles?.avatarUrl}
          author={thread.profiles?.username ?? t("common.deactivated")}
        />
      </div>

      <div className="sticky top-0 col-span-1 md:col-span-3 flex md:h-screen flex-col justify-between self-start overflow-y-auto border-gray-250 border-t md:border-l px-0 md:px-6 pt-12 md:pt-24 md:pb-12">
        <ThreadPageSidebarContainer
          id={thread.id}
          isPublic={thread.isPublic}
          initialLiked={thread.hasLiked}
          createdAt={format(thread.createdAt, "MM/dd/yyyy")}
          workingDir={getProjectName(thread.workingDir)}
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
