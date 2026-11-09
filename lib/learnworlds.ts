// LearnWorlds admin API v2. Server-side only.
//
// NOT YET VERIFIED AGAINST THE CLIENT'S SCHOOL: the endpoint paths and field
// names below follow LearnWorlds' public API v2 as I understand it, but they
// must be checked once the real credentials arrive (see the VERIFY notes).
// Everything LearnWorlds-specific lives in this one file on purpose.
//
// Needs: LEARNWORLDS_SCHOOL_URL (e.g. https://school.learnworlds.com),
//        LEARNWORLDS_CLIENT_ID, LEARNWORLDS_API_TOKEN, LEARNWORLDS_COURSE_ID.

import { SCHOOL_URL } from "./site";

export function learnworldsConfigured(): boolean {
  return Boolean(
    process.env.LEARNWORLDS_SCHOOL_URL &&
      process.env.LEARNWORLDS_CLIENT_ID &&
      process.env.LEARNWORLDS_API_TOKEN &&
      process.env.LEARNWORLDS_COURSE_ID,
  );
}

function schoolUrl(): string {
  return (process.env.LEARNWORLDS_SCHOOL_URL ?? "").replace(/\/$/, "");
}

/** Where the student signs in to take the course. */
export function loginUrl(): string {
  return process.env.LEARNWORLDS_LOGIN_URL || schoolUrl() || SCHOOL_URL;
}

/** LearnWorlds' own "forgot password" page, used for the "change my password" link. */
export function passwordResetUrl(): string {
  return process.env.LEARNWORLDS_RESET_URL ?? loginUrl();
}

async function lw(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${schoolUrl()}/admin/api/v2${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.LEARNWORLDS_API_TOKEN}`,
      "Lw-Client": process.env.LEARNWORLDS_CLIENT_ID as string,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });
}

export type Student = { id: string; existed: boolean };

/**
 * Creates the student with the password they chose, or finds them if the email
 * already has an account. An existing account's password is NEVER changed here.
 */
export async function createOrFindStudent(input: {
  email: string;
  name: string;
  /** Omit it to create the account without a password (the buyer sets one later). */
  password?: string;
}): Promise<Student> {
  // VERIFY: POST /users — field names (email, username, password, firstName, lastName).
  const [firstName, ...rest] = input.name.trim().split(/\s+/);
  const created = await lw("/users", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      username: input.email,
      password: input.password,
      firstName: firstName || undefined,
      lastName: rest.join(" ") || undefined,
    }),
  });

  if (created.ok) {
    const u = (await created.json()) as { id: string };
    return { id: u.id, existed: false };
  }

  // Most likely "email already registered": look the account up instead.
  // VERIFY: the status code used for duplicates, and GET /users/{email}.
  const found = await lw(`/users/${encodeURIComponent(input.email)}`);
  if (found.ok) {
    const u = (await found.json()) as { id: string };
    return { id: u.id, existed: true };
  }
  throw new Error(`LearnWorlds could not create the student (${created.status})`);
}

export async function enrollInCourse(userId: string): Promise<void> {
  // VERIFY: POST /users/{id}/enrollment with { productId, productType }.
  const res = await lw(`/users/${encodeURIComponent(userId)}/enrollment`, {
    method: "POST",
    body: JSON.stringify({
      productId: process.env.LEARNWORLDS_COURSE_ID,
      productType: "course",
    }),
  });
  if (!res.ok) throw new Error(`LearnWorlds could not enroll the student (${res.status})`);
}

/**
 * Asks LearnWorlds for a one-time sign-in link, so a buyer who just paid lands
 * inside the course already signed in. It only opens ONE session: to come back
 * later the student needs a password (see ACTIVATION_MODE in lib/site-env.ts).
 *
 * Returns null on any problem; the caller then falls back to the normal
 * sign-in address. Needs a LearnWorlds plan that includes SSO / API.
 */
export async function ssoLoginUrl(email: string): Promise<string | null> {
  try {
    // VERIFY: Single Sign-on endpoint path and field names (email, redirectUrl, url).
    const res = await lw("/sso", {
      method: "POST",
      body: JSON.stringify({ email, redirectUrl: loginUrl() }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { url?: unknown };
    if (typeof data.url !== "string") return null;

    // Safety: only ever send the buyer to LearnWorlds itself, whatever the
    // response says, so a bad response can never turn into an open redirect.
    const target = new URL(data.url);
    const school = new URL(loginUrl());
    const sameSchool = target.host === school.host;
    const onLearnWorlds = target.hostname.endsWith(".learnworlds.com");
    return target.protocol === "https:" && (sameSchool || onLearnWorlds) ? target.toString() : null;
  } catch {
    return null;
  }
}
