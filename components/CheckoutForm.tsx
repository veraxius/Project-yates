"use client";

import { useState } from "react";
import { course } from "../lib/course";

const field =
  "mt-2 block w-full border border-navy-900/30 bg-white px-4 py-3.5 text-base text-navy-900 placeholder:text-navy-900/40 focus:border-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900";

export function CheckoutForm({ canceled = false }: { canceled?: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, acceptTerms: accepted }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setBusy(false);
        return;
      }
      window.location.assign(data.url); // Stripe's hosted payment page
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {canceled && (
        <p role="status" className="border border-navy-900/20 bg-ivory px-4 py-3 text-sm text-navy-900/80">
          Your payment was cancelled and you have not been charged. You can try again whenever you are ready.
        </p>
      )}

      <div>
        <label htmlFor="name" className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-navy-900">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={field}
        />
      </div>

      <div>
        <label htmlFor="email" className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-navy-900">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={field}
        />
        <p className="mt-2 text-sm text-navy-900/60">
          Use the email where you want to receive your course access.
        </p>
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-navy-900/80">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 accent-navy-900"
        />
        <span>
          I agree to the{" "}
          <a href="#" className="underline underline-offset-4">Terms &amp; Conditions</a> and the{" "}
          <a href="#" className="underline underline-offset-4">Privacy Policy</a>, and I understand
          this is an educational credential, not a brokerage license.
        </span>
      </label>

      <div aria-live="polite" className="min-h-5 text-sm text-red-700">
        {error}
      </div>

      <button
        type="submit"
        disabled={busy || !accepted || !name.trim() || !email.trim()}
        className="inline-flex w-full items-center justify-center gap-3 border border-navy-900 bg-navy-900 px-7 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white transition-colors duration-300 hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Redirecting to secure payment…" : "Continue to secure payment"}
      </button>

      <p className="text-center text-xs leading-relaxed text-navy-900/60">
        {course.priceLabel ? `${course.priceLabel}. ` : ""}Payments are processed securely by Stripe.
        We never see or store your card details.
      </p>
    </form>
  );
}
