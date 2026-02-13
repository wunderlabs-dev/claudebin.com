import { SkeletonBar } from "@/components/ui/skeleton";

const CliAuthLoginPageFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-12 md:gap-18">
      <div className="flex flex-col gap-12 md:gap-18">
        <SkeletonBar className="h-10 w-2/3" />
        <div className="flex flex-col gap-5">
          <SkeletonBar className="h-6 w-24 rounded-full" />
          <SkeletonBar className="h-4 w-3/4" />
        </div>
      </div>
      <SkeletonBar className="h-10 w-56 rounded-sm" />
    </div>
  );
};

export { CliAuthLoginPageFormSkeleton };
