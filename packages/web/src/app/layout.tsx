import "@/static/css/globals.css";

import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Host_Grotesk, JetBrains_Mono } from "next/font/google";

import copy from "@/copy/en-EN.json";

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
};

const RootLayout = async ({ children }: RootLayoutProps) => {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
