// Sends events to the n8n workflow that writes and sends the emails.
// Needs N8N_WEBHOOK_URL (and optionally N8N_WEBHOOK_SECRET, sent as a header
// so the workflow can reject calls that don't come from this site).
//
// Payloads NEVER contain a password.

export type SiteEvent =
  | {
      event: "payment.confirmed";
      email: string;
      name: string;
      // Lets the buyer finish creating their password if they closed the tab.
      welcomeUrl: string;
    }
  | {
      event: "course.activated";
      email: string;
      name: string;
      loginUrl: string;
      // Link for "I want to change my password" (LearnWorlds' reset page).
      passwordResetUrl: string;
      alreadyHadAccount: boolean;
      // true when the account has NO password yet, so the email must tell the
      // buyer to create one (with passwordResetUrl) to be able to sign in again.
      needsPassword: boolean;
    };

export async function notify(payload: SiteEvent): Promise<boolean> {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[notify:demo] ${payload.event} -> ${payload.email} (no N8N_WEBHOOK_URL set)`);
    }
    return false;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.N8N_WEBHOOK_SECRET
          ? { "X-Webhook-Secret": process.env.N8N_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false; // an email failure must never break the purchase
  }
}
