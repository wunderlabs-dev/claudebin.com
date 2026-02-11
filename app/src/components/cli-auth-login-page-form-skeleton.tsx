import { SkeletonBar } from "@/components/ui/skeleton";

const CliAuthLoginPageFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-12 md:gap-18">
      <div className="flex flex-col gap-12 md:gap-18">
        <SkeletonBar className="w-2/3 h-10" />
        <div className="flex flex-col gap-5">
          <SkeletonBar className="w-24 h-6 rounded-full" />
          <SkeletonBar className="w-3/4 h-4" />
        </div>
      </div>

      <SkeletonBar className="w-56 h-10 rounded-sm" />
    </div>
  );
};

export { CliAuthLoginPageFormSkeleton };
