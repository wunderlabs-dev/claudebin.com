import { AppBar } from "@/components/ui/app-bar";
import { Footer } from "@/components/ui/footer";
import { Toaster } from "@/components/ui/sonner";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <AppBar />
      <main>{children}</main>
      <Footer />
      <Toaster />
    </>
  );
};

export default MainLayout;
