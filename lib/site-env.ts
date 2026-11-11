// Single switch that decides whether search engines may index this deployment.
//
//   ROBOTS_ALLOW_INDEX=true   -> the FINAL public site: indexing allowed
//   anything else / not set   -> staging, previews, local: indexing blocked
//
// Default is OFF on purpose, so a staging copy is never indexed by accident.
// Set it to "true" ONLY on the production deployment, before it is built
// (Railway rebuilds and redeploys when a variable changes).
export function allowIndexing(): boolean {
  return process.env.ROBOTS_ALLOW_INDEX === "true";
}

/**
 * Whether the chatbot is connected: both N8N_CHAT_URL and N8N_CHAT_KEY must be
 * set. The "Ask us" button always shows; when this is false its window says the
 * assistant is almost ready instead of offering a message box. The layout reads
 * this when the site is built, so after adding or changing the variables the site
 * has to be redeployed (Railway does it on its own).
 */
export function chatEnabled(): boolean {
  return Boolean(process.env.N8N_CHAT_URL && process.env.N8N_CHAT_KEY);
}

/** The public address of the site (NEXT_PUBLIC_SITE_URL), without a trailing slash, or null if not set. */
export function publicSiteUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  return url ? url.replace(/\/$/, "") : null;
}

/**
 * Canonical address of a page, for `metadata.alternates`.
 *
 * It tells Google which address is the official one, so the same page served
 * from two addresses (the Railway one and the final domain, or with tracking
 * parameters such as ?utm_source=) is not counted as duplicate content.
 * Every page passes its own path; it must never be set once for the whole site,
 * or every page would claim to be the home page.
 *
 * Returns undefined when NEXT_PUBLIC_SITE_URL is not set (no tag is written),
 * so a missing variable can never break the build.
 */
export function canonicalFor(path: string): { canonical: string } | undefined {
  const base = publicSiteUrl();
  if (!base) return undefined;
  return { canonical: path === "/" ? `${base}/` : `${base}${path}` };
}
