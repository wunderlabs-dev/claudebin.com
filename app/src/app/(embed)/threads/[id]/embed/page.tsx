import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { isNil, not } from "ramda";

import { createClient } from "@/server/supabase/server";
import { sessions } from "@/server/repos/sessions";
import { messages } from "@/server/repos/messages";

import { getProjectName, compactConversation } from "@/utils/helpers";

import { SvgIconArrowLink } from "@/components/icon/svg-icon-arrow-link";
import { Typography } from "@/components/ui/typography";
import { EmbedPageFooter } from "@/components/embed-page-footer";
import { EmbedPageConversation } from "@/components/embed-page-conversation";

type EmbedPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
};

const EmbedPage = async ({ params, searchParams }: EmbedPageProps) => {
  const t = await getTranslations();

  const { id } = await params;
  const { from, to } = await searchParams;

  if (isNil(from) || isNil(to)) {
    notFound();
  }

  const fromId = Number.parseInt(from);
  const toId = Number.parseInt(to);

  if (Number.isNaN(fromId) || Number.isNaN(toId) || fromId > toId) {
    notFound();
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const thread = await sessions.getByIdWithAuthor(supabase, id, user?.id);

  if (isNil(thread)) {
    notFound();
  }
  if (not(thread.isPublic) && thread.userId !== user?.id) {
    notFound();
  }

  const result = await messages.getByRange(supabase, id, fromId, toId);

  return (
    <div className="flex flex-col min-h-screen min-w-full gap-3 bg-gray-100">
      <div className="flex flex-col gap-4 pt-4 px-4">
        <Typography variant="body" fontWeight="semibold">
          {thread.title}
        </Typography>

        <EmbedPageConversation
          messages={compactConversation(result.messages)}
          avatarUrl={thread.profiles?.avatarUrl}
          author={thread.profiles?.username ?? t("common.deactivated")}
        />

        <div className="flex justify-end">
          <Link href={`/threads/${id}`} target="_blank" className="flex items-center gap-3">
            <Typography variant="small" fontWeight="bold" color="accent">
              {t("embed.openFullConversation")}
            </Typography>
            <SvgIconArrowLink size="sm" className="text-orange-50" />
          </Link>
        </div>
      </div>

      <EmbedPageFooter
        id={id}
        workingDir={getProjectName(thread.workingDir)}
        modelName={thread.modelName}
        fileCount={thread.fileCount}
        viewCount={thread.viewCount}
        likeCount={thread.likeCount}
        messageCount={thread.messageCount}
      />
    </div>
  );
};

export default EmbedPage;
