import { isFormId } from "../../../lib/lead-forms";
import { parseLead } from "../../../lib/lead-validate";
import { overAddressLimit, overTotalLimit, visitorAddress } from "../../../lib/rate-limit";
import { automationTarget, hasJsonContentType, isSameSiteRequest, parseJsonObject, readBody } from "../../../lib/request-guard";

// Receives the forms of the campaign landing pages and hands each valid one to
// the automation (n8n), which stores it in the CRM. Together with /api/chat this
// is one of the only two places on the site that accept input from visitors.
//
// Nothing is stored here and nothing personal is logged. The automation address
// and its secret stay on the server, so the browser never learns where the data
// goes and nobody can post straight to the automation.
//
// Needs:  N8N_LEADS_WEBHOOK_URL     address of the n8n webhook
//         N8N_LEADS_WEBHOOK_SECRET  sent as the X-Webhook-Secret header
// Without BOTH, the forms answer "registration is not open yet".

const SCOPE = "leads";
const WINDOW_MS = 10 * 60_000;
// All visitors together. Sized for a busy campus event, far below anything that
// could flood the automation: at most 17,280 forwarded forms a day.
const TOTAL_LIMIT = 120;
// One address. Generous on purpose: at a campus event many students send the
// form from the same Wi-Fi, which looks like a single address.
const ADDRESS_LIMIT = 40;

const MAX_BODY_BYTES = 16_000;

function reply(status: number, error: string): Response {
  return Response.json({ error }, { status });
}

export async function POST(req: Request) {
  if (!hasJsonContentType(req)) return reply(415, "Unsupported content type.");
  if (!isSameSiteRequest(req)) return reply(403, "This form can only be sent from this website.");

  // Limits count every request, valid or not. The address is checked first, so
  // one address can never use up more than its own share of the total.
  const busy = "Too many requests right now. Please try again in a few minutes.";
  if (overAddressLimit(SCOPE, visitorAddress(req), ADDRESS_LIMIT, WINDOW_MS)) return reply(429, busy);
  if (overTotalLimit(SCOPE, TOTAL_LIMIT, WINDOW_MS)) return reply(429, busy);

  const raw = await readBody(req, MAX_BODY_BYTES);
  if (raw === null) return reply(413, "That is too much text. Please shorten your answers.");

  const body = parseJsonObject(raw);
  if (!body) return reply(400, "Invalid request.");

  // Hidden field that people never see. Automated fillers complete it; they get
  // a normal-looking answer and nothing is forwarded.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  if (!isFormId(body.form)) return reply(400, "Invalid request.");
  const result = parseLead(body.form, body);
  if (!result.ok) return reply(400, result.error);

  const target = automationTarget(process.env.N8N_LEADS_WEBHOOK_URL, process.env.N8N_LEADS_WEBHOOK_SECRET);
  if (!target) return reply(503, "Registration is not open yet. Please check back soon.");

  try {
    const res = await fetch(target.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Webhook-Secret": target.secret },
      body: JSON.stringify(result.lead),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`automation answered ${res.status}`);
  } catch (error) {
    // The reason only, never the person's details.
    console.error("[leads] could not hand a submission to the automation:", (error as Error).message);
    return reply(502, "We couldn't save your details just now. Please try again in a moment.");
  }

  return Response.json({ ok: true });
}
