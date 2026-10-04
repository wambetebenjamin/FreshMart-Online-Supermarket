import type { MetadataRoute } from "next";
import { categories, products } from "@/lib/data";
import { SITE } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE.url,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...categories.map((c) => ({
      url: `${SITE.url}/category/${c.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${SITE.url}/products/${p.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE.url}/checkout`,
      priority: 0.3,
    },
    {
      url: `${SITE.url}/wishlist`,
      priority: 0.3,
    },
    {
      url: `${SITE.url}/account`,
      priority: 0.3,
    },
  ];
}
