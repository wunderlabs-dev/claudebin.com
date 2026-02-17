import { SkeletonBar } from "@/components/ui/skeleton";
import { Container } from "@/components/ui/container";

const HomePageFeaturedThreadsSkeleton = () => {
  return (
    <section className="flex flex-col gap-8 md:gap-12">
      <Container size="lg" spacing="lg" className="flex flex-col">
        <SkeletonBar className="h-8 w-1/3" />
        <SkeletonBar className="h-5 w-2/3" />
      </Container>
      <div className="flex gap-4 overflow-hidden px-6">
        <SkeletonBar className="h-48 w-80 shrink-0" />
        <SkeletonBar className="h-48 w-80 shrink-0" />
        <SkeletonBar className="h-48 w-80 shrink-0" />
      </div>
    </section>
  );
};

export { HomePageFeaturedThreadsSkeleton };
