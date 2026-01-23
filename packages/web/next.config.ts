import type { NextConfig } from "next";
import { resolve } from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: resolve(__dirname, "../../"),
  outputFileTracingIncludes: {
    "/*": ["./node_modules/next/dist/compiled/**/*"],
  },
};

export default nextConfig;
