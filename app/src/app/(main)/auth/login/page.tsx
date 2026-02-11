import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/server/supabase/server";

import { Container } from "@/components/ui/container";

import { CliAuthLoginPageForm } from "@/components/cli-auth-login-page-form";
import { CliAuthLoginPageFormSkeleton } from "@/components/cli-auth-login-page-form-skeleton";

const AuthLoginPage = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <Container as="main" size="sm" spacing="md">
      <Suspense fallback={<CliAuthLoginPageFormSkeleton />}>
        <CliAuthLoginPageForm />
      </Suspense>
    </Container>
  );
};

export default AuthLoginPage;
