import { Fragment } from "react";
import { isEmpty, isNil } from "ramda";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { createClient } from "@/server/supabase/server";
import { profiles } from "@/server/repos/profiles";
import { sessions } from "@/server/repos/sessions";

import { USER_PROFILE_THREADS_LIMIT } from "@/utils/constants";

import { TrackingPixel } from "@/components/tracking-pixel";

import { SvgIconLine } from "@/components/icon/svg-icon-line";
import { SvgIconArrowRight } from "@/components/icon/svg-icon-arrow-right";

import { Container } from "@/components/ui/container";
import { Typography } from "@/components/ui/typography";
import { NavLabel, NavLink } from "@/components/ui/nav";

import { ProfilePageThreadListItem } from "@/components/profile-page-thread-list-item";
import { ProfilePageNoThreads } from "@/components/profile-page-no-threads";
import { ProfilePageQuickStart } from "@/components/profile-page-quick-start";
import { ProfilePageUserInfoSidebar } from "@/components/profile-page-user-info-sidebar";
import { ProfilePageDangerZoneContainer } from "@/containers/profile-page-danger-zone-container";

type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { username } = await params;

  const t = await getTranslations();
  const supabase = await createClient();
  const profile = await profiles.getByUsername(supabase, username);

  if (isNil(profile)) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const threads = await sessions.getByUserId(
    supabase,
    profile.id,
    USER_PROFILE_THREADS_LIMIT,
    user?.id,
  );

  const isOwner = user?.id === profile.id;

  return (
    <>
      <Container
        spacing="md"
        className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 xl:gap-18"
      >
        <div className="col-span-1 lg:col-span-4">
          <ProfilePageUserInfoSidebar
            username={profile.username}
            name={profile.name}
            avatarUrl={profile.avatarUrl}
            createdAt={new Date(profile.createdAt)}
            threads={threads.length}
            views={profile.viewCount}
          />
        </div>

        <div className="col-span-1 grid grid-cols-1 lg:col-span-8">
          <div className="col-span-12 flex justify-between border border-gray-250 p-4 md:p-8 lg:items-center">
            <div className="flex items-center gap-3">
              <SvgIconLine size="md" color="accent" />
              <Typography variant="h4">{t("user.recentThreads")}</Typography>
            </div>
            <NavLink href="/threads">
              <NavLabel>{t("user.seeAllThreads")}</NavLabel>
              <SvgIconArrowRight size="sm" />
            </NavLink>
          </div>

          <div className="flex flex-col gap-8">
            {threads.length ? (
              <div className="flex flex-col">
                {threads.map((thread) => (
                  <ProfilePageThreadListItem key={thread.id} thread={thread} />
                ))}
              </div>
            ) : null}

            {isEmpty(threads) ? (
              <Fragment>
                <ProfilePageNoThreads />
                {isOwner ? <ProfilePageQuickStart /> : null}
              </Fragment>
            ) : null}

            {isOwner ? <ProfilePageDangerZoneContainer /> : null}
          </div>
        </div>
      </Container>

      <TrackingPixel type="p" id={profile.id} />
    </>
  );
};

export default ProfilePage;
