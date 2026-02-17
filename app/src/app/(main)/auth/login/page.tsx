import { Suspense } from "react";

import { Container } from "@/components/ui/container";

import { AuthLoginPageContent } from "@/components/auth-login-page-content";
import { CliAuthLoginPageFormSkeleton } from "@/components/cli-auth-login-page-form-skeleton";

const AuthLoginPage = () => {
  return (
    <Container as="main" size="sm" spacing="md">
      <Suspense fallback={<CliAuthLoginPageFormSkeleton />}>
        <AuthLoginPageContent />
      </Suspense>
    </Container>
  );
};

export default AuthLoginPage;
