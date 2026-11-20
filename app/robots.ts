import type { MetadataRoute } from "next";
import { allowIndexing, publicSiteUrl } from "../lib/site-env";

// Built from ROBOTS_ALLOW_INDEX (see lib/site-env.ts). Default: block everything.
export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  const base = publicSiteUrl();
  return {
    rules: { userAgent: "*", allow: "/" },
    // Only pointed at a sitemap once NEXT_PUBLIC_SITE_URL is set (app/sitemap.ts
    // returns an empty sitemap until then, so there is nothing to point to).
    ...(base ? { sitemap: `${base}/sitemap.xml` } : {}),
  };
}
