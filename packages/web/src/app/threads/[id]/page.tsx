import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { SvgIconArrowLeft } from "@/components/icon";

import { Container } from "@/components/ui/container";
import { Typography } from "@/components/ui/typography";

import { ThreadPageSidebar } from "@/components/thread-page-sidebar";

type ThreadPageProps = {
  params: Promise<{ id: string }>;
};

const thread = {
  id: "1",
  public: true,
  createdAt: "12/01/2026",
  project: "directory/project_name",
  prompts: 10,
  linesWritten: 2345,
  additions: 2000,
  deletions: 23,
  modifications: 234,
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
      <div className="col-span-9 pt-9">
        <Link href="/threads" className="inline-flex items-center gap-2 px-4 py-2 border border-gray-250 rounded-full">
          <SvgIconArrowLeft size="sm" />
          <Typography variant="small">{t("thread.backToThreads")}</Typography>
        </Link>
      </div>

      <div className="flex flex-col justify-between col-span-3 pt-24 pb-12 px-6 border-l border-gray-250">
        <ThreadPageSidebar
          public={thread.public}
          createdAt={thread.createdAt}
          project={thread.project}
          prompts={thread.prompts}
          linesWritten={thread.linesWritten}
          additions={thread.additions}
          deletions={thread.deletions}
          modifications={thread.modifications}
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
