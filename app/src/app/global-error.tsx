"use client";

import { useEffect } from "react";
import NextError from "next/error";
import * as Sentry from "@sentry/nextjs";

type GlobalErrorProps = {
  error: Error & { digest?: string };
};

const GlobalError = ({ error }: GlobalErrorProps) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
};

export default GlobalError;
