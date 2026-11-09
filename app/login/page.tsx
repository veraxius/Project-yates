import type { Metadata } from "next";
import { canonicalFor } from "../../lib/site-env";
import { Reveal } from "../../components/Reveal";
import { ENROLL_HREF, LOGIN_HREF } from "../../lib/site";

export const metadata: Metadata = {
  alternates: canonicalFor("/login"),
  title: "Log In",
  description: "Sign in to your YB University course.",
};

// Members sign in on LearnWorlds, which owns the accounts, passwords and
// sessions. This site does not store passwords or sessions of its own.
//
// The footer "Log In" link already goes straight to the course page on
// LearnWorlds (COURSE_URL in lib/site.ts). This page is only a fallback that
// uses the same address.
//
// SECURITY NOTE: /learn, /network and /opportunities on this site are public
// marketing pages with no member-only content, so there is nothing to protect
// server-side here. Anything restricted to members (course lessons, member
// documents) must live inside LearnWorlds, not in this app. If members-only
// pages are ever added to this app, they must check a verified session in the
// server (proxy.ts or the route), never just hide the link.
const loginUrl = LOGIN_HREF;

export default function LoginPage() {
  return (
    <>
      <section className="bg-navy-950 py-16 text-white sm:py-20 lg:py-24">
        <div className="container-x">
          <p className="eyebrow !text-sand">STUDENT ACCESS</p>
          <h1 className="h-display mt-5 text-[clamp(2.5rem,8vw,5rem)]">LOG IN</h1>
        </div>
      </section>

      <section className="py-14 sm:py-20 lg:py-24">
        <div className="container-x">
          <Reveal className="mx-auto max-w-xl border border-navy-900/15 bg-ivory p-8 sm:p-12">
            {loginUrl ? (
              <>
                <p className="leading-relaxed text-navy-900/75">
                  Sign in with the email and password you chose when you enrolled. If you are
                  already signed in, you will go straight to your course.
                </p>
                <a
                  href={loginUrl}
                  className="mt-8 inline-flex border border-navy-900 bg-navy-900 px-7 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-navy-700"
                >
                  Go to my course
                </a>
              </>
            ) : (
              <p className="leading-relaxed text-navy-900/75">
                Student sign-in will be available here soon.
              </p>
            )}
            <p className="mt-8 border-t border-navy-900/15 pt-6 text-sm text-navy-900/70">
              Not a member yet?{" "}
              <a href={ENROLL_HREF} className="font-semibold underline underline-offset-4">
                Enroll in YB Learn
              </a>
              . Only people who have enrolled have an account.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
