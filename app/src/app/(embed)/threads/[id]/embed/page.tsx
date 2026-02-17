import { Suspense } from "react";

import { SkeletonBar } from "@/components/ui/skeleton";
import { EmbedPageContent } from "@/components/embed-page-content";

type EmbedPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
};

const EmbedPage = ({ params, searchParams }: EmbedPageProps) => {
  return (
    <div className="flex min-h-screen min-w-full flex-col gap-3 bg-gray-100">
      <Suspense
        fallback={
          <div className="flex flex-col gap-4 px-4 pt-4">
            <SkeletonBar className="h-5 w-2/3" />
            <SkeletonBar className="h-24 w-full" />
          </div>
        }
      >
        <EmbedPageContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default EmbedPage;
