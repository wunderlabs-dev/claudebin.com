import { useTranslations } from "next-intl";

import { renderers } from "@/utils/renderers";

import { SvgIconUser } from "@/components/icon";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FormControl, Input } from "@/components/ui/form-control";
import { Typography } from "@/components/ui/typography";
import { Card, CardBody } from "@/components/ui/card";

import {
  DividerGrid,
  DividerGridRow,
  DividerGridEdge,
  DividerGridCell,
  DividerGridDivider,
} from "@/components/ui/divider-grid";

import { ThreadsPageThreadGridItem } from "@/components/threads-page-thread-grid-item";

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
    <Container size="md" spacing="md" className="flex flex-col gap-8">
      <div className="flex flex-col gap-18">
        <Typography variant="h1" leading="none" className="whitespace-break-spaces">
          {t.rich("threads.title", renderers)}
        </Typography>
        <Typography variant="body" color="muted">
          {t("threads.description")}
        </Typography>
      </div>

      <DividerGrid>
        <DividerGridRow>
          <DividerGridEdge position="left" className="col-span-1" />
          <DividerGridCell className="col-span-6 border-b">
            <DividerGridDivider variant="top" />
          </DividerGridCell>
          <DividerGridCell className="col-span-4 flex justify-between border-b">
            <DividerGridDivider variant="top" />
            <DividerGridDivider variant="top" />
          </DividerGridCell>
          <DividerGridEdge position="right" className="col-span-1" />
        </DividerGridRow>

        <DividerGridRow>
          <DividerGridEdge position="left" className="col-span-1" />
          <DividerGridCell className="col-span-6 border-r border-b border-l">
            <FormControl className="flex-row items-center">
              <Input placeholder={t("threads.searchPlaceholder")} />
              <Button variant="outline">
                <SvgIconUser size="sm" />
                {t("threads.search")}
              </Button>
            </FormControl>
          </DividerGridCell>
          <DividerGridCell className="col-span-4 flex items-center justify-end border-r border-b px-3">
            <Typography variant="small" color="muted">
              {t("threads.threadCount", { count: threads.length })}
            </Typography>
          </DividerGridCell>
          <DividerGridEdge position="right" className="col-span-1" />
        </DividerGridRow>

        <DividerGridRow>
          <DividerGridEdge position="left" className="col-span-1" />
          <DividerGridCell className="col-span-6 border-r border-b border-l py-6" />
          <DividerGridCell className="col-span-4 flex items-center justify-end border-r border-b py-6" />
          <DividerGridEdge position="right" className="col-span-1" />
        </DividerGridRow>

        <DividerGridRow>
          <DividerGridEdge position="left" className="col-span-1" />
          <DividerGridCell className="col-span-10 border-r border-b border-l px-12 py-24">
            <div className="mx-auto flex max-w-lg flex-col gap-6">
              <Typography variant="h2" leading="normal" className="whitespace-break-spaces">
                {t.rich("threads.emptyTitle", { ...renderers, query: "Croissant" })}
              </Typography>
              <Typography variant="body" color="muted">
                {t("threads.emptyDescription")}
              </Typography>
            </div>
          </DividerGridCell>
          <DividerGridEdge position="right" className="col-span-1" />
        </DividerGridRow>

        {threads.map((thread) => (
          <DividerGridRow key={thread.id}>
            <DividerGridEdge position="left" className="col-span-1" />
            <DividerGridCell className="col-span-10">
              <ThreadsPageThreadGridItem
                id={thread.id}
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
            </DividerGridCell>
            <DividerGridEdge position="right" className="col-span-1" />
          </DividerGridRow>
        ))}

        <DividerGridRow>
          <DividerGridEdge position="left" className="col-span-1" />
          <DividerGridCell className="col-span-10">
            <Card variant="grid">
              <CardBody />
              <CardBody className="items-center justify-center p-0">
                <Button variant="secondary">{t("threads.loadMore")}</Button>
              </CardBody>
              <CardBody />
            </Card>
          </DividerGridCell>
          <DividerGridEdge position="right" className="col-span-1" />
        </DividerGridRow>

        <DividerGridRow>
          <DividerGridCell className="col-span-1" />
          <DividerGridCell className="col-span-10">
            <DividerGridRow>
              <DividerGridCell className="col-span-4 flex justify-between">
                <DividerGridDivider variant="bottom" />
                <DividerGridDivider variant="bottom" />
              </DividerGridCell>
              <DividerGridCell className="col-span-4 flex justify-end">
                <DividerGridDivider variant="bottom" />
              </DividerGridCell>
              <DividerGridCell className="col-span-4 flex justify-end">
                <DividerGridDivider variant="bottom" />
              </DividerGridCell>
            </DividerGridRow>
          </DividerGridCell>
          <DividerGridCell className="col-span-1" />
        </DividerGridRow>
      </DividerGrid>
    </Container>
  );
};

export default ThreadsPage;
