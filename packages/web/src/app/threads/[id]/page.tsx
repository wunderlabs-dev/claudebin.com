import { getTranslations } from "next-intl/server";

import { SvgIconArrowLeft } from "@/components/icon";

import { Container } from "@/components/ui/container";
import { NavLink, NavLabel } from "@/components/ui/nav";

import { ThreadPageMeta } from "@/components/thread-page-meta";
import { ThreadPageSidebar } from "@/components/thread-page-sidebar";

type ThreadPageProps = {
  params: Promise<{ id: string }>;
};

const thread = {
  id: "1",
  title: "Building a CLI tool with node.js",
  author: "marius",
  time: "2h ago",
  visibility: "public" as const,
  createdAt: "12/01/2026",
  project: "directory/project_name",
  prompts: 10,
  linesWritten: 2345,
  files: 2,
  views: 1234,
  forks: 2,
  progress: 65,
};

const ThreadPage = async ({ params }: ThreadPageProps) => {
  const { id: _id } = await params;
  const t = await getTranslations();

  return (
    <Container size="lg" spacing="none" className="grid grid-cols-12">
      <div className="col-span-9 flex flex-col gap-9 pt-9">
        <NavLink href="/threads">
          <SvgIconArrowLeft size="sm" />
          <NavLabel>{t("thread.backToThreads")}</NavLabel>
        </NavLink>

        <ThreadPageMeta title={thread.title} author={thread.author} time={thread.time} />
      </div>

      <div className="col-span-3 flex flex-col justify-between border-gray-250 border-l px-6 pt-24 pb-12">
        <ThreadPageSidebar
          visibility={thread.visibility}
          createdAt={thread.createdAt}
          project={thread.project}
          prompts={thread.prompts}
          linesWritten={thread.linesWritten}
          files={thread.files}
          views={thread.views}
          forks={thread.forks}
          progress={thread.progress}
        />
      </div>
    </Container>
  );
};

export default ThreadPage;
