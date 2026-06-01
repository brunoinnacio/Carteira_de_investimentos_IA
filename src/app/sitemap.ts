import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES, SITE_URL } from "@/lib/site";
import { MODULOS } from "@/data/trilha";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const rotasFixas: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path === "/" ? "" : route.path}`,
    lastModified: now,
    changeFrequency: route.path === "/" ? "weekly" : "monthly",
    priority: route.priority,
  }));

  const rotasModulos: MetadataRoute.Sitemap = MODULOS.map((m) => ({
    url: `${SITE_URL}/aprender/${m.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...rotasFixas, ...rotasModulos];
}
