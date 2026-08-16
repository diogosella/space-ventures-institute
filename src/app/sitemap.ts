import type { MetadataRoute } from "next";
import { routes, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(routes).map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
