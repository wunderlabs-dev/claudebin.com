import { SkeletonBar } from "@/components/ui/skeleton";

const CliAuthPageSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 border border-gray-500/40 px-8 py-8">
      <SkeletonBar className="h-6 w-2/3" />
      <SkeletonBar className="h-4 w-full" />
    </div>
  );
};

export { CliAuthPageSkeleton };
