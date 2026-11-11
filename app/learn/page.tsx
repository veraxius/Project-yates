import type { Metadata } from "next";
import Link from "next/link";
import { canonicalFor } from "../../lib/site-env";
import { Cta } from "../../components/Cta";
import { PageHero } from "../../components/PageHero";
import { Photo } from "../../components/Photo";
import { Reveal } from "../../components/Reveal";
import { curriculum, learn } from "../../lib/course";
import { ENROLL_HREF } from "../../lib/site";

export const metadata: Metadata = {
  alternates: canonicalFor("/learn"),
  title: "YB Learn",
  description:
    "The YB Broker Certification Experience: Yacht Brokerage Professional Foundations. 16 modules, practical assignments, competency assessments and one final challenge.",
};

export default function LearnPage() {
  return (
    <>
      <PageHero
        label="THE FLAGSHIP EDUCATION PRODUCT"
        name="YB LEARN"
        title="LEARN THE BUSINESS. BUILD THE SKILLS."
        variant={1}
        src="/superyacht-bridge.png"
        alt="Helm station of a luxury yacht with navigation and engine monitoring screens"
        objectPosition="60% 50%"
      >
        <p className="text-xl text-white/90">The YB Broker Certification Experience</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Cta href={ENROLL_HREF} variant="light">ENROLL NOW</Cta>
          <Cta href="#curriculum" variant="outline-light">EXPLORE THE 16 MODULES</Cta>
        </div>
      </PageHero>

      <section className="py-24 lg:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <Reveal>
            <div className="rule" />
            <h2 className="h-display mt-8 text-4xl sm:text-5xl lg:text-6xl">
              Yacht Brokerage Professional Foundations
            </h2>
            <p className="lead mt-8 text-navy-900/75">
              {"Yacht brokerage is more than knowing boats. It's understanding people, vessels, markets, marketing, negotiation, and transactions."}
            </p>
            <p className="lead mt-5 text-navy-900/75">
              This experience introduces you to the professional foundations of the business and challenges you to apply what you learn.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h3 className="eyebrow">{"WHAT YOU'LL LEARN"}</h3>
            <ul className="mt-6 divide-y divide-navy-900/10 border-y border-navy-900/10">
              {learn.map((item, i) => (
                <li key={item} className="flex gap-5 py-5">
                  <span className="h-display text-2xl leading-none text-sand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-navy-950 py-24 text-white lg:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <p className="eyebrow !text-sand">HOW IT WORKS</p>
            <h2 className="h-display mt-6 text-4xl sm:text-5xl">
              16 modules. Practical assignments. Competency assessments. One final challenge.
            </h2>
            <p className="lead mt-8 text-white/70">
              Each module combines focused lessons, real-world examples, and practical applications.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow !text-sand">YOUR FINAL CHALLENGE</p>
            <p className="h-display mt-6 text-3xl text-sky sm:text-4xl">Bring your learning together.</p>
            <p className="lead mt-6 text-white/80">
              Analyze a yacht. Understand its market. Identify a potential buyer. Develop a marketing strategy. Present the vessel. Work through a negotiation scenario.
            </p>
            <p className="lead mt-4 text-white/70">
              Demonstrate your understanding of the brokerage process from opportunity to transaction.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="container-x">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">YOUR CREDENTIAL</p>
            <p className="h-display mt-6 text-3xl sm:text-4xl">
              Participants who successfully complete the program and meet its assessment requirements receive the YB University credential in{" "}
              <span className="text-navy-700">Yacht Brokerage Professional Foundations.</span>
            </p>
            <p className="mt-8 text-sm leading-relaxed text-navy-900/60">
              This is a YB University-issued educational credential. It is not a government-issued brokerage license or a substitute for any licensing requirements that may apply.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="curriculum" className="bg-ivory py-24 lg:py-32">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">CURRICULUM PREVIEW</p>
            <h2 className="h-display mt-5 text-4xl sm:text-5xl lg:text-6xl">Four phases. Sixteen modules.</h2>
          </Reveal>
          <Reveal className="mt-12">
            <div className="hidden grid-cols-[1.2fr_0.5fr_2fr_11rem] gap-6 border-b border-navy-900/30 pb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-navy-900/60 md:grid">
              <span>Phase</span>
              <span>Modules</span>
              <span>Focus</span>
            </div>
            {curriculum.map((row, i) => (
              <div
                key={row.phase}
                className="grid gap-2 border-b border-navy-900/15 py-8 md:grid-cols-[1.2fr_0.5fr_2fr_11rem] md:items-center md:gap-6"
              >
                <h3 className="h-display text-3xl">
                  <span className="mr-3 text-sand">{String(i + 1).padStart(2, "0")}</span>
                  {row.phase}
                </h3>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-navy-700">
                  <span className="md:hidden">Modules </span>
                  {row.modules}
                </p>
                <p className="text-lg text-navy-900/75">{row.focus}</p>
                <Photo
                  src={row.src}
                  alt={row.alt}
                  objectPosition={row.pos}
                  sizes="(min-width: 768px) 11rem, 100vw"
                  className="mt-4 aspect-[16/10] w-full md:mt-0"
                />
              </div>
            ))}
          </Reveal>
          <Reveal className="mt-14 flex flex-col gap-4 sm:flex-row">
            <Cta href="#curriculum" variant="outline">VIEW THE FULL CURRICULUM</Cta>
            <Cta href={ENROLL_HREF}>ENROLL NOW</Cta>
          </Reveal>
        </div>
      </section>

      <section id="certification" className="py-24 lg:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <Reveal>
            <Photo
              src="/yb-smart-certification-digital-credential.png"
              alt="YB University Certificate of Completion on a laptop and the digital certificate on a phone, resting on a yacht deck"
              quality={90}
              sizes="(min-width: 1024px) 40rem, 100vw"
              className="aspect-[3/2] w-full"
            />
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">YB UNIVERSITY SMART CERTIFICATION</p>
            <h2 className="h-display mt-5 text-4xl sm:text-5xl lg:text-6xl">
              Finish the course. Carry the proof.
            </h2>
            <p className="lead mt-8 text-navy-900/75">
              Students who complete and pass Yacht Brokerage Professional Foundations receive a digital certificate of completion: a formal record that they finished and passed the course.
            </p>
            <p className="lead mt-5 text-navy-900/75">
              It can be verified online, shared, and added to a LinkedIn profile. It also connects you to the Palm Beach Yachts ecosystem, which includes YB University and the Peanut Island Boat Club.
            </p>
            <p className="mt-8 border-t border-navy-900/15 pt-6 text-sm leading-relaxed text-navy-900/60">
              The certificate is an educational credential issued by YB University.{" "}
              <Link href="/credential-disclaimer" className="underline underline-offset-4 hover:text-navy-900">
                Read what it is and what it is not.
              </Link>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
