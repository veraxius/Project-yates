import { notify } from "../../../../lib/notify";
import { siteUrl, verifyWebhook } from "../../../../lib/payments";

// Stripe calls this when a payment completes, even if the buyer closed the tab
// before choosing a password. We email them a link to finish.
// In the Stripe dashboard add the endpoint  <site>/api/stripe/webhook  for the
// event  checkout.session.completed  and copy its signing secret into
// STRIPE_WEBHOOK_SECRET.

export async function POST(req: Request) {
  const raw = await req.text(); // must be the untouched body for the signature
  if (!verifyWebhook(raw, req.headers.get("stripe-signature"))) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(raw) as {
    type: string;
    data: {
      object: {
        id: string;
        payment_status?: string;
        customer_email?: string | null;
        customer_details?: { email?: string | null; name?: string | null } | null;
        metadata?: { name?: string } | null;
      };
    };
  };

  if (event.type === "checkout.session.completed") {
    const s = event.data.object;
    const email = (s.customer_details?.email ?? s.customer_email ?? "").toLowerCase();
    if (email && (s.payment_status === "paid" || s.payment_status === "no_payment_required")) {
      await notify({
        event: "payment.confirmed",
        email,
        name: s.metadata?.name ?? s.customer_details?.name ?? "",
        welcomeUrl: `${siteUrl()}/welcome?session_id=${s.id}`,
      });
    }
  }

  return new Response("ok", { status: 200 });
}
