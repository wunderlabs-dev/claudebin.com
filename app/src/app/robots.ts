import type { MetadataRoute } from "next";
import { toString } from "es-toolkit/compat";

import { APP_URL } from "@/utils/constants";

export const dynamic = "force-static";

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: "*",
    allow: "/",
    disallow: ["/api/", "/auth/", "/cli/"],
  },
  sitemap: toString(new URL("/sitemap.xml", APP_URL)),
});

export default robots;
