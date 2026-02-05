import { Container } from "@/components/ui/container";
import { Typography } from "@/components/ui/typography";

const HomePageTypographyShowcase = () => {
  return (
    <Container as="section" size="lg" spacing="lg" className="flex flex-col gap-6">
      <Typography variant="h1">
        H1 Typography Variant with longer text to see leading behavior across multiple lines
      </Typography>
      <Typography variant="h2">
        H2 Typography Variant with longer text to see leading behavior across multiple lines
      </Typography>
      <Typography variant="h3">
        H3 Typography Variant with longer text to see leading behavior across multiple lines
      </Typography>
      <Typography variant="h4">
        H4 Typography Variant with longer text to see leading behavior across multiple lines when
        content wraps
      </Typography>
      <Typography variant="body">
        Body Typography Variant with longer text to see leading behavior across multiple lines when
        content wraps to the next line and continues flowing naturally
      </Typography>
      <Typography variant="small">
        Small Typography Variant with longer text to see leading behavior across multiple lines when
        content wraps to the next line and continues flowing naturally
      </Typography>
      <Typography variant="overline">
        Overline Typography Variant with longer text to see leading behavior across multiple lines
        when content wraps
      </Typography>
      <Typography variant="caption">
        Caption Typography Variant with longer text to see leading behavior across multiple lines
        when content wraps to the next line
      </Typography>
    </Container>
  );
};

export { HomePageTypographyShowcase };
