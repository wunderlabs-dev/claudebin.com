// This file configures the initialization of Sentry for edge features (middleware, edge routes).
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment: production, preview, or development
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,

  // Sample 10% of transactions in production, 100% in preview
  tracesSampleRate: process.env.VERCEL_ENV === "production" ? 0.1 : 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Disable in local development to reduce noise
  enabled: process.env.NODE_ENV === "production",
});
