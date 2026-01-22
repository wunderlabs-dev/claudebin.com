import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/callback"];

const isPublicRoute = (pathname: string): boolean => {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  if (pathname.startsWith("/api/")) return true;
  return false;
};

export const middleware = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const allCookies = request.cookies.getAll();
  console.log(
    `[middleware] ${pathname} - cookies:`,
    allCookies.map((c) => c.name).join(", ") || "none",
  );

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          console.log(
            `[middleware] setAll called with:`,
            cookiesToSet.map((c) => c.name).join(", "),
          );
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({
            request,
          });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log(
    `[middleware] ${pathname} - getUser:`,
    user?.email ?? "no user",
    userError?.message ?? "",
  );

  if (!user && !isPublicRoute(pathname)) {
    console.log(`[middleware] ${pathname} - redirecting to login (not public route)`);
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname + request.nextUrl.search);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
};

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
