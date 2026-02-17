import { SkeletonBar } from "@/components/ui/skeleton";

const ThreadsPageSkeleton = () => {
  return (
    <div className="flex flex-col gap-6">
      <SkeletonBar className="h-10 w-full" />
      <div className="flex flex-col gap-4">
        <SkeletonBar className="h-24 w-full" />
        <SkeletonBar className="h-24 w-full" />
        <SkeletonBar className="h-24 w-full" />
      </div>
    </div>
  );
};

export { ThreadsPageSkeleton };
