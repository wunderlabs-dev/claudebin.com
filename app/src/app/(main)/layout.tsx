import { Suspense } from "react";

import { AppBar } from "@/components/ui/app-bar";
import { AppBarSkeleton } from "@/components/ui/app-bar-skeleton";
import { Footer } from "@/components/ui/footer";
import { Toaster } from "@/components/ui/sonner";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Suspense fallback={<AppBarSkeleton />}>
        <AppBar />
      </Suspense>
      <main>{children}</main>
      <Footer />
      <Toaster />
    </>
  );
};

export default MainLayout;
