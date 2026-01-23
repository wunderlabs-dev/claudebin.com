import type { NextConfig } from "next";
import { resolve } from "path";

const nextConfig: NextConfig = {
  // Point to monorepo root for proper file tracing in Vercel deployments
  outputFileTracingRoot: resolve(__dirname, "../../"),
};

export default nextConfig;
