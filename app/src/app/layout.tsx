import "@/static/css/globals.css";
import "katex/dist/katex.min.css";

import type { Metadata } from "next";
import { Host_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { toString } from "es-toolkit/compat";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { createClient } from "@/server/supabase/server";

import copy from "@/copy/en-EN.json";

import { cn } from "@/utils/helpers";
import { APP_URL } from "@/utils/constants";

import { AuthProvider } from "@/context/auth";
import { QueryProvider } from "@/context/query";

type RootLayoutProps = {
  children: React.ReactNode;
};

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const openGraphSrc = {
  url: "/images/og-default-1200x630.webp",
  width: OG_IMAGE_WIDTH,
  height: OG_IMAGE_HEIGHT,
  alt: copy.metadata.siteName,
};

const data = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: copy.metadata.organizationName,
      email: "office@wunderlabs.dev",
      url: "https://wunderlabs.dev/",
      sameAs: ["https://github.com/wunderlabs-dev", "https://agentic.tm/"],
      founder: [
        { "@type": "Person", name: "Vlad Temian", url: "https://blog.vtemian.com/" },
        { "@type": "Person", name: "Marius Balaj", url: "https://balajmarius.com/" },
      ],
      logo: toString(new URL("/images/favicon.svg", APP_URL)),
    },
    {
      "@type": "WebSite",
      name: copy.metadata.siteName,
      description: copy.metadata.description,
      url: toString(new URL("/", APP_URL)),
      inLanguage: "en-US",
      potentialAction: {
        "@type": "SearchAction",
        "query-input": "required name=search_term_string",
        target: toString(new URL("/threads?query={search_term_string}", APP_URL)),
      },
      publisher: {
        "@type": "Organization",
        url: "https://wunderlabs.dev/",
        name: copy.metadata.organizationName,
      },
    },
    {
      "@type": "SoftwareApplication",
      name: copy.metadata.siteName,
      description: copy.metadata.description,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      url: toString(new URL("/", APP_URL)),
      image: toString(new URL(openGraphSrc.url, APP_URL)),
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: {
        "@type": "Organization",
        url: "https://wunderlabs.dev/",
        name: copy.metadata.organizationName,
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: copy.metadata.title,
  description: copy.metadata.description,
  icons: "/images/favicon.svg",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: APP_URL,
    siteName: copy.metadata.siteName,
    title: copy.metadata.title,
    description: copy.metadata.description,
    images: [openGraphSrc],
  },
  twitter: {
    card: "summary_large_image",
    title: copy.metadata.title,
    description: copy.metadata.description,
    images: [openGraphSrc],
  },
};

const RootLayout = async ({ children }: RootLayoutProps) => {
  const locale = await getLocale();
  const messages = await getMessages();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang={locale} className={cn(hostGrotesk.variable, jetBrainsMono.variable)}>
      <body className="min-h-screen bg-fade bg-gray-100 font-sans text-white antialiased selection:bg-orange-50 selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data),
          }}
        />

        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            <AuthProvider initialUser={user}>{children}</AuthProvider>
          </NextIntlClientProvider>
        </QueryProvider>

        <Analytics />
        <SpeedInsights />

        {process.env.NEXT_PUBLIC_GA_ID ? (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        ) : null}
      </body>
    </html>
  );
};

export default RootLayout;
