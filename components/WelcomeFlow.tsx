"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// The screen a buyer sees right after paying (/welcome?session_id=...).
//
// Two modes, chosen on the server (ACTIVATION_MODE, see lib/site-env.ts):
//  - "password" (default): they choose their name and password here, after
//    paying. Only paying members ever get an account.
//  - "email" (fallback, if LearnWorlds won't accept a password on creation):
//    nothing to type; they enter the course and create a password with a link.

type Done = {
  email: string;
  mode: "email" | "password";
  loginUrl: string | null;
  directLogin: boolean;
  passwordResetUrl: string | null;
  needsPassword: boolean;
  existing: boolean;
  emailSent: boolean;
};

type View =
  | { kind: "loading"; text: string }
  | { kind: "invalid" }
  | { kind: "ready"; email: string } // password mode: show the form
  | { kind: "failed"; email: string; message: string }
  | { kind: "done"; data: Done };

type ActivateResult = { ok: true; data: Omit<Done, "email"> } | { ok: false; message: string };

async function callActivate(
  sessionId: string,
  choice?: { name: string; password: string },
): Promise<ActivateResult> {
  try {
    const res = await fetch("/api/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, ...choice }),
    });
    const d = (await res.json()) as {
      error?: string;
      mode?: "email" | "password";
      loginUrl?: string | null;
      directLogin?: boolean;
      passwordResetUrl?: string | null;
      needsPassword?: boolean;
      alreadyHadAccount?: boolean;
      emailSent?: boolean;
    };
    if (!res.ok) return { ok: false, message: d.error ?? "Something went wrong. Please try again." };
    return {
      ok: true,
      data: {
        mode: d.mode ?? "email",
        loginUrl: d.loginUrl ?? null,
        directLogin: Boolean(d.directLogin),
        passwordResetUrl: d.passwordResetUrl ?? null,
        needsPassword: Boolean(d.needsPassword),
        existing: Boolean(d.alreadyHadAccount),
        emailSent: Boolean(d.emailSent),
      },
    };
  } catch {
    return { ok: false, message: "We couldn't reach the server. Check your connection and try again." };
  }
}

const field =
  "block w-full border border-navy-900/30 bg-white px-4 py-3.5 text-base text-navy-900 focus:border-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900";
const label = "text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-navy-900";
const primaryBtn =
  "inline-flex w-full items-center justify-center border border-navy-900 bg-navy-900 px-7 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white transition-colors duration-300 hover:bg-navy-700 sm:w-auto";

function passwordProblem(p: string): string {
  if (p.length < 8) return "Use at least 8 characters.";
  if (!/[A-Za-z]/.test(p) || !/\d/.test(p)) return "Include at least one letter and one number.";
  return "";
}

export function WelcomeFlow() {
  const sessionId = useSearchParams().get("session_id") ?? "";
  const [view, setView] = useState<View>({ kind: "loading", text: "Confirming your payment…" });
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // The set-up must run once per visit (React runs effects twice in development).
  const started = useRef(false);

  useEffect(() => {
    if (!sessionId || started.current) return;
    started.current = true;

    // Ask the server (which asks Stripe) whether this payment really went through.
    fetch(`/api/checkout/status?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then(async (d: { paid?: boolean; email?: string; name?: string; mode?: "email" | "password" }) => {
        if (!d.paid || !d.email) return setView({ kind: "invalid" });
        const email = d.email;
        if (d.mode === "password") {
          setName(d.name ?? ""); // pre-fill with the name given at checkout; they can change it
          return setView({ kind: "ready", email });
        }

        // Default mode: nothing to type, set the account up right away.
        setView({ kind: "loading", text: "Payment confirmed. Setting up your course…" });
        const result = await callActivate(sessionId);
        setView(
          result.ok
            ? { kind: "done", data: { email, ...result.data } }
            : { kind: "failed", email, message: result.message },
        );
      })
      .catch(() => setView({ kind: "invalid" }));
  }, [sessionId]);

  async function retry(email: string) {
    setView({ kind: "loading", text: "Setting up your course…" });
    const result = await callActivate(sessionId);
    setView(
      result.ok
        ? { kind: "done", data: { email, ...result.data } }
        : { kind: "failed", email, message: result.message },
    );
  }

  async function onSubmitPassword(e: React.FormEvent, email: string) {
    e.preventDefault();
    const cleanName = name.trim().replace(/\s+/g, " ");
    if (cleanName.length < 2) return setError("Please enter your name.");
    const problem = passwordProblem(password);
    if (problem) return setError(problem);
    if (password !== confirm) return setError("The two passwords don't match.");

    setError("");
    setBusy(true);
    const result = await callActivate(sessionId, { name: cleanName, password });
    if (!result.ok) {
      setError(result.message);
      setBusy(false);
      return;
    }
    setPassword("");
    setConfirm("");
    setView({ kind: "done", data: { email, ...result.data } });
    setBusy(false);
  }

  // Without a session_id there is nothing to confirm.
  const current: View = sessionId ? view : { kind: "invalid" };

  if (current.kind === "loading") {
    return (
      <p role="status" className="text-navy-900/70">
        {current.text}
      </p>
    );
  }

  if (current.kind === "invalid") {
    return (
      <div>
        <p className="eyebrow">WE COULDN&apos;T CONFIRM YOUR PAYMENT</p>
        <h1 className="h-display mt-4 text-3xl sm:text-4xl">This link isn&apos;t valid.</h1>
        <p className="mt-4 leading-relaxed text-navy-900/75">
          If you completed a payment, check your email for the confirmation and use the link
          inside it. Otherwise you can start again from the enrollment page. If you were charged
          and need help, contact us and we will sort it out.
        </p>
        <Link href="/learn/enroll" className={`${primaryBtn} mt-8`}>
          Back to enrollment
        </Link>
      </div>
    );
  }

  if (current.kind === "failed") {
    return (
      <div role="alert">
        <p className="eyebrow">PAYMENT CONFIRMED</p>
        <h1 className="h-display mt-4 text-3xl sm:text-4xl">We&apos;re almost there.</h1>
        <p className="mt-4 leading-relaxed text-navy-900/75">{current.message}</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button type="button" onClick={() => retry(current.email)} className={primaryBtn}>
            Try again
          </button>
          <Link
            href="/contact"
            className="inline-flex w-full items-center justify-center border border-navy-900/40 px-7 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-navy-900 hover:border-navy-900 sm:w-auto"
          >
            Contact us
          </Link>
        </div>
      </div>
    );
  }

  if (current.kind === "done") {
    const d = current.data;

    // Password mode: they just chose one, so they can simply sign in.
    if (d.mode === "password") {
      return (
        <div role="status">
          <p className="eyebrow">PAYMENT CONFIRMED</p>
          <h1 className="h-display mt-4 text-4xl sm:text-5xl">Welcome to YB University.</h1>
          <p className="mt-5 leading-relaxed text-navy-900/75">
            {d.existing
              ? "You already had an account with this email, so we added the course to it and kept your current password. If you have forgotten it, use the password link in your confirmation email."
              : "Your account is ready and the course is unlocked. Sign in with your email and the password you just chose."}
          </p>
          {d.emailSent && (
            <p className="mt-3 leading-relaxed text-navy-900/75">
              We have also sent you a confirmation email. It includes a link in case you ever
              want to change your password.
            </p>
          )}
          {d.loginUrl && (
            <a href={d.loginUrl} className={`${primaryBtn} mt-8`}>
              Go to my course
            </a>
          )}
        </div>
      );
    }

    // Default mode.
    return (
      <div role="status">
        <p className="eyebrow">PAYMENT CONFIRMED</p>
        <h1 className="h-display mt-4 text-4xl sm:text-5xl">Welcome to YB University.</h1>
        <p className="mt-5 leading-relaxed text-navy-900/75">
          {d.existing
            ? "We found your account and added the course to it. Sign in with the password you already use."
            : "Your course is unlocked. Two quick steps:"}
        </p>

        <ol className="mt-8 space-y-6">
          <li className="flex gap-4">
            <span className="h-display text-3xl leading-none text-sand">01</span>
            <div className="min-w-0">
              <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.2em]">
                Go to your course
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-navy-900/70">
                {d.directLogin
                  ? "You will be signed in automatically. This is a one-time link."
                  : d.existing
                    ? "Sign in with your email and your usual password."
                    : "Open your course page. You will be able to sign in once you create your password (step 2)."}
              </p>
              {d.loginUrl && (
                <a href={d.loginUrl} className={`${primaryBtn} mt-4`}>
                  Go to my course
                </a>
              )}
            </div>
          </li>

          {d.needsPassword && (
            <li className="flex gap-4">
              <span className="h-display text-3xl leading-none text-sand">02</span>
              <div className="min-w-0 flex-1 border-2 border-sand bg-ivory p-5">
                <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.2em]">
                  Create your password
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-navy-900/80">
                  <strong className="font-semibold">Don&apos;t skip this.</strong>{" "}
                  {d.directLogin
                    ? "You need a password to sign in again later. The link above only works once."
                    : "You need a password to sign in to your course."}
                </p>
                {d.emailSent && (
                  <p className="mt-2 text-sm leading-relaxed text-navy-900/80">
                    We emailed <strong className="break-all font-semibold">{current.data.email}</strong>{" "}
                    with a link to create it. Check your spam folder if you don&apos;t see it.
                  </p>
                )}
                {d.passwordResetUrl && (
                  <>
                    <a
                      href={d.passwordResetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${primaryBtn} mt-4`}
                    >
                      Create my password
                    </a>
                    <p className="mt-3 text-xs leading-relaxed text-navy-900/60">
                      On the school page choose &ldquo;Forgot password&rdquo;, enter{" "}
                      <span className="break-all">{current.data.email}</span> and follow the
                      email you receive.
                    </p>
                  </>
                )}
              </div>
            </li>
          )}
        </ol>
      </div>
    );
  }

  // Password mode, before they have chosen one.
  return (
    <form onSubmit={(e) => onSubmitPassword(e, current.email)} noValidate>
      <p className="eyebrow">PAYMENT CONFIRMED</p>
      <h1 className="h-display mt-4 text-4xl sm:text-5xl">One last step.</h1>
      <p className="mt-4 leading-relaxed text-navy-900/75">
        Choose your name and the password you will use to sign in to your course. Your account
        email is{" "}
        <strong className="break-all font-semibold text-navy-900">{current.email}</strong>.
      </p>

      <div className="mt-8 space-y-6">
        <div>
          <label htmlFor="name" className={label}>
            Your name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${field} mt-2`}
          />
        </div>

        <div>
          <label htmlFor="password" className={label}>
            Password
          </label>
          <div className="relative mt-2">
            <input
              id="password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby="pw-hint"
              className={`${field} pr-20`}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-pressed={show}
              className="absolute inset-y-0 right-0 flex min-w-16 items-center justify-center px-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-navy-900/70 hover:text-navy-900"
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
          <p id="pw-hint" className="mt-2 text-sm text-navy-900/60">
            At least 8 characters, with a letter and a number.
          </p>
        </div>

        <div>
          <label htmlFor="confirm" className={label}>
            Confirm password
          </label>
          <input
            id="confirm"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={`${field} mt-2`}
          />
        </div>
      </div>

      <div aria-live="polite" className="mt-4 min-h-5 text-sm text-red-700">
        {error}
      </div>

      <button
        type="submit"
        disabled={busy || !name.trim() || !password || !confirm}
        className={`${primaryBtn} mt-4 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {busy ? "Creating your account…" : "Create my account"}
      </button>
    </form>
  );
}
