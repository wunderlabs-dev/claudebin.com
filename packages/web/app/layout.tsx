import "@/static/css/globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claudebin - Share Your Claude Sessions",
  description:
    "A pastebin for vibes. Publish and share your Claude Code sessions.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
