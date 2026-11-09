import {
  createOrFindStudent,
  enrollInCourse,
  learnworldsConfigured,
  loginUrl,
  passwordResetUrl,
  ssoLoginUrl,
} from "../../../lib/learnworlds";
import { notify } from "../../../lib/notify";
import { getSession, isDemo } from "../../../lib/payments";
import { clientIp, isJsonRequest, limited } from "../../../lib/rate-limit";
import { activationMode } from "../../../lib/site-env";

// Step after payment. What happens depends on ACTIVATION_MODE (lib/site-env.ts):
//
//  "email"    (default) No password is asked for. We create the LearnWorlds
//             account without one, enroll the buyer, and give them a link that
//             opens the course already signed in. They are told to create a
//             password (reset link) so they can sign in again later.
//  "password" The buyer chose a password on our page; we pass it straight to
//             LearnWorlds. It is never stored or logged.
//
// In both modes the payment is confirmed with Stripe first, never trusted from
// the browser, and a confirmation is requested from n8n (no password inside).

// A "signed-in" link is only handed out right after paying. Later visits to the
// same page (a bookmark, a forwarded link) get the normal sign-in address.
const DIRECT_LOGIN_WINDOW_SECONDS = 30 * 60;

function passwordProblem(p: string): string | null {
  if (p.length < 8) return "Use at least 8 characters.";
  if (p.length > 128) return "That password is too long.";
  if (!/[A-Za-z]/.test(p) || !/\d/.test(p)) return "Include at least one letter and one number.";
  return null;
}

export async function POST(req: Request) {
  if (!isJsonRequest(req)) {
    return Response.json({ error: "Unsupported content type." }, { status: 415 });
  }
  if (limited(`activate:${clientIp(req)}`, 8, 10 * 60_000)) {
    return Response.json({ error: "Too many attempts. Please try again in a few minutes." }, { status: 429 });
  }

  let body: { session_id?: unknown; password?: unknown; name?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const sessionId = typeof body.session_id === "string" ? body.session_id : "";
  const mode = activationMode();

  let password: string | undefined;
  let chosenName = "";
  if (mode === "password") {
    chosenName = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
    if (chosenName.length < 2 || chosenName.length > 80) {
      return Response.json({ error: "Please enter your name (2 to 80 characters)." }, { status: 400 });
    }
    password = typeof body.password === "string" ? body.password : "";
    const problem = passwordProblem(password);
    if (problem) return Response.json({ error: problem }, { status: 400 });
  }

  // Never trust the browser: ask Stripe whether this session was paid.
  const session = await getSession(sessionId);
  if (!session || !session.paid || !session.email) {
    return Response.json({ error: "We couldn't confirm your payment." }, { status: 402 });
  }

  let alreadyHadAccount = false;
  let directLoginUrl: string | null = null;

  if (learnworldsConfigured()) {
    try {
      const student = await createOrFindStudent({
        email: session.email,
        name: chosenName || session.name,
        password,
      });
      alreadyHadAccount = student.existed;
      await enrollInCourse(student.id);

      // Signed-in link: only for a brand-new account, and only right after the
      // payment. For an existing account it could let anyone holding this page
      // address sign in as that person, so those buyers use the normal sign-in.
      const fresh = Date.now() / 1000 - session.created < DIRECT_LOGIN_WINDOW_SECONDS;
      if (mode === "email" && !student.existed && fresh) {
        directLoginUrl = await ssoLoginUrl(session.email);
      }
    } catch {
      return Response.json(
        { error: "Your payment is confirmed, but we couldn't finish setting up your account. Please contact us and we'll sort it out right away." },
        { status: 502 },
      );
    }
  } else if (!isDemo()) {
    return Response.json({ error: "Course access is not configured yet." }, { status: 503 });
  }

  // A brand-new account made without a password has none until the buyer creates one.
  const needsPassword = mode === "email" && !alreadyHadAccount;

  const emailSent = await notify({
    event: "course.activated",
    email: session.email,
    name: chosenName || session.name,
    loginUrl: loginUrl(),
    passwordResetUrl: passwordResetUrl(),
    alreadyHadAccount,
    needsPassword,
  });

  return Response.json({
    ok: true,
    mode,
    loginUrl: directLoginUrl ?? loginUrl(),
    directLogin: Boolean(directLoginUrl),
    passwordResetUrl: passwordResetUrl(),
    needsPassword,
    alreadyHadAccount,
    emailSent,
  });
}
