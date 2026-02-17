import { Suspense } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/server/supabase/server";

import { CliAuthLoginPageForm } from "@/components/cli-auth-login-page-form";
import { CliAuthLoginPageFormSkeleton } from "@/components/cli-auth-login-page-form-skeleton";

const AuthLoginPageContent = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <Suspense fallback={<CliAuthLoginPageFormSkeleton />}>
      <CliAuthLoginPageForm />
    </Suspense>
  );
};

export { AuthLoginPageContent };
