import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { allowIndexing } from "./lib/site-env";

// Runs before every request (Next.js 16 name for what used to be "middleware").
// It does three jobs:
//   1. Sends plain-http requests to https (Railway terminates TLS and tells us
//      the original protocol in X-Forwarded-Proto).
//   2. Optional password gate for non-final environments, controlled by
//      STAGING_BASIC_AUTH_USER and STAGING_BASIC_AUTH_PASS.
//   3. Adds "X-Robots-Tag: noindex, nofollow" whenever indexing is off.

/** Constant-time string comparison, so response timing leaks nothing. */
function safeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

function passesBasicAuth(request: NextRequest, user: string, pass: string): boolean {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return false;
  let decoded: string;
  try {
    decoded = atob(header.slice(6));
  } catch {
    return false;
  }
  const i = decoded.indexOf(":");
  if (i < 0) return false;
  // Evaluate both so a wrong user name takes as long as a wrong password.
  const okUser = safeEqual(decoded.slice(0, i), user);
  const okPass = safeEqual(decoded.slice(i + 1), pass);
  return okUser && okPass;
}

// Paths that must stay reachable even when the staging password gate is on:
//  - crawlers must be able to read robots.txt to learn they are not welcome
const OPEN_PATHS = new Set(["/robots.txt"]);

// Hosts that never represent a real visitor on the public internet.
// TODO(railway): confirm the health check host in the Railway dashboard; if the
// deploy fails its health check, set FORCE_HTTPS=false and let Cloudflare
// ("Always Use HTTPS") or Railway redirect instead.
const INTERNAL_HOST = /^(localhost|127\.0\.0\.1|\[::1\]|healthcheck\.railway\.app|[^:]*\.railway\.internal)(:\d+)?$/i;

function shouldForceHttps(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  if (process.env.FORCE_HTTPS === "false") return false;
  if (request.headers.get("x-forwarded-proto") !== "http") return false;
  const host = request.headers.get("host");
  // No Host header = an internal call (e.g. the image optimizer fetching its own
  // files); real browsers and edge proxies always send one.
  if (!host) return false;
  return !INTERNAL_HOST.test(host);
}

export function proxy(request: NextRequest) {
  const noindex = !allowIndexing();
  const tag = (res: NextResponse) => {
    if (noindex) res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  };

  // 1. Enforce https (only in production, only when a proxy says it was http).
  //
  // Care: Next.js itself fills X-Forwarded-Proto with "http" on requests that
  // reach it directly, so the header alone is not proof that a visitor used
  // plain http. Requests that never came through the public edge must NOT be
  // redirected: local runs, internal calls (the image optimizer fetches its own
  // files) and Railway's health check. Set FORCE_HTTPS=false to turn this off
  // (for example if the host/edge already redirects http to https).
  if (shouldForceHttps(request)) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.port = "";
    const host = request.headers.get("host");
    if (host) url.host = host;
    return tag(NextResponse.redirect(url, 308));
  }

  // 2. Optional Basic Auth gate for staging.
  const user = process.env.STAGING_BASIC_AUTH_USER;
  const pass = process.env.STAGING_BASIC_AUTH_PASS;
  if (user && pass && !OPEN_PATHS.has(request.nextUrl.pathname)) {
    if (!passesBasicAuth(request, user, pass)) {
      return tag(
        new NextResponse("Authentication required", {
          status: 401,
          headers: { "WWW-Authenticate": 'Basic realm="Restricted", charset="UTF-8"' },
        }),
      );
    }
  }

  // 3. Everything else continues, marked noindex when indexing is off.
  return tag(NextResponse.next());
}

export const config = {
  // Skip Next's own build assets; everything else (pages, public files) passes through.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
