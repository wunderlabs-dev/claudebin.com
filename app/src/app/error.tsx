"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { useTranslations } from "next-intl";

import { gradient } from "@/utils/renderers";

import {
  DividerGrid,
  DividerGridRow,
  DividerGridEdge,
  DividerGridCell,
  DividerGridDivider,
} from "@/components/ui/divider-grid";

import { Footer } from "@/components/ui/footer";
import { AppBar } from "@/components/ui/app-bar";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Typography } from "@/components/ui/typography";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  const t = useTranslations();

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  const handleReset = () => {
    reset();
  };

  return (
    <>
      <AppBar />

      <Container as="section" size="md" spacing="md">
        <DividerGrid>
          <DividerGridRow>
            <DividerGridEdge position="left" className="col-span-1" />
            <DividerGridCell className="col-span-6 border-b">
              <DividerGridDivider variant="top" />
            </DividerGridCell>
            <DividerGridCell className="flex justify-end col-span-4 border-b">
              <DividerGridDivider variant="top" />
            </DividerGridCell>
            <DividerGridEdge position="right" className="col-span-1" />
          </DividerGridRow>

          <DividerGridRow>
            <DividerGridEdge position="left" className="col-span-1" />
            <DividerGridCell className="col-span-10 px-8 py-12 border-r border-b border-l">
              <div className="flex flex-col items-start max-w-lg gap-6 mx-auto">
                <Typography variant="h2" leading="normal">
                  {t.rich("error.title", { gradient })}
                </Typography>
                <Typography variant="body" color="muted">
                  {t("error.description")}
                </Typography>
                <div className="flex gap-3">
                  <Button variant="default" onClick={handleReset}>
                    {t("error.tryAgain")}
                  </Button>
                  <Button as={Link} href="/" variant="secondary">
                    {t("error.backToHome")}
                  </Button>
                </div>
              </div>
            </DividerGridCell>
            <DividerGridEdge position="right" className="col-span-1" />
          </DividerGridRow>

          <DividerGridRow>
            <DividerGridCell className="col-span-1" />
            <DividerGridCell className="col-span-6">
              <DividerGridDivider variant="bottom" />
            </DividerGridCell>
            <DividerGridCell className="flex justify-end col-span-4">
              <DividerGridDivider variant="bottom" />
            </DividerGridCell>
            <DividerGridCell className="col-span-1" />
          </DividerGridRow>
        </DividerGrid>
      </Container>

      <Footer />
    </>
  );
};

export default ErrorPage;
