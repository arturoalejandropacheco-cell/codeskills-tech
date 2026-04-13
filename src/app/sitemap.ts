import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("items")
    .select("slug, type, updated_at")
    .eq("status", "published");

  const baseUrl = "https://codeskills.tech";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/skills`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/rules`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/mcps`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/agents`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/login`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const itemPages: MetadataRoute.Sitemap = (items ?? []).map((item) => ({
    url: `${baseUrl}/${item.type}s/${item.slug}`,
    lastModified: new Date(item.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...itemPages];
}
