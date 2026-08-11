import type { MetadataRoute } from "next";
import { getLawyers, getServices } from "@/lib/repository";
import { localeHref } from "@/lib/routes";
import { siteUrl } from "@/lib/seo";

/** Both locales for every public page, generated from the repository layer. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();

  const barePaths = [
    "/",
    "/services",
    "/lawyers",
    "/guarantee",
    "/consultation",
    "/about",
    "/terms",
    "/privacy",
    ...getServices().map((service) => `/services/${service.slug}`),
    ...getLawyers().map((lawyer) => `/lawyers/${lawyer.slug}`),
  ];

  return barePaths.map((path) => ({
    url: `${base}${localeHref("ka", path)}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/services/") ? 0.8 : 0.6,
    alternates: {
      languages: {
        ka: `${base}${localeHref("ka", path)}`,
        en: `${base}${localeHref("en", path)}`,
      },
    },
  }));
}
