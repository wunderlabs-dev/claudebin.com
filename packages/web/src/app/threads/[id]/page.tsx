import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { formatDistanceToNow, format } from "date-fns";

import { createClient } from "@/supabase/server";
import { sessions } from "@/supabase/repos/sessions";

import { SvgIconArrowLeft } from "@/components/icon";

import { Container } from "@/components/ui/container";
import { NavLink, NavLabel } from "@/components/ui/nav";

import { ThreadPageMeta } from "@/components/thread-page-meta";
import { ThreadPageSidebar } from "@/components/thread-page-sidebar";

type ThreadPageProps = {
  params: Promise<{ id: string }>;
};

// ABOUTME: Extracts project name from working directory path (last segment)
const getProjectName = (workingDir: string | null): string => {
  if (!workingDir) return "Unknown";
  const segments = workingDir.split("/").filter(Boolean);
  return segments[segments.length - 1] || "Unknown";
};

const ThreadPage = async ({ params }: ThreadPageProps) => {
  const { id } = await params;
  const t = await getTranslations();
  const supabase = await createClient();

  const thread = await sessions.getByIdWithAuthor(supabase, id);

  if (!thread) {
    notFound();
  }

  // Track view (fire and forget)
  sessions.incrementViewCount(supabase, id);

  const author = thread.profiles?.username ?? "Anonymous";
  const createdAt = new Date(thread.createdAt);

  return (
    <Container size="lg" spacing="none" className="grid grid-cols-12">
      <div className="col-span-9 flex flex-col gap-9 pt-9">
        <NavLink href="/threads">
          <SvgIconArrowLeft size="sm" />
          <NavLabel>{t("thread.backToThreads")}</NavLabel>
        </NavLink>

        <ThreadPageMeta
          title={thread.title ?? "Untitled"}
          author={author}
          time={formatDistanceToNow(createdAt, { addSuffix: true })}
        />
      </div>

      <div className="col-span-3 flex flex-col justify-between border-gray-250 border-l px-6 pt-24 pb-12">
        <ThreadPageSidebar
          sessionId={thread.id}
          visibility={thread.isPublic ? "public" : "private"}
          createdAt={format(createdAt, "MM/dd/yyyy")}
          project={getProjectName(thread.workingDir)}
          prompts={thread.messageCount ?? 0}
          files={thread.fileCount}
          views={thread.viewCount}
          likes={thread.likeCount}
        />
      </div>
    </Container>
  );
};

export default ThreadPage;
