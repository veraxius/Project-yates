// Tiny in-memory limiter. Good enough for one server instance (Railway runs
// one); if the site is ever scaled to several instances, move this to Redis
// or Cloudflare rate limiting.

const hits = new Map<string, number[]>();

export function limited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return recent.length > max;
}

// Which address counts as "the visitor". The FIRST X-Forwarded-For entry can be
// written by the client itself, so it is not trusted. Order of preference:
//   1. CF-Connecting-IP  (set by Cloudflare, when the site sits behind it)
//   2. X-Real-IP         (set by the hosting proxy)
//   3. the LAST X-Forwarded-For entry (appended by the nearest trusted proxy)
// Caveat: if someone reaches the Railway URL directly, bypassing Cloudflare,
// they could still send their own CF-Connecting-IP. Locking Railway so only
// Cloudflare can reach it (or using Cloudflare rate limiting) closes that gap.
export function clientIp(req: Request): string {
  const h = req.headers;
  const cf = h.get("cf-connecting-ip")?.trim();
  if (cf) return cf;
  const real = h.get("x-real-ip")?.trim();
  if (real) return real;
  const xff = h.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",");
    return parts[parts.length - 1].trim() || "unknown";
  }
  return "unknown";
}

/**
 * POST bodies must be JSON. Browsers cannot send application/json cross-site
 * without a CORS preflight (which this site never allows), so this blocks
 * forged cross-site form posts.
 */
export function isJsonRequest(req: Request): boolean {
  return (req.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json");
}
