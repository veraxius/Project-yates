import type { Metadata } from "next";
import Link from "next/link";
import { Cta } from "../../components/Cta";
import { PublicFaq } from "../../components/faq/PublicFaq";
import { Photo } from "../../components/Photo";
import { Reveal } from "../../components/Reveal";
import { FAQ_LINKS } from "../../lib/faq";
import { canonicalFor } from "../../lib/site-env";

export const metadata: Metadata = {
  alternates: canonicalFor("/faq"),
  title: "Questions & Answers",
  description:
    "Clear answers about yacht brokerage education, careers, costs, certificates, and YB University experiences.",
};

const next = [
  {
    label: "FIND YOUR FIT",
    title: "Not sure where you belong?",
    text: "Discover how your interests and skills connect with the industry.",
    link: "Find Your Path",
    href: FAQ_LINKS.discover,
  },
  {
    label: "START LEARNING",
    title: "Ready to explore the course?",
    text: "See the proposed 16-module Yacht Brokerage Professional Foundations program.",
    link: "Explore the Program",
    href: FAQ_LINKS.program,
  },
  {
    label: "BEYOND THE SCREEN",
    title: "Want to experience yachting?",
    text: "Discover the vision for optional yacht visits and industry experiences.",
    link: "Discover YB Experience",
    href: FAQ_LINKS.experiences,
  },
];

export default function FaqPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ivory">
        {/* The photo has the man on the left and open sky on the right, so on a
            wide screen the text sits over the sky; on a phone it sits below. */}
        <div className="relative aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto">
          <Photo
            src="/golden-horizon-yacht-reflection.png"
            alt="Man in a white linen shirt leaning on a yacht rail at sunset, looking up at faint question marks in the sky"
            objectPosition="22% 40%"
            priority
            quality={90}
            sizes="100vw"
            className="absolute inset-0"
          />
        </div>
        <div aria-hidden className="absolute inset-0 hidden bg-gradient-to-l from-ivory/95 via-ivory/65 to-transparent to-75% lg:block" />

        <div className="container-x relative py-14 sm:py-16 lg:flex lg:min-h-[34rem] lg:items-center lg:py-24">
          <div className="lg:ml-auto lg:w-1/2 lg:pl-10">
            <div className="flex items-center gap-4">
              <p className="eyebrow">YB UNIVERSITY / QUESTIONS &amp; ANSWERS</p>
              <span aria-hidden className="block h-px w-14 bg-sand" />
            </div>
            <h1 className="h-display mt-6 text-[clamp(2.6rem,5.6vw,4.75rem)]">
              BIG QUESTIONS. CLEAR ANSWERS.
            </h1>
            <p className="lead mt-6 max-w-xl text-navy-900/80">
              Curious about yachting? Exploring a new career, creative niche, or business opportunity?
              Start here.
            </p>
          </div>
        </div>
      </section>

      <PublicFaq />

      <section aria-label="Explore YB University" className="bg-ivory py-20 lg:py-28">
        <div className="container-x grid gap-px border border-navy-900/15 bg-navy-900/15 lg:grid-cols-3">
          {next.map((card) => (
            <article key={card.title} className="bg-ivory p-8 sm:p-10">
              <p className="eyebrow">{card.label}</p>
              <h2 className="h-display mt-4 text-3xl">{card.title}</h2>
              <p className="mt-4 leading-relaxed text-navy-900/75">{card.text}</p>
              <Link
                href={card.href}
                className="mt-6 inline-flex min-h-11 items-center text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-navy-900 underline decoration-sand decoration-2 underline-offset-8 hover:text-brass"
              >
                {card.link}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden text-white">
        <Photo
          src="/marina-lounge-collaboration.png"
          alt="Three people talking around a table in a marina lounge, with yachts behind them"
          objectPosition="50% 40%"
          sizes="100vw"
          className="absolute inset-0 -z-10"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-navy-950/80" />
        <div className="container-x py-24 text-center lg:py-32">
          <Reveal className="mx-auto max-w-2xl">
            <h2 className="h-display text-4xl sm:text-5xl lg:text-6xl">STILL CURIOUS? GOOD.</h2>
            <p className="lead mt-6 text-white/80">
              Real questions deserve clear answers. Tell us what you&apos;re looking for.
            </p>
            <div className="mt-10 flex justify-center">
              <Cta href={FAQ_LINKS.contact} variant="light">
                ASK US ANYTHING
              </Cta>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
