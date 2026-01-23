import type { NextConfig } from "next";
import { resolve } from "node:path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: resolve(__dirname, "../../"),
  experimental: {
    outputFileTracingIncludes: {
      "/*": ["./node_modules/next/dist/**/*"],
    },
  },
};

export default nextConfig;
