import Link from "next/link";

import { SvgIconClaudebinXs } from "@/components/icon/svg-icon-claudebin-xs";
import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";

// ABOUTME: Static skeleton for AppBar during Suspense — renders logo and divider
// without dynamic hooks (usePathname, useAuth) that would break cacheComponents prerender
const AppBarSkeleton = () => {
  return (
    <header data-slot="app-bar" className="sticky top-0 z-50">
      <Container size="lg">
        <div className="flex items-center justify-between pt-3 pb-2">
          <Link href="/" className="transition-colors ease-in-out hover:text-orange-50">
            <SvgIconClaudebinXs size="auto" className="w-14" />
          </Link>
        </div>
        <Divider />
      </Container>
    </header>
  );
};

export { AppBarSkeleton };
