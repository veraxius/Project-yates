"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Status =
  | { kind: "loading" }
  | { kind: "invalid" }
  | { kind: "ready"; email: string }
  | { kind: "done"; loginUrl: string | null; existing: boolean; emailSent: boolean };

const field =
  "block w-full border border-navy-900/30 bg-white px-4 py-3.5 text-base text-navy-900 focus:border-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900";
const label = "text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-navy-900";

function passwordProblem(p: string): string {
  if (p.length < 8) return "Use at least 8 characters.";
  if (!/[A-Za-z]/.test(p) || !/\d/.test(p)) return "Include at least one letter and one number.";
  return "";
}

export function WelcomeFlow() {
  const sessionId = useSearchParams().get("session_id") ?? "";
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Ask the server (which asks Stripe) whether this payment really went through.
  useEffect(() => {
    if (!sessionId) return; // handled at render time below
    let cancelled = false;
    fetch(`/api/checkout/status?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((d: { paid?: boolean; email?: string }) => {
        if (cancelled) return;
        setStatus(d.paid && d.email ? { kind: "ready", email: d.email } : { kind: "invalid" });
      })
      .catch(() => !cancelled && setStatus({ kind: "invalid" }));
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const problem = passwordProblem(password);
    if (problem) return setError(problem);
    if (password !== confirm) return setError("The two passwords don't match.");

    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, password }),
      });
      const d = (await res.json()) as {
        error?: string;
        loginUrl?: string | null;
        alreadyHadAccount?: boolean;
        emailSent?: boolean;
      };
      if (!res.ok) {
        setError(d.error ?? "Something went wrong. Please try again.");
        setBusy(false);
        return;
      }
      setPassword("");
      setConfirm("");
      setStatus({
        kind: "done",
        loginUrl: d.loginUrl ?? null,
        existing: Boolean(d.alreadyHadAccount),
        emailSent: Boolean(d.emailSent),
      });
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
      setBusy(false);
    }
  }

  // Without a session_id there is nothing to confirm.
  const view: Status = sessionId ? status : { kind: "invalid" };

  if (view.kind === "loading") {
    return (
      <p role="status" className="text-navy-900/70">
        Confirming your payment…
      </p>
    );
  }

  if (view.kind === "invalid") {
    return (
      <div>
        <p className="eyebrow">WE COULDN&apos;T CONFIRM YOUR PAYMENT</p>
        <h1 className="h-display mt-4 text-3xl sm:text-4xl">This link isn&apos;t valid.</h1>
        <p className="mt-4 leading-relaxed text-navy-900/75">
          If you completed a payment, check your email for the confirmation and use the link
          inside it. Otherwise you can start again from the enrollment page. If you were charged
          and need help, contact us and we will sort it out.
        </p>
        <Link
          href="/learn/enroll"
          className="mt-8 inline-flex border border-navy-900 bg-navy-900 px-7 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white hover:bg-navy-700"
        >
          Back to enrollment
        </Link>
      </div>
    );
  }

  if (view.kind === "done") {
    return (
      <div role="status">
        <p className="eyebrow">PAYMENT CONFIRMED</p>
        <h1 className="h-display mt-4 text-4xl sm:text-5xl">Welcome to YB University.</h1>
        {view.existing ? (
          <p className="mt-5 leading-relaxed text-navy-900/75">
            You already had an account with this email, so we added the course to it and kept
            your current password. If you have forgotten it, use the password link in your
            confirmation email.
          </p>
        ) : (
          <p className="mt-5 leading-relaxed text-navy-900/75">
            Your account is ready and the course is unlocked. Sign in with your email and the
            password you just chose.
          </p>
        )}
        {view.emailSent && (
          <p className="mt-3 leading-relaxed text-navy-900/75">
            We have also sent you a confirmation email. It includes a link in case you ever want
            to change your password.
          </p>
        )}
        {view.loginUrl && (
          <a
            href={view.loginUrl}
            className="mt-8 inline-flex border border-navy-900 bg-navy-900 px-7 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white hover:bg-navy-700"
          >
            Go to my course
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <p className="eyebrow">PAYMENT CONFIRMED</p>
      <h1 className="h-display mt-4 text-4xl sm:text-5xl">One last step.</h1>
      <p className="mt-4 leading-relaxed text-navy-900/75">
        Choose the password you will use to sign in to your course. Your account email is{" "}
        <strong className="break-all font-semibold text-navy-900">{view.email}</strong>.
      </p>

      <div className="mt-8 space-y-6">
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
        disabled={busy || !password || !confirm}
        className="mt-4 inline-flex w-full items-center justify-center border border-navy-900 bg-navy-900 px-7 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white transition-colors duration-300 hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {busy ? "Creating your account…" : "Create my account"}
      </button>
    </form>
  );
}
