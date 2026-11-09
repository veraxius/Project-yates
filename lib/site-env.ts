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
 * How a buyer gets their LearnWorlds password after paying:
 *
 *   "password" (default) Only paying members get an account. After paying, the
 *              buyer chooses their name and password on our /welcome page and
 *              we send them to LearnWorlds. Needs a test to confirm that the
 *              LearnWorlds API accepts a password when creating a user.
 *   "email"    Fallback if that test fails: the account is created WITHOUT a
 *              password and the buyer creates one with the reset link.
 */
export function activationMode(): "email" | "password" {
  return process.env.ACTIVATION_MODE === "email" ? "email" : "password";
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
