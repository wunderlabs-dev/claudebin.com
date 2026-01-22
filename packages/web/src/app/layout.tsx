import "@/static/css/globals.css";

import type { Metadata } from "next";
import { Host_Grotesk, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { cn } from "@/utils/helpers";

import copy from "@/copy/en-EN.json";

import { Footer } from "@/components/ui/footer";
import { AppBar } from "@/components/ui/app-bar";

type RootLayoutProps = {
  children: React.ReactNode;
};

const sans = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: copy.metadata.title,
  description: copy.metadata.description,
  icons: "/favicon.svg",
};

const RootLayout = async ({ children }: RootLayoutProps) => {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={cn(sans.variable, mono.variable)}>
      <body className="min-h-screen bg-fade bg-gray-100 font-sans text-white antialiased selection:bg-orange-50 selection:text-white">
        <NextIntlClientProvider messages={messages}>
          <AppBar />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
