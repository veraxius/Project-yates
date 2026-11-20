import type { MetadataRoute } from "next";
import { publicSiteUrl } from "../lib/site-env";

// Every public, indexable route. Kept as a flat literal list (not derived from
// the filesystem) so a route that should stay out of the sitemap — an internal
// or legal page, for instance — has to be added here on purpose.
const routes: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/learn", changeFrequency: "weekly", priority: 0.9 },
  { path: "/discovery-pass", changeFrequency: "weekly", priority: 0.9 },
  { path: "/yb-experience", changeFrequency: "monthly", priority: 0.8 },
  { path: "/network", changeFrequency: "monthly", priority: 0.8 },
  { path: "/opportunities", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/discover", changeFrequency: "monthly", priority: 0.7 },
  { path: "/campus", changeFrequency: "monthly", priority: 0.7 },
  { path: "/creators", changeFrequency: "monthly", priority: 0.7 },
  { path: "/entrepreneurs", changeFrequency: "monthly", priority: 0.7 },
  { path: "/reinvent", changeFrequency: "monthly", priority: 0.7 },
  { path: "/resources", changeFrequency: "monthly", priority: 0.6 },
  { path: "/faq", changeFrequency: "weekly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/login", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/credential-disclaimer", changeFrequency: "yearly", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = publicSiteUrl();
  // No domain configured yet (staging/local): an empty sitemap rather than one
  // full of a throwaway Railway URL that would need to be thrown away later.
  if (!base) return [];

  const lastModified = new Date();
  return routes.map((route) => ({
    url: route.path === "/" ? `${base}/` : `${base}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
