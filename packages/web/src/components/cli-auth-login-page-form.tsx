"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useBoolean } from "usehooks-ts";

import { createClient } from "@/supabase/client";

import { SvgIconGithub, SvgIconSkull } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

import { LoginPageHeader } from "@/components/login-page-header";

const CliAuthLoginPageForm = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/";
  const authError = searchParams.get("error");
  const authErrorDescription = searchParams.get("error_description");

  const { value, setTrue, setFalse } = useBoolean();

  const handleSignIn = async () => {
    setTrue();

    const supabase = createClient();
    const redirect = encodeURIComponent(redirectTo);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    });

    if (error) {
      setFalse();
    }
  };

  return (
    <div className="flex flex-col gap-12 md:gap-18">
      <LoginPageHeader />

      <div className="flex flex-col items-start gap-5">
        {authError ? (
          <div className="flex flex-col gap-3 border border-gray-500/40 px-8 py-8">
            <Typography variant="h4" className="flex items-center gap-2">
              <SvgIconSkull />
              {t("login.errorTitle")}
            </Typography>
            <Typography color="neutral">
              {authErrorDescription || t("login.errorDescription")}
            </Typography>
          </div>
        ) : null}

        <Button variant="secondary" onClick={handleSignIn} disabled={value}>
          <SvgIconGithub />
          {value ? t("common.loading") : t("login.continueWithGithub")}
        </Button>
      </div>
    </div>
  );
};

export { CliAuthLoginPageForm };
