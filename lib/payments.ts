import { createHmac, timingSafeEqual } from "node:crypto";

// Stripe, called straight over HTTPS (no SDK). Server-side only.
// Needs STRIPE_SECRET_KEY and STRIPE_PRICE_ID. Without them the flow runs in a
// local "demo" mode (never in production) so the whole journey can be tested.

const STRIPE_API = "https://api.stripe.com/v1";

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID);
}

/** Demo mode: no Stripe keys AND not a production build. */
export function isDemo(): boolean {
  return !stripeConfigured() && process.env.NODE_ENV !== "production";
}

export function siteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url && process.env.NODE_ENV === "production") {
    // Stripe sends the buyer back to this address, so a wrong value would send them to localhost.
    throw new Error("NEXT_PUBLIC_SITE_URL must be set in production");
  }
  return (url ?? "http://localhost:3000").replace(/\/$/, "");
}

// `created` is when the payment session started (seconds since 1970).
export type PaidSession = { paid: boolean; email: string; name: string; created: number };

async function stripe<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${STRIPE_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
      ...init?.headers,
    },
    cache: "no-store",
  });
  const data = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) throw new Error(data.error?.message ?? `Stripe error ${res.status}`);
  return data;
}

function demoId(email: string, name: string): string {
  return "demo_" + Buffer.from(JSON.stringify({ email, name })).toString("base64url");
}

function readDemoId(id: string): { email: string; name: string } | null {
  if (!id.startsWith("demo_")) return null;
  try {
    const v = JSON.parse(Buffer.from(id.slice(5), "base64url").toString("utf8"));
    return typeof v.email === "string" ? { email: v.email, name: String(v.name ?? "") } : null;
  } catch {
    return null;
  }
}

/** Creates a Stripe Checkout Session and returns the page to send the buyer to. */
export async function createCheckout(input: { email: string; name: string }): Promise<string> {
  if (isDemo()) {
    return `${siteUrl()}/welcome?session_id=${demoId(input.email, input.name)}`;
  }
  if (!stripeConfigured()) throw new Error("Payments are not configured");

  const body = new URLSearchParams({
    mode: process.env.STRIPE_MODE === "subscription" ? "subscription" : "payment",
    "line_items[0][price]": process.env.STRIPE_PRICE_ID as string,
    "line_items[0][quantity]": "1",
    customer_email: input.email,
    success_url: `${siteUrl()}/welcome?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl()}/learn/enroll?canceled=1`,
    "metadata[name]": input.name,
    "metadata[product]": "yb-broker-certification",
  });
  const session = await stripe<{ url: string }>("/checkout/sessions", {
    method: "POST",
    body,
  });
  return session.url;
}

/** Looks a session up on Stripe's side. The browser is never trusted for "paid". */
export async function getSession(id: string): Promise<PaidSession | null> {
  if (!/^[A-Za-z0-9_\-]{8,600}$/.test(id)) return null;

  if (isDemo()) {
    const d = readDemoId(id);
    return d
      ? { paid: true, email: d.email, name: d.name, created: Math.floor(Date.now() / 1000) }
      : null;
  }
  if (!stripeConfigured() || !id.startsWith("cs_")) return null;

  try {
    const s = await stripe<{
      created: number;
      payment_status: string;
      customer_email: string | null;
      customer_details: { email: string | null; name: string | null } | null;
      metadata: { name?: string } | null;
    }>(`/checkout/sessions/${encodeURIComponent(id)}`);
    return {
      paid: s.payment_status === "paid" || s.payment_status === "no_payment_required",
      email: (s.customer_details?.email ?? s.customer_email ?? "").toLowerCase(),
      name: s.metadata?.name ?? s.customer_details?.name ?? "",
      created: s.created,
    };
  } catch {
    return null;
  }
}

/**
 * Verifies the `Stripe-Signature` header of a webhook (HMAC-SHA256 of
 * "<timestamp>.<raw body>"). `rawBody` must be the exact bytes Stripe sent.
 */
export function verifyWebhook(rawBody: string, header: string | null): boolean {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !header) return false;

  const parts = Object.fromEntries(
    header.split(",").map((p) => {
      const i = p.indexOf("=");
      return [p.slice(0, i), p.slice(i + 1)];
    }),
  );
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > 300) return false; // replay window: 5 min

  const expected = createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("hex");
  // Stripe may send several v1 signatures; accept if any matches.
  return header
    .split(",")
    .filter((p) => p.startsWith("v1="))
    .some((p) => {
      const sig = p.slice(3);
      return (
        sig.length === expected.length &&
        timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
      );
    });
}
