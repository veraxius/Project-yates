import {
  createOrFindStudent,
  enrollInCourse,
  learnworldsConfigured,
  loginUrl,
  passwordResetUrl,
} from "../../../lib/learnworlds";
import { notify } from "../../../lib/notify";
import { getSession, isDemo } from "../../../lib/payments";
import { clientIp, limited } from "../../../lib/rate-limit";

// Step after payment: the buyer chooses a password, we create their
// LearnWorlds account with it, enroll them, and email a confirmation.
// The password is passed straight to LearnWorlds. It is never stored or logged.

function passwordProblem(p: string): string | null {
  if (p.length < 8) return "Use at least 8 characters.";
  if (p.length > 128) return "That password is too long.";
  if (!/[A-Za-z]/.test(p) || !/\d/.test(p)) return "Include at least one letter and one number.";
  return null;
}

export async function POST(req: Request) {
  if (limited(`activate:${clientIp(req)}`, 8, 10 * 60_000)) {
    return Response.json({ error: "Too many attempts. Please try again in a few minutes." }, { status: 429 });
  }

  let body: { session_id?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const sessionId = typeof body.session_id === "string" ? body.session_id : "";
  const password = typeof body.password === "string" ? body.password : "";

  const problem = passwordProblem(password);
  if (problem) return Response.json({ error: problem }, { status: 400 });

  // Never trust the browser: ask Stripe whether this session was paid.
  const session = await getSession(sessionId);
  if (!session || !session.paid || !session.email) {
    return Response.json({ error: "We couldn't confirm your payment." }, { status: 402 });
  }

  let alreadyHadAccount = false;
  if (learnworldsConfigured()) {
    try {
      const student = await createOrFindStudent({
        email: session.email,
        name: session.name,
        password,
      });
      alreadyHadAccount = student.existed;
      await enrollInCourse(student.id);
    } catch {
      return Response.json(
        { error: "Your payment is confirmed, but we couldn't finish creating your account. Please contact us and we'll sort it out right away." },
        { status: 502 },
      );
    }
  } else if (!isDemo()) {
    return Response.json({ error: "Course access is not configured yet." }, { status: 503 });
  }

  const emailSent = await notify({
    event: "course.activated",
    email: session.email,
    name: session.name,
    loginUrl: loginUrl(),
    passwordResetUrl: passwordResetUrl(),
    alreadyHadAccount,
  });

  return Response.json({ ok: true, loginUrl: loginUrl() || null, alreadyHadAccount, emailSent });
}
