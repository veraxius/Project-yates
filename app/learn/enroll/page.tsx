import type { Metadata } from "next";
import { canonicalFor } from "../../../lib/site-env";
import { Suspense } from "react";
import { CheckoutForm } from "../../../components/CheckoutForm";
import { EnrollFormSection } from "../../../components/EnrollFormSection";
import { Reveal } from "../../../components/Reveal";
import { course, curriculum, included, learn } from "../../../lib/course";

export const metadata: Metadata = {
  alternates: canonicalFor("/learn/enroll"),
  title: "Enroll in YB Learn",
  description:
    "Enroll in The YB Broker Certification Experience: Yacht Brokerage Professional Foundations. 16 modules, practical assignments, competency assessments and one final challenge.",
};

export default function EnrollPage() {
  return (
    <>
      <section className="bg-navy-950 py-16 text-white sm:py-20 lg:py-24">
        <div className="container-x">
          <p className="eyebrow !text-sand">ENROLL IN YB LEARN</p>
          <h1 className="h-display mt-5 max-w-4xl text-[clamp(2.25rem,7vw,4.5rem)]">
            {course.name.toUpperCase()}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/75 sm:text-xl">
            {course.title}. {course.tagline}
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-20">
          {/* Payment card first on phones, on the right on desktop. */}
          <div className="order-first lg:order-last">
            <div id="enroll" className="scroll-mt-24 border border-navy-900/15 bg-ivory p-6 sm:p-8 lg:sticky lg:top-28">
              <p className="eyebrow">SECURE YOUR PLACE</p>
              <h2 className="h-display mt-3 text-3xl sm:text-4xl">Start your journey.</h2>
              <p className="mt-3 text-sm leading-relaxed text-navy-900/70">
                Pay securely, then choose your password and go straight to your course. No
                waiting for an email.
              </p>
              <div className="mt-8">
                <Suspense fallback={<CheckoutForm />}>
                  <EnrollFormSection />
                </Suspense>
              </div>
            </div>
          </div>

          <div className="min-w-0 space-y-16">
            <Reveal>
              <p className="eyebrow">{"WHAT YOU'LL LEARN"}</p>
              <ul className="mt-6 divide-y divide-navy-900/10 border-y border-navy-900/10">
                {learn.map((item, i) => (
                  <li key={item} className="flex gap-5 py-4">
                    <span className="h-display text-2xl leading-none text-sand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <p className="eyebrow">WHAT IS INCLUDED</p>
              <ul className="mt-6 space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex gap-3 text-lg leading-snug text-navy-900/85">
                    <svg aria-hidden width="18" height="18" viewBox="0 0 18 18" className="mt-1 shrink-0 text-sand" fill="none">
                      <path d="M3 9.5l4 4 8-9" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <p className="eyebrow">FOUR PHASES. SIXTEEN MODULES.</p>
              <div className="mt-6 divide-y divide-navy-900/15 border-y border-navy-900/15">
                {curriculum.map((row, i) => (
                  <div key={row.phase} className="grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:gap-6">
                    <div>
                      <h3 className="h-display text-2xl sm:text-3xl">
                        <span className="mr-3 text-sand">{String(i + 1).padStart(2, "0")}</span>
                        {row.phase}
                      </h3>
                      <p className="mt-1 text-navy-900/70">{row.focus}</p>
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-navy-700 sm:pt-2">
                      Modules {row.modules}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <p className="eyebrow">YOUR FINAL CHALLENGE</p>
              <p className="mt-4 text-lg leading-relaxed text-navy-900/80">
                Analyze a yacht. Understand its market. Identify a potential buyer. Develop a
                marketing strategy. Present the vessel. Work through a negotiation scenario.
              </p>
            </Reveal>

            <Reveal>
              <p className="border-t border-navy-900/15 pt-6 text-sm leading-relaxed text-navy-900/60">
                {course.credentialNote}
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
