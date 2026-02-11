import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getYear } from "date-fns";

import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Typography } from "@/components/ui/typography";

import { SvgIconClaudebin } from "@/components/icon/svg-icon-claudebin";

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
    title: "footer.community",
    links: [
      { href: "https://github.com/wunderlabs-dev", labelKey: "footer.github" },
      { href: "https://agentic.tm", labelKey: "footer.discord" },
      { href: "https://x.com/vtemian", labelKey: "footer.vtemian" },
      { href: "https://x.com/balajmarius", labelKey: "footer.balajmarius" },
    ],
  },
  {
    title: "footer.product",
    links: [
      { href: "/", labelKey: "footer.claudebin" },
      { href: "/threads", labelKey: "footer.threads" },
      { href: "/auth/login", labelKey: "footer.login" },
    ],
  },
] as const;

const Footer = ({ className, ...props }: FooterProps) => {
  const t = useTranslations();

  return (
    <footer data-slot="footer" className={className} {...props}>
      <Container size="lg" spacing="lg">
        <Divider />

        <div className="flex flex-col items-stretch justify-between gap-12 pt-3 pb-12 lg:flex-row">
          <div className="flex flex-col justify-between gap-4 lg:gap-6">
            <Link href="/">
              <SvgIconClaudebin size="auto" className="max-w-xl" />
            </Link>
            <Typography variant="small" color="muted">
              {t.rich("footer.copyright", renderers)}
            </Typography>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row lg:gap-12">
            {sections.map((section) => (
              <nav key={section.title} className="flex flex-col gap-3">
                <Typography variant="h4">{t(section.title)}</Typography>

                {section.links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    className="text-base hover:text-orange-50"
                  >
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
