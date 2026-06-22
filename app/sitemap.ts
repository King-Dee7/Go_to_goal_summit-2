import type { MetadataRoute } from "next";
import { speakerCards } from "@/lib/data/speakers";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://reinventaf.com";
  const now = new Date();

  // Dynamically map all speakers' profile paths
  const speakerUrls = speakerCards.map((speaker) => ({
    url: `${baseUrl}/speakers/${speaker.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/apply`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...speakerUrls,
  ];
}
