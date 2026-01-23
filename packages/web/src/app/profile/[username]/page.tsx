import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { SvgIconLine, SvgIconArrowRight } from "@/components/icon";

import { Container } from "@/components/ui/container";
import { Typography } from "@/components/ui/typography";

import { ProfilePageDangerZone } from "@/components/profile-page-danger-zone";
import { ProfilePageThreadListItem } from "@/components/profile-page-thread-list-item";
import { ProfilePageQuickStart } from "@/components/profile-page-quick-start";
import { ProfilePageUserInfoSidebar } from "@/components/profile-page-user-info-sidebar";

import { createReadOnlyClient } from "@/supabase/server";
import { profiles } from "@/supabase/repos/profiles";

const threads = [
  {
    id: "1",
    title: "Building a CLI tool with node.js",
    prompts: 10,
    files: 2,
    progress: 85,
    views: 45,
    forks: 3,
    project: "claudebin/master",
    time: "2h ago",
  },
  {
    id: "2",
    title: "React hooks optimization patterns",
    prompts: 85,
    files: 0,
    progress: 100,
    views: 120,
    forks: 8,
    project: "hooks-lib/main",
    time: "3h ago",
  },
  {
    id: "3",
    title: "Auth Debugging flow",
    prompts: 88,
    files: 10,
    progress: 45,
    views: 67,
    forks: 2,
    project: "auth-service/dev",
    time: "1d ago",
  },
  {
    id: "4",
    title: "Database query optimization",
    prompts: 4,
    files: 0,
    progress: 100,
    views: 23,
    forks: 1,
    project: "db-utils/master",
    time: "2d ago",
  },
  {
    id: "5",
    title: "API rate limiting implementation",
    prompts: 23,
    files: 5,
    progress: 70,
    views: 89,
    forks: 12,
    project: "api-gateway/main",
    time: "3d ago",
  },
  {
    id: "6",
    title: "CI/CD pipeline setup",
    prompts: 45,
    files: 8,
    progress: 90,
    views: 156,
    forks: 20,
    project: "devops/master",
    time: "4d ago",
  },
];

type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { username } = await params;
  const t = await getTranslations();

  const supabase = await createReadOnlyClient();
  const profile = await profiles.getByUsername(supabase, username);

  if (!profile) {
    notFound();
  }

  const createdAt = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <Container spacing="md" className="grid grid-cols-12 gap-16">
      <div className="col-span-4">
        <ProfilePageUserInfoSidebar
          username={profile.username ?? ""}
          bio=""
          avatar={profile.avatarUrl ?? ""}
          createdAt={createdAt}
          threads={0}
          views={0}
          forks={0}
        />
      </div>

      <div className="col-span-8 grid grid-cols-1">
        <div className="col-span-12 flex items-center justify-between border border-gray-250 p-8">
          <div className="flex items-center gap-3">
            <SvgIconLine size="md" color="accent" />
            <Typography variant="h4">{t("user.recentThreads")}</Typography>
          </div>
          <Link href="/threads" className="flex items-center gap-3">
            <Typography variant="small" fontWeight="semibold">
              {t("user.seeAllThreads")}
            </Typography>
            <SvgIconArrowRight size="sm" />
          </Link>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col">
            {threads.map((thread) => (
              <ProfilePageThreadListItem
                key={thread.id}
                title={thread.title}
                prompts={thread.prompts}
                files={thread.files}
                progress={thread.progress}
                views={thread.views}
                forks={thread.forks}
                project={thread.project}
                time={thread.time}
              />
            ))}
          </div>
          <ProfilePageQuickStart />
          <ProfilePageDangerZone />
        </div>
      </div>
    </Container>
  );
};

export default ProfilePage;
