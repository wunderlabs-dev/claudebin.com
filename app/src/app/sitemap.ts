import type { MetadataRoute } from "next";
import { toString } from "es-toolkit/compat";

import { APP_URL } from "@/utils/constants";
import { createServiceClient } from "@/server/supabase/service";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const supabase = createServiceClient();

  const [{ data: sessions }, { data: users }] = await Promise.all([
    supabase
      .from("sessions")
      .select("id, createdAt")
      .eq("isPublic", true)
      .order("createdAt", { ascending: false }),
    supabase
      .from("profiles")
      .select("username, updatedAt")
      .is("deletedAt", null)
      .not("username", "is", null),
  ]);

  const pages = [
    {
      priority: 1,
      changeFrequency: "daily",
      lastModified: new Date(),
      url: toString(new URL("/", APP_URL)),
    },
    {
      priority: 0.9,
      changeFrequency: "hourly",
      lastModified: new Date(),
      url: toString(new URL("/threads", APP_URL)),
    },
    {
      priority: 0.2,
      changeFrequency: "yearly",
      url: toString(new URL("/privacy-policy", APP_URL)),
    },
  ] satisfies MetadataRoute.Sitemap;

  const threads = (sessions ?? []).map((thread) => ({
    priority: 0.7,
    changeFrequency: "weekly",
    lastModified: new Date(thread.createdAt),
    url: toString(new URL(`/threads/${thread.id}`, APP_URL)),
  })) satisfies MetadataRoute.Sitemap;

  const profiles = (users ?? []).map((profile) => ({
    priority: 0.5,
    changeFrequency: "weekly",
    lastModified: new Date(profile.updatedAt),
    url: toString(new URL(`/profile/${profile.username}`, APP_URL)),
  })) satisfies MetadataRoute.Sitemap;

  return [...pages, ...threads, ...profiles];
};

export default sitemap;
