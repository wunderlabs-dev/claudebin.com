const { not } = require("ramda");
const { resolve } = require("node:path");
const { withSentryConfig } = require("@sentry/nextjs");
const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Vercel uses /vercel/path0, local uses resolved path to monorepo root
const root = process.env.VERCEL ? "/vercel/path0" : resolve(__dirname, "../..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  dynamicIO: false,
  cacheComponents: true,
  outputFileTracingRoot: root,
  turbopack: {
    root: root,
  },
};

const sentryConfig = {
  org: "wunderlabs",
  project: "claudebin",
  // Only print logs for uploading source maps in CI
  silent: not(process.env.CI),
  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,
  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers
  tunnelRoute: "/monitoring",
  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors
    automaticVercelMonitors: true,
    // Tree-shaking options for reducing bundle size
    treeshake: {
      removeDebugLogging: true,
    },
  },
};

module.exports = withSentryConfig(withNextIntl(nextConfig), sentryConfig);
