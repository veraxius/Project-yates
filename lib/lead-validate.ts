// Server-side check of a form submission. Server-side only.
//
// The browser is never trusted: every answer is checked here against the form
// definition in lib/lead-forms.ts. Unknown fields are dropped, choices must be
// one of the listed options, and text is trimmed, length-capped and stripped of
// control characters before it goes anywhere.

import { randomUUID } from "node:crypto";
import {
  CONSENT_TEXT,
  leadForms,
  type Field,
  type FormId,
  type LeadFormDef,
  type Segment,
} from "./lead-forms";

type Answer = string | boolean | string[];

/** What is sent to the automation (n8n) and on to the CRM. */
export type Lead = {
  /** Unique per submission, so a retry can be recognized and not stored twice. */
  submission_id: string;
  submitted_at: string;
  source: "ybuniversity.com";
  event: LeadFormDef["event"];
  segment: Segment;
  landing_page: string;
  name: string;
  first_name: string;
  email: string;
  primary_interest: string;
  secondary_interests: string[];
  /** The remaining answers of the form, by field name. */
  answers: Record<string, Answer>;
  consent_status: "granted" | "not_granted";
  consent_text: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  referral_code: string;
};

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
const PHONE = /^[+()\-.\s\d]{7,30}$/;

/** One line of text: no control characters, single spaces, no leading or trailing space. */
function oneLine(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();
}

/** Several lines of text: keeps line breaks, drops every other control character. */
function manyLines(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]+/g, " ")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

type Checked = { ok: true; value: Answer | undefined } | { ok: false; error: string };

function checkField(field: Field, raw: unknown): Checked {
  const missing = (): Checked =>
    field.required
      ? { ok: false, error: `Please fill in "${field.label}".` }
      : { ok: true, value: undefined };

  switch (field.type) {
    case "checkbox":
      return { ok: true, value: raw === true };

    case "checkboxes": {
      const allowed = new Set(field.options.map((o) => o.value));
      const picked = Array.isArray(raw)
        ? [...new Set(raw.filter((v): v is string => typeof v === "string" && allowed.has(v)))]
        : [];
      return { ok: true, value: picked };
    }

    case "select":
    case "radio":
      if (typeof raw === "string" && field.options.some((o) => o.value === raw)) {
        return { ok: true, value: raw };
      }
      return field.required
        ? { ok: false, error: `Please choose an option for "${field.label}".` }
        : { ok: true, value: undefined };

    case "textarea": {
      const text = manyLines(raw);
      if (!text) return missing();
      if (text.length > field.maxLength) {
        return { ok: false, error: `"${field.label}" is too long.` };
      }
      return { ok: true, value: text };
    }

    default: {
      let text = oneLine(raw);
      if (!text) return missing();
      if (text.length > field.maxLength) {
        return { ok: false, error: `"${field.label}" is too long.` };
      }
      if (field.type === "email") {
        text = text.toLowerCase();
        if (!EMAIL.test(text)) return { ok: false, error: "Please enter a valid email address." };
      }
      if (field.type === "tel") {
        const digits = text.replace(/\D/g, "").length;
        if (!PHONE.test(text) || digits < 7) {
          return { ok: false, error: "Please enter a valid phone number, or leave it empty." };
        }
      }
      if (field.type === "url") {
        // People often paste "instagram.com/name" without the https:// part.
        if (!/^https?:\/\//i.test(text)) text = `https://${text}`;
        let url: URL | null = null;
        try {
          url = new URL(text);
        } catch {
          url = null;
        }
        if (!url || !/^https?:$/.test(url.protocol) || !url.hostname.includes(".")) {
          return { ok: false, error: `Please enter a valid link for "${field.label}".` };
        }
        text = url.toString();
      }
      if (field.pattern && !new RegExp(`^(?:${field.pattern})$`).test(text)) {
        return { ok: false, error: `Please check "${field.label}".` };
      }
      return { ok: true, value: text };
    }
  }
}

function record(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseLead(
  formId: FormId,
  input: { values?: unknown; updates?: unknown; tracking?: unknown },
): { ok: true; lead: Lead } | { ok: false; error: string } {
  const def: LeadFormDef = leadForms[formId];
  const values = record(input.values);

  const answers: Record<string, Answer> = {};
  for (const field of def.fields) {
    const checked = checkField(field, values[field.name]);
    if (!checked.ok) return checked;
    if (checked.value !== undefined) answers[field.name] = checked.value;
  }

  const text = (name: string) => (typeof answers[name] === "string" ? (answers[name] as string) : "");

  // Name and email travel at the top level, not inside `answers`.
  const fullName = text("name") || text("first_name");
  const firstName = text("first_name") || fullName.split(" ")[0];
  const email = text("email");
  delete answers.name;
  delete answers.first_name;
  delete answers.email;

  const segment =
    typeof def.segment === "string" ? def.segment : def.segment.map[text(def.segment.fromField)];
  if (!segment) return { ok: false, error: "Please choose what interests you most." };

  const secondary: string[] = [];
  for (const name of def.secondaryFrom ?? []) {
    const value = answers[name];
    if (Array.isArray(value)) secondary.push(...value);
    else if (value === true) secondary.push(name);
  }

  const tracking = record(input.tracking);
  const tracked = (key: string) => oneLine(tracking[key]).slice(0, 150);

  return {
    ok: true,
    lead: {
      submission_id: randomUUID(),
      submitted_at: new Date().toISOString(),
      source: "ybuniversity.com",
      event: def.event,
      segment,
      landing_page: def.landingPage,
      name: fullName,
      first_name: firstName,
      email,
      primary_interest:
        typeof def.primaryInterest === "string"
          ? def.primaryInterest
          : text(def.primaryInterest.fromField),
      secondary_interests: secondary,
      answers,
      consent_status: input.updates === true ? "granted" : "not_granted",
      consent_text: CONSENT_TEXT,
      utm_source: tracked("utm_source"),
      utm_medium: tracked("utm_medium"),
      utm_campaign: tracked("utm_campaign"),
      utm_content: tracked("utm_content"),
      referral_code: tracked("referral_code"),
    },
  };
}
