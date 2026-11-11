"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  CONSENT_TEXT,
  leadForms,
  type Field,
  type FormId,
  type LeadFormDef,
} from "../../lib/lead-forms";

// Draws one of the forms defined in lib/lead-forms.ts and sends it to
// /api/leads, where every answer is checked again on the server.

const control =
  "mt-2 block w-full border border-navy-900/30 bg-white px-4 py-3.5 text-base text-navy-900 placeholder:text-navy-900/40 focus:border-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900";
const caption = "text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-navy-900";
const tick = "mt-0.5 h-5 w-5 shrink-0 accent-navy-900";
const choice = "flex cursor-pointer items-start gap-3 leading-relaxed text-navy-900/85";

// Campaign details of this visit, read from the page address when the form is
// sent. Nothing is stored in the browser.
function campaign(): Record<string, string> {
  const query = new URLSearchParams(window.location.search);
  const found: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
    const value = query.get(key);
    if (value) found[key] = value;
  }
  const referral = query.get("ref") ?? query.get("referral_code");
  if (referral) found.referral_code = referral;
  return found;
}

export function LeadForm({ formId }: { formId: FormId }) {
  const def: LeadFormDef = leadForms[formId];
  const [status, setStatus] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");
  const doneRef = useRef<HTMLDivElement>(null);

  // Move keyboard and screen-reader focus to the confirmation when it appears.
  useEffect(() => {
    if (status === "done") doneRef.current?.focus();
  }, [status]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const values: Record<string, string | boolean | string[]> = {};
    for (const field of def.fields) {
      if (field.type === "checkboxes") values[field.name] = data.getAll(field.name).map(String);
      else if (field.type === "checkbox") values[field.name] = data.get(field.name) === "on";
      else values[field.name] = String(data.get(field.name) ?? "");
    }

    setError("");
    setStatus("busy");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form: formId,
          values,
          updates: data.get("updates") === "on",
          website: String(data.get("website") ?? ""),
          tracking: campaign(),
        }),
      });
      if (res.ok) {
        setStatus("done");
        return;
      }
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "Something went wrong. Please try again.");
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
    }
    setStatus("idle");
  }

  if (status === "done") {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="outline-none">
        <p className="h-display text-3xl sm:text-4xl">{def.success.title}</p>
        <p className="mt-4 leading-relaxed text-navy-900/75">{def.success.text}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {def.fields.map((field) => (
        <FormField key={field.name} field={field} id={`${formId}-${field.name}`} />
      ))}

      {/* Trap for automated form fillers: people never see or reach this field. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${formId}-website`}>Leave this field empty</label>
        <input id={`${formId}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className={`${choice} text-sm`}>
        <input type="checkbox" name="updates" className={tick} />
        <span>{CONSENT_TEXT}</span>
      </label>

      {def.note && <p className="text-xs leading-relaxed text-navy-900/60">{def.note}</p>}

      <div aria-live="polite" className="min-h-5 text-sm text-red-700">
        {error}
      </div>

      <button
        type="submit"
        disabled={status === "busy"}
        className="inline-flex w-full items-center justify-center border border-navy-900 bg-navy-900 px-7 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white transition-colors duration-300 hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "busy" ? "Sending…" : def.submitLabel}
      </button>

      <p className="text-center text-xs leading-relaxed text-navy-900/60">
        We use your details to respond to this request. See our{" "}
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}

function FormField({ field, id }: { field: Field; id: string }) {
  const hintId = field.hint ? `${id}-hint` : undefined;
  const hint = field.hint && (
    <p id={hintId} className="mt-2 text-sm text-navy-900/60">
      {field.hint}
    </p>
  );

  switch (field.type) {
    case "checkbox":
      return (
        <label className={choice}>
          <input type="checkbox" name={field.name} className={tick} />
          <span>{field.label}</span>
        </label>
      );

    case "radio":
    case "checkboxes":
      return (
        <fieldset>
          <legend className={caption}>{field.label}</legend>
          <div className="mt-3 space-y-3">
            {field.options.map((option) => (
              <label key={option.value} className={choice}>
                <input
                  type={field.type === "radio" ? "radio" : "checkbox"}
                  name={field.name}
                  value={option.value}
                  required={field.type === "radio" && field.required}
                  className={tick}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      );

    case "select":
      return (
        <div>
          <label htmlFor={id} className={caption}>
            {field.label}
          </label>
          <select
            id={id}
            name={field.name}
            required={field.required}
            defaultValue=""
            aria-describedby={hintId}
            className={control}
          >
            <option value="" disabled>
              Choose one
            </option>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {hint}
        </div>
      );

    case "textarea":
      return (
        <div>
          <label htmlFor={id} className={caption}>
            {field.label}
          </label>
          <textarea
            id={id}
            name={field.name}
            rows={4}
            required={field.required}
            maxLength={field.maxLength}
            aria-describedby={hintId}
            className={control}
          />
          {hint}
        </div>
      );

    default:
      return (
        <div>
          <label htmlFor={id} className={caption}>
            {field.label}
          </label>
          <input
            id={id}
            name={field.name}
            type={field.type}
            required={field.required}
            maxLength={field.maxLength}
            autoComplete={field.autoComplete}
            placeholder={field.placeholder}
            inputMode={field.inputMode}
            pattern={field.pattern}
            title={field.pattern ? field.hint : undefined}
            aria-describedby={hintId}
            className={control}
          />
          {hint}
        </div>
      );
  }
}
