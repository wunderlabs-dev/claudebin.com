import { Suspense } from "react";

import { Container } from "@/components/ui/container";

import { ProfilePageContent } from "@/components/profile-page-content";
import { ProfilePageSkeleton } from "@/components/profile-page-skeleton";

type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

const ProfilePage = ({ params }: ProfilePageProps) => {
  return (
    <Container
      spacing="md"
      className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 xl:gap-18"
    >
      <Suspense fallback={<ProfilePageSkeleton />}>
        <ProfilePageContent params={params} />
      </Suspense>
    </Container>
  );
};

export default ProfilePage;
