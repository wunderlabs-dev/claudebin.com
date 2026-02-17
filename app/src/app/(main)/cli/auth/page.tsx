import { Suspense } from "react";

import { Container } from "@/components/ui/container";

import { CliAuthPageHeader } from "@/components/cli-auth-page-header";
import { CliAuthPageContent } from "@/components/cli-auth-page-content";
import { CliAuthPageSkeleton } from "@/components/cli-auth-page-skeleton";

type Props = {
  searchParams: Promise<{ code?: string }>;
};

const CliAuthPage = ({ searchParams }: Props) => {
  return (
    <Container as="main" size="sm" spacing="md">
      <div className="flex flex-col gap-12 md:gap-18">
        <CliAuthPageHeader />
        <Suspense fallback={<CliAuthPageSkeleton />}>
          <CliAuthPageContent searchParams={searchParams} />
        </Suspense>
      </div>
    </Container>
  );
};

export default CliAuthPage;
