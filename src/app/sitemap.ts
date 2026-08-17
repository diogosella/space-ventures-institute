import type { MetadataRoute } from "next";
import { routes, site } from "@/lib/site";
import { getAllInternships } from "@/lib/strapi";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const internships = await getAllInternships();
  const staticRoutes = Object.values(routes).map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  })) satisfies MetadataRoute.Sitemap;

  return [
    ...staticRoutes,
    ...internships.map((item) => ({
      url: `${site.url}/internships/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
