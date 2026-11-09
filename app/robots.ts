import type { MetadataRoute } from "next";
import { allowIndexing } from "../lib/site-env";

// Built from ROBOTS_ALLOW_INDEX (see lib/site-env.ts). Default: block everything.
export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Transactional pages and the API have nothing useful to index.
      disallow: ["/api/", "/welcome"],
    },
  };
  // TODO(domain): once the final domain exists, add  sitemap: "https://<domain>/sitemap.xml"
}
