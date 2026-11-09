import { getSession } from "../../../../lib/payments";
import { clientIp, limited } from "../../../../lib/rate-limit";
import { activationMode } from "../../../../lib/site-env";

// Tells the /welcome page whether this Checkout Session was really paid.
export async function GET(req: Request) {
  if (limited(`status:${clientIp(req)}`, 30, 60_000)) {
    return Response.json({ error: "Too many requests." }, { status: 429 });
  }
  const id = new URL(req.url).searchParams.get("session_id") ?? "";
  const session = await getSession(id);
  if (!session) return Response.json({ paid: false }, { status: 404 });
  // `mode` tells the /welcome page which screen to show (see lib/site-env.ts).
  return Response.json({
    paid: session.paid,
    email: session.email,
    name: session.name,
    mode: activationMode(),
  });
}
