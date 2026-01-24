import { getTranslations } from "next-intl/server";

import { createClient } from "@/supabase/server";
import { sessions } from "@/supabase/repos/sessions";

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

const ThreadsPage = async () => {
  const t = await getTranslations();
  const supabase = await createClient();
  const threads = await sessions.getPublicThreads(supabase);

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
                author={thread.profiles?.username}
                createdAt={thread.createdAt}
                prompts={thread.messageCount}
                files={0}
                views={0}
                project={thread.storagePath}
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
