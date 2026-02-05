// This file configures the initialization of Sentry on the server.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { captureConsoleIntegration } from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment: production, staging, or development
  environment: process.env.NEXT_PUBLIC_SENTRY_ENV || process.env.NODE_ENV,

  // Sample 10% of transactions in production, 100% in staging
  tracesSampleRate: process.env.NEXT_PUBLIC_SENTRY_ENV === "production" ? 0.1 : 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Capture console.error calls as Sentry events
  integrations: [captureConsoleIntegration({ levels: ["error"] })],

  // Disable in local development to reduce noise
  enabled: process.env.NODE_ENV === "production",
});
