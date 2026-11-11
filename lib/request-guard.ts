// Checks shared by the routes that accept input from visitors (/api/leads and
// /api/chat). Server-side only.

import { publicSiteUrl } from "./site-env";

/** Browsers cannot send JSON to another site without that site's permission. */
export function hasJsonContentType(req: Request): boolean {
  return (req.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json");
}

/**
 * A browser always says which site a request comes from, and it must be this
 * one. Requests without an Origin header (curl, servers) pass: this blocks
 * forged posts from OTHER WEBSITES, it is not a login. The site's own name is
 * taken from the request (as the hosting passes it on) or NEXT_PUBLIC_SITE_URL.
 */
export function isSameSiteRequest(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const site = publicSiteUrl();
    const ownHosts = [req.headers.get("host"), req.headers.get("x-forwarded-host"), site ? new URL(site).host : null];
    return ownHosts.includes(new URL(origin).host);
  } catch {
    return false;
  }
}

/** Reads the body, giving up as soon as it is larger than `max` bytes. */
export async function readBody(req: Request, max: number): Promise<string | null> {
  if (Number(req.headers.get("content-length") ?? 0) > max) return null;
  if (!req.body) return "";
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}

/** Parses a JSON object body, or returns null when it is not one. */
export function parseJsonObject(raw: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** The address of the automation (n8n) and its secret, or null when not usable. */
export function automationTarget(urlValue: string | undefined, secret: string | undefined): { url: string; secret: string } | null {
  if (!urlValue || !secret) return null;
  try {
    const target = new URL(urlValue);
    const local = target.hostname === "localhost" || target.hostname === "127.0.0.1";
    // Personal data never travels unencrypted, except to a test receiver on this machine.
    if (target.protocol !== "https:" && !(target.protocol === "http:" && local)) return null;
    return { url: target.toString(), secret };
  } catch {
    return null;
  }
}
