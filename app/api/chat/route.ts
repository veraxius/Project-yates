import { overAddressLimit, overTotalLimit, visitorAddress } from "../../../lib/rate-limit";
import { automationTarget, hasJsonContentType, isSameSiteRequest, parseJsonObject, readBody } from "../../../lib/request-guard";

// The website chat. The browser sends ONE message here; this route passes it to
// the chatbot flow in n8n (flow 4) and returns the answer.
//
// Why a route and not a direct call from the browser: the n8n address and its key
// stay on the server. If the browser held the key, anyone could read it and run up
// the OpenAI bill.
//
// Nothing is stored here and message text is never logged.
//
// Needs:  N8N_CHAT_URL  Production URL of the n8n flow "4 · Chatbot: chat del sitio"
//         N8N_CHAT_KEY  the same value as the n8n Variable YB_CHAT_KEY (sent as X-Webhook-Secret)
// Without BOTH the widget shows an "almost ready" window with no message box, and
// this route answers 503.

const SCOPE = "chat";
const WINDOW_MS = 10 * 60_000;
// One address: a long, chatty conversation stays well under this.
const ADDRESS_LIMIT = 30;
// All visitors together: the real protection for the OpenAI bill. The n8n flow has
// its own daily cap too.
const TOTAL_LIMIT = 300;

const MAX_BODY_BYTES = 4_000;
const MAX_MESSAGE = 500;
const SESSION_ID = /^[A-Za-z0-9_-]{8,64}$/;
// Only a path of this site, never a full address or anything with a query string.
const PAGE_PATH = /^\/[A-Za-z0-9/_.-]{0,199}$/;

const HEADERS = { "Cache-Control": "no-store" };

function reply(status: number, error: string): Response {
  return Response.json({ error }, { status, headers: HEADERS });
}

export async function POST(req: Request) {
  if (!hasJsonContentType(req)) return reply(415, "Unsupported content type.");
  if (!isSameSiteRequest(req)) return reply(403, "This chat can only be used from this website.");

  const busy = "You are sending messages very quickly. Please wait a moment and try again.";
  if (overAddressLimit(SCOPE, visitorAddress(req), ADDRESS_LIMIT, WINDOW_MS)) return reply(429, busy);
  if (overTotalLimit(SCOPE, TOTAL_LIMIT, WINDOW_MS)) return reply(429, busy);

  const raw = await readBody(req, MAX_BODY_BYTES);
  if (raw === null) return reply(413, "That message is too long.");
  const body = parseJsonObject(raw);
  if (!body) return reply(400, "Invalid request.");

  const message =
    typeof body.message === "string"
      ? body.message.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim()
      : "";
  if (!message) return reply(400, "Please type a message.");
  if (message.length > MAX_MESSAGE) return reply(400, `Please keep your message under ${MAX_MESSAGE} characters.`);

  const sessionId = typeof body.sessionId === "string" && SESSION_ID.test(body.sessionId) ? body.sessionId : "";
  const page = typeof body.page === "string" && PAGE_PATH.test(body.page) ? body.page : "";

  const target = automationTarget(process.env.N8N_CHAT_URL, process.env.N8N_CHAT_KEY);
  if (!target) return reply(503, "The assistant is not available right now.");

  // Only fixed reasons are logged, never what the visitor wrote and never any part
  // of what the chatbot flow sent back.
  const unavailable = () => reply(502, "Sorry, I couldn't answer just now. Please try again in a moment.");

  let res: Response;
  try {
    res = await fetch(target.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Webhook-Secret": target.secret },
      body: JSON.stringify({ question: message, sessionId, page }),
      cache: "no-store",
      // The flow asks OpenAI and Qdrant, so it can take a while.
      signal: AbortSignal.timeout(50_000),
    });
  } catch (error) {
    console.error("[chat] could not reach the chatbot flow:", (error as Error).name);
    return unavailable();
  }
  if (!res.ok) {
    console.error("[chat] the chatbot flow answered with status", res.status);
    return unavailable();
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    console.error("[chat] the chatbot flow did not answer with JSON");
    return unavailable();
  }

  const answer = data && typeof data === "object" ? (data as { answer?: unknown }).answer : undefined;
  const handoff = data && typeof data === "object" ? (data as { escalationNeeded?: unknown }).escalationNeeded === true : false;
  if (typeof answer !== "string" || answer.trim() === "") {
    console.error("[chat] the chatbot flow answered with an unexpected shape");
    return unavailable();
  }

  return Response.json({ answer: answer.trim().slice(0, 1500), handoff }, { headers: HEADERS });
}
