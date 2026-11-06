import { createCheckout } from "../../../lib/payments";
import { clientIp, limited } from "../../../lib/rate-limit";

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  if (limited(`checkout:${clientIp(req)}`, 10, 10 * 60_000)) {
    return Response.json({ error: "Too many attempts. Please try again in a few minutes." }, { status: 429 });
  }

  let body: { name?: unknown; email?: unknown; acceptTerms?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (name.length < 2 || name.length > 100) {
    return Response.json({ error: "Please enter your full name." }, { status: 400 });
  }
  if (!EMAIL.test(email)) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (body.acceptTerms !== true) {
    return Response.json({ error: "Please accept the terms to continue." }, { status: 400 });
  }

  try {
    const url = await createCheckout({ name, email });
    return Response.json({ url });
  } catch {
    return Response.json(
      { error: "We couldn't start the payment. Please try again or contact us." },
      { status: 502 },
    );
  }
}
