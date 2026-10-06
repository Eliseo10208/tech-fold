import type { MetadataRoute } from "next";
import { getContent, SITE_URL } from "@/lib/portfolio";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", ...getContent("es").Projects.map(project => `/projects/${project.slug}`)];
  return paths.flatMap(path => ["es", "en"].map(locale => ({
    url: `${SITE_URL}/${locale}${path}`,
    alternates: { languages: { es: `${SITE_URL}/es${path}`, en: `${SITE_URL}/en${path}` } },
  })));
}
