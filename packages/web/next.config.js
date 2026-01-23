const { resolve } = require("node:path");
const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Vercel uses /vercel/path0, local uses resolved path to monorepo root
const root = process.env.VERCEL ? "/vercel/path0" : resolve(__dirname, "../..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: root,
  turbopack: {
    root: root,
  },
};

module.exports = withNextIntl(nextConfig);
