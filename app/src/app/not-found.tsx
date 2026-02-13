import Link from "next/link";
import { getTranslations } from "next-intl/server";

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

const NotFound = async () => {
  const t = await getTranslations();

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
            <DividerGridCell className="col-span-4 flex justify-end border-b">
              <DividerGridDivider variant="top" />
            </DividerGridCell>
            <DividerGridEdge position="right" className="col-span-1" />
          </DividerGridRow>

          <DividerGridRow>
            <DividerGridEdge position="left" className="col-span-1" />
            <DividerGridCell className="col-span-10 border-r border-b border-l px-8 py-12">
              <div className="mx-auto flex max-w-lg flex-col items-start gap-6">
                <Typography variant="h2" leading="normal">
                  {t.rich("notFound.title", { gradient })}
                </Typography>
                <Typography variant="body" color="muted">
                  {t("notFound.description")}
                </Typography>
                <Button as={Link} href="/" variant="secondary">
                  {t("notFound.backToHome")}
                </Button>
              </div>
            </DividerGridCell>
            <DividerGridEdge position="right" className="col-span-1" />
          </DividerGridRow>

          <DividerGridRow>
            <DividerGridCell className="col-span-1" />
            <DividerGridCell className="col-span-6">
              <DividerGridDivider variant="bottom" />
            </DividerGridCell>
            <DividerGridCell className="col-span-4 flex justify-end">
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

export default NotFound;
