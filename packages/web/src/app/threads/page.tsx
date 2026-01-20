import { useTranslations } from "next-intl";

import { renderers } from "@/utils/renderers";

import { ThreadsCard } from "@/components/threads-card";

import { AppBar } from "@/components/ui/app-bar";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Footer } from "@/components/ui/footer";
import { FormControl, Input } from "@/components/ui/form-control";
import { Typography } from "@/components/ui/typography";

import { SvgIconDivider, SvgIconUser } from "@/components/icon";

const threads = [
  {
    id: "1",
    title: "Building a CLI tool with node.js",
    author: "@marius",
    time: "2h ago",
    prompts: 10,
    files: 2,
    views: 45,
    forks: 3,
    project: "claudebin/master",
    progress: 85,
  },
  {
    id: "2",
    title: "React hooks optimization patterns",
    author: "@sarah",
    time: "3h ago",
    prompts: 85,
    files: 0,
    views: 120,
    forks: 8,
    project: "hooks-lib/main",
    progress: 100,
  },
  {
    id: "3",
    title: "Auth Debugging flow",
    author: "@john",
    time: "1d ago",
    prompts: 88,
    files: 10,
    views: 67,
    forks: 2,
    project: "auth-service/dev",
    progress: 45,
  },
  {
    id: "4",
    title: "Database query optimization",
    author: "@emma",
    time: "2d ago",
    prompts: 4,
    files: 0,
    views: 23,
    forks: 1,
    project: "db-utils/master",
    progress: 100,
  },
  {
    id: "5",
    title: "API rate limiting implementation",
    author: "@alex",
    time: "3d ago",
    prompts: 23,
    files: 5,
    views: 89,
    forks: 12,
    project: "api-gateway/main",
    progress: 70,
  },
  {
    id: "6",
    title: "CI/CD pipeline setup",
    author: "@mike",
    time: "4d ago",
    prompts: 45,
    files: 8,
    views: 156,
    forks: 20,
    project: "devops/master",
    progress: 90,
  },
];

const ThreadsPage = () => {
  const t = useTranslations();

  return (
    <>
      <AppBar />

      <main>
        <Container size="md" spacing="sm" className="flex flex-col gap-8">
          <div className="flex flex-col gap-18">
            <Typography variant="h1" className="leading-none whitespace-break-spaces">
              {t.rich("threads.title", renderers)}
            </Typography>
            <Typography variant="body" color="muted">
              {t("threads.description")}
            </Typography>
          </div>

          <div className="grid grid-cols-1">
            <div className="grid grid-cols-3 border-x border-t border-gray-250 divide-x divide-gray-250">
              <div className="col-span-2">
                <FormControl className="flex-row">
                  <Input type="text" placeholder={t("threads.searchPlaceholder")} />
                  <Button variant="outline">
                    <SvgIconUser size="sm" />
                    {t("threads.search")}
                  </Button>
                </FormControl>
              </div>

              <div className="flex col-span-1 items-center justify-end px-3">
                <Typography variant="body" color="muted">
                  {t("threads.threadCount", { count: "92,456" })}
                </Typography>
              </div>
            </div>

            <div className="grid grid-cols-3 border-x border-t border-gray-250 divide-x divide-gray-250">
              <div className="col-span-2 h-12" />
              <div className="col-span-1" />
            </div>

            {threads.map((thread) => (
              <ThreadsCard
                key={thread.id}
                title={thread.title}
                author={thread.author}
                time={thread.time}
                prompts={thread.prompts}
                files={thread.files}
                views={thread.views}
                forks={thread.forks}
                project={thread.project}
                progress={thread.progress}
              />
            ))}

            <div className="grid grid-cols-3 border-x border-b border-gray-250 divide-x divide-gray-250">
              <div className="col-span-1" />
              <div className="flex col-span-1 justify-center">
                <Button variant="secondary">{t("threads.loadMore")}</Button>
              </div>
              <div className="col-span-1" />
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
};

export default ThreadsPage;
