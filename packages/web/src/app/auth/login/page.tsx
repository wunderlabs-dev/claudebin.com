import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { createClient } from "@/supabase/server";

import { Container } from "@/components/ui/container";
import { Typography } from "@/components/ui/typography";

import { AuthLoginPageForm } from "@/components/auth-login-page-form";

const AuthLoginPage = async () => {
  const t = await getTranslations();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <Container as="main" size="sm" spacing="md">
      <Suspense
        fallback={
          <Typography color="neutral" className="text-center">
            {t("common.loading")}
          </Typography>
        }
      >
        <AuthLoginPageForm />
      </Suspense>
    </Container>
  );
};

export default AuthLoginPage;
