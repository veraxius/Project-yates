// Request limits for the endpoints that accept input (/api/leads, /api/chat).
// Kept in memory, which is enough for a single server instance (Railway runs
// one). If the site is ever scaled to several instances, move this to Redis or
// to rate limiting at Cloudflare.
//
// Two limits work together, and each endpoint has its OWN scope so the chat can
// never use up the forms' allowance, or the other way round:
//
//  1. A TOTAL limit, for all visitors together. It does not depend on knowing
//     who the visitor is, so it cannot be dodged by faking an address. This is
//     the one that actually protects the automation, the CRM and the OpenAI bill.
//  2. A PER-ADDRESS limit, so one visitor cannot use up the total for everyone.
//     It is only as good as the address the hosting gives us (see below).
//
// Memory is bounded: at most MAX_COUNTERS counters exist at any time.

const MAX_COUNTERS = 4000;

type Counter = { count: number; resetAt: number };

const counters = new Map<string, Counter>();

/** Counts one request. True when the limit of the current window is exceeded. */
function count(counter: Counter, max: number, windowMs: number, now: number): boolean {
  if (now >= counter.resetAt) {
    counter.count = 0;
    counter.resetAt = now + windowMs;
  }
  counter.count += 1;
  return counter.count > max;
}

function hit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  let counter = counters.get(key);
  if (!counter) {
    if (counters.size >= MAX_COUNTERS) {
      for (const [k, v] of counters) if (now >= v.resetAt) counters.delete(k);
      // Still full: thousands of different addresses inside one window only
      // happens during an attack. Refuse new ones rather than grow.
      if (counters.size >= MAX_COUNTERS) return true;
    }
    counter = { count: 0, resetAt: 0 };
    counters.set(key, counter);
  }
  return count(counter, max, windowMs, now);
}

/** True when ALL visitors together have sent more than `max` requests to `scope` in the window. */
export function overTotalLimit(scope: string, max: number, windowMs: number): boolean {
  return hit(`${scope}:total`, max, windowMs);
}

/** True when this address has sent more than `max` requests to `scope` in the window. */
export function overAddressLimit(scope: string, address: string, max: number, windowMs: number): boolean {
  return hit(`${scope}:ip:${address}`, max, windowMs);
}

// The visitor's address, as far as the hosting tells us.
//
// Railway documents X-Real-IP as the visitor's address, but does not promise
// that a copy sent by the visitor is always replaced, and its statements about
// X-Forwarded-For contradict each other. So this value is treated as a hint:
// good enough to stop one ordinary visitor from flooding a form, never the
// only protection. CF-Connecting-IP is deliberately NOT read: the site is not
// behind Cloudflare, so anyone could write it. If Cloudflare is put in front
// AND Railway is locked so that only Cloudflare can reach it, read it here.
export function visitorAddress(req: Request): string {
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 64);
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",");
    // The last entry is the one added by the proxy nearest to this server.
    return parts[parts.length - 1].trim().slice(0, 64) || "unknown";
  }
  return "unknown";
}
