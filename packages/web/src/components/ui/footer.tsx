import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getYear } from "date-fns";

import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Typography } from "@/components/ui/typography";

import { SvgIconClaudebin } from "@/components/icon";

type FooterProps = ComponentProps<"footer">;

const renderers = {
  year: getYear(new Date()),
  link: (chunks: ReactNode) => (
    <a
      target="_blank"
      href="https://wunderlabs.dev"
      rel="noopener noreferrer"
      className="text-orange-50"
    >
      {chunks}
    </a>
  ),
} as const;

const sections = [
  {
    title: "footer.product",
    links: [
      { href: "/", labelKey: "footer.claudebin" },
      { href: "/threads", labelKey: "footer.threads" },
      { href: "/login", labelKey: "footer.login" },
      { href: "/tutorial", labelKey: "footer.tutorial" },
      { href: "/terms", labelKey: "footer.securityTerms" },
    ],
  },
  {
    title: "footer.community",
    links: [
      { href: "https://github.com/wunderlabs-dev", labelKey: "footer.github" },
      { href: "https://x.com/claudebin", labelKey: "footer.twitter" },
    ],
  },
] as const;

const Footer = ({ className, ...props }: FooterProps) => {
  const t = useTranslations();

  return (
    <footer data-slot="footer" className={className} {...props}>
      <Container size="lg" spacing="lg">
        <Divider />

        <div className="flex items-stretch justify-between gap-12 pt-3 pb-12">
          <div className="flex flex-col justify-between">
            <Link href="/">
              <SvgIconClaudebin size="auto" className="w-xl" />
            </Link>
            <Typography variant="small" color="muted">
              {t.rich("footer.copyright", renderers)}
            </Typography>
          </div>

          <div className="flex gap-12">
            {sections.map((section) => (
              <nav key={section.title} className="flex flex-col gap-3">
                <Typography variant="h4">{t(section.title)}</Typography>

                {section.links.map((item) => (
                  <Link key={item.href} href={item.href} className="text-base hover:text-orange-50">
                    {t(item.labelKey)}
                  </Link>
                ))}
              </nav>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
};

export { Footer };
