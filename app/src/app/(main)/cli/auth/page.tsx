export const dynamic = "force-dynamic";

import { isNil } from "ramda";
import { redirect } from "next/navigation";
import { isPast } from "date-fns";
import { getTranslations } from "next-intl/server";

import { cliAuth } from "@/server/repos/cli-auth";
import { createClient } from "@/server/supabase/server";
import { createServiceClient } from "@/server/supabase/service";

import { SvgIconClock } from "@/components/icon/svg-icon-clock";
import { SvgIconKey } from "@/components/icon/svg-icon-key";
import { SvgIconLock } from "@/components/icon/svg-icon-lock";
import { SvgIconSkull } from "@/components/icon/svg-icon-skull";
import { Container } from "@/components/ui/container";
import { Typography } from "@/components/ui/typography";

import { CliAuthPageHeader } from "@/components/cli-auth-page-header";

type Props = {
  searchParams: Promise<{ code?: string }>;
};

const CliAuthPage = async ({ searchParams }: Props) => {
  const t = await getTranslations();
  const { code } = await searchParams;

  if (isNil(code)) {
    return (
      <Container as="main" size="sm" spacing="md">
        <div className="flex flex-col gap-12 md:gap-18">
          <CliAuthPageHeader />
          <div className="flex flex-col gap-3 border border-gray-500/40 px-8 py-8">
            <Typography variant="h4" className="flex items-center gap-2">
              <SvgIconKey />
              {t("cliAuth.invalidLinkTitle")}
            </Typography>
            <Typography color="neutral">{t("cliAuth.invalidLinkDescription")}</Typography>
          </div>
        </div>
      </Container>
    );
  }

  const serviceSupabase = createServiceClient();
  const cliSession = await cliAuth.getByToken(serviceSupabase, code);

  if (isNil(cliSession)) {
    return (
      <Container as="main" size="sm" spacing="md">
        <div className="flex flex-col gap-12 md:gap-18">
          <CliAuthPageHeader />
          <div className="flex flex-col gap-3 border border-gray-500/40 px-8 py-8">
            <Typography variant="h4" className="flex items-center gap-2">
              <SvgIconKey />
              {t("cliAuth.invalidCodeTitle")}
            </Typography>
            <Typography color="neutral">{t("cliAuth.invalidCodeDescription")}</Typography>
          </div>
        </div>
      </Container>
    );
  }

  if (cliSession.completedAt) {
    return (
      <Container as="main" size="sm" spacing="md">
        <div className="flex flex-col gap-12 md:gap-18">
          <CliAuthPageHeader />
          <div className="flex flex-col gap-3 border border-gray-500/40 px-8 py-8">
            <Typography variant="h4" className="flex items-center gap-2">
              <SvgIconLock />
              {t("cliAuth.successTitle")}
            </Typography>
            <Typography color="neutral">{t("cliAuth.successDescription")}</Typography>
          </div>
        </div>
      </Container>
    );
  }

  if (cliSession.expiresAt && isPast(cliSession.expiresAt)) {
    return (
      <Container as="main" size="sm" spacing="md">
        <div className="flex flex-col gap-12 md:gap-18">
          <CliAuthPageHeader />
          <div className="flex flex-col gap-3 border border-gray-500/40 px-8 py-8">
            <Typography variant="h4" className="flex items-center gap-2">
              <SvgIconClock />
              {t("cliAuth.expiredTitle")}
            </Typography>
            <Typography color="neutral">{t("cliAuth.expiredDescription")}</Typography>
          </div>
        </div>
      </Container>
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isNil(user)) {
    redirect(`/auth/login?redirect=${encodeURIComponent(`/cli/auth?code=${code}`)}`);
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (isNil(session)) {
    redirect(`/auth/login?redirect=${encodeURIComponent(`/cli/auth?code=${code}`)}`);
  }

  try {
    await cliAuth.complete(serviceSupabase, code, {
      userId: session.user.id,
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      completedAt: new Date().toISOString(),
    });
  } catch {
    return (
      <Container as="main" size="sm" spacing="md">
        <div className="flex flex-col gap-12 md:gap-18">
          <CliAuthPageHeader />
          <div className="flex flex-col gap-3 border border-gray-500/40 px-8 py-8">
            <Typography variant="h4" className="flex items-center gap-2">
              <SvgIconSkull />
              {t("cliAuth.failedTitle")}
            </Typography>
            <Typography color="neutral">{t("cliAuth.failedDescription")}</Typography>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container as="main" size="sm" spacing="md">
      <div className="flex flex-col gap-12 md:gap-18">
        <CliAuthPageHeader />
        <div className="flex flex-col gap-3 border border-gray-500/40 px-8 py-8">
          <Typography variant="h4" className="flex items-center gap-2">
            <SvgIconLock />
            {t("cliAuth.successTitle")}
          </Typography>
          <Typography color="neutral">{t("cliAuth.successDescription")}</Typography>
        </div>
      </div>
    </Container>
  );
};

export default CliAuthPage;
