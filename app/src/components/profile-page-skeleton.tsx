import { SkeletonAvatar, SkeletonBar } from "@/components/ui/skeleton";

const ProfilePageSkeleton = () => {
  return (
    <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 xl:gap-18">
      <div className="col-span-1 flex flex-col gap-6 lg:col-span-4">
        <SkeletonAvatar className="size-16" />
        <SkeletonBar className="h-6 w-2/3" />
        <SkeletonBar className="h-4 w-1/2" />
      </div>
      <div className="col-span-1 flex flex-col gap-4 lg:col-span-8">
        <SkeletonBar className="h-10 w-full" />
        <SkeletonBar className="h-24 w-full" />
        <SkeletonBar className="h-24 w-full" />
        <SkeletonBar className="h-24 w-full" />
      </div>
    </div>
  );
};

export { ProfilePageSkeleton };
