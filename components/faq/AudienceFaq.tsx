import Link from "next/link";
import { AUDIENCES, FAQS, audienceQuestions, type AudienceKey } from "../../lib/faq";
import { Cta } from "../Cta";
import { Photo } from "../Photo";
import { FaqAccordion } from "./FaqAccordion";

// Five questions for one audience, shown on its landing page.
//
// A landing page is meant to have ONE dominant button, so this block does not
// add a competing one: its button is the page's own main button and leads to
// the same form. The full FAQ is only a quiet text link.
export function AudienceFaq({
  audience,
  cta,
  tone,
}: {
  audience: AudienceKey;
  /** Label of the page's main button. */
  cta: string;
  tone: "white" | "ivory";
}) {
  const config = AUDIENCES[audience];
  const questions = audienceQuestions(audience);
  if (questions.length === 0) return null;

  return (
    <section
      aria-labelledby={`faq-${audience}`}
      className={`py-20 lg:py-28 ${tone === "ivory" ? "bg-ivory" : "bg-white"}`}
    >
      <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <p className="eyebrow">YOUR QUESTIONS, ANSWERED</p>
          <h2 id={`faq-${audience}`} className="h-display mt-5 text-4xl sm:text-5xl">
            {config.title}
          </h2>
          <p className="lead mt-6 text-navy-900/75">{config.subtitle}</p>
          <div className="mt-8 flex flex-col items-start gap-5">
            <Cta href="#join">{cta}</Cta>
            <Link
              href="/faq"
              className="inline-flex min-h-11 items-center text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-navy-900 underline decoration-sand decoration-2 underline-offset-8 hover:text-brass"
            >
              See all {FAQS.length} questions
            </Link>
          </div>
          {/* Fills the space beside the questions on wide screens. Hidden on phones so the
              questions stay right under the button. */}
          <Photo
            src="/luxury-marina-faq-tablet-mockup.png"
            alt="Hands holding a tablet that shows a list of questions and answers, with yachts moored behind"
            objectPosition="50% 50%"
            sizes="(min-width: 1024px) 28rem, 0px"
            className="mt-10 hidden aspect-[4/3] w-full lg:block"
          />
        </div>
        <FaqAccordion items={questions} />
      </div>
    </section>
  );
}
