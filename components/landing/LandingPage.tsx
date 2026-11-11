import type { Landing, LandingSection } from "../../lib/landings";
import { Cta } from "../Cta";
import { AudienceFaq } from "../faq/AudienceFaq";
import { Photo } from "../Photo";
import { LandingShell } from "./LandingShell";
import { LeadForm } from "./LeadForm";
import { ProgramFacts } from "./ProgramFacts";

// One campaign landing page, drawn from its entry in lib/landings.ts.
//
// Order on every page: hero (headline, one main button), the numbered sections
// of the client's document, five questions for this audience, and the closing
// section next to the form. Every copy of the main button leads to that form
// (#join). No carousels, no
// testimonials and no entrance animations, as the document asks.

const accents = {
  sky: { text: "!text-sky", bar: "bg-sky" },
  sand: { text: "!text-sand", bar: "bg-sand" },
} as const;

type Tone = "white" | "ivory" | "navy";

const num = (i: number) => String(i + 1).padStart(2, "0");

// Light sections alternate white and ivory; the offer is a navy band.
function sectionTones(sections: LandingSection[]): Tone[] {
  const tones: Tone[] = [];
  let light = 0;
  for (const s of sections) {
    tones.push(s.cta ? "navy" : light++ % 2 === 0 ? "white" : "ivory");
  }
  return tones;
}

export function LandingPage({ page }: { page: Landing }) {
  const accent = accents[page.accent];
  const tones = sectionTones(page.sections);
  // The questions and the form each take whichever light tone the block above
  // them did not use, so the page keeps alternating white and ivory.
  const faqTone: "white" | "ivory" = tones[tones.length - 1] === "white" ? "ivory" : "white";
  const joinOnWhite = faqTone === "ivory";

  return (
    <LandingShell cta={page.primaryCta} shortCta={page.shortCta}>
      <section className="bg-navy-950 text-white">
        <div className="grid lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-16 sm:py-20 lg:py-24 lg:pl-[max(3rem,calc((100vw-80rem)/2+3rem))] lg:pr-16">
            <div className="flex items-center gap-4">
              <p className={`eyebrow ${accent.text}`}>{page.audience}</p>
              <span aria-hidden className={`block h-px w-14 ${accent.bar}`} />
            </div>
            <h1 className="h-display mt-6 text-[clamp(2.5rem,4.6vw,4.25rem)]">{page.hero.headline}</h1>
            <p className="h-display mt-5 text-2xl text-white/90 sm:text-3xl">{page.hero.subhead}</p>
            <div className="mt-8 max-w-xl space-y-4 leading-relaxed text-white/75">
              {page.hero.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p className="font-medium text-white">{page.hero.closing}</p>
            </div>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Cta href="#join" variant="light">
                {page.heroCta ?? page.primaryCta}
              </Cta>
              <Cta href={page.secondaryCta.href} variant="outline-light">
                {page.secondaryCta.label}
              </Cta>
            </div>
          </div>
          <Photo
            src={page.hero.image.src}
            alt={page.hero.image.alt}
            objectPosition={page.hero.image.pos}
            priority
            quality={90}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-[4/3] w-full lg:aspect-auto lg:h-full"
          />
        </div>
      </section>

      {page.sections.map((section, i) => (
        <Section
          key={section.title}
          section={section}
          index={i}
          tone={tones[i]}
          cta={page.primaryCta}
        />
      ))}

      <AudienceFaq audience={page.faqAudience} cta={page.primaryCta} tone={faqTone} />

      <section id="join" className={`py-20 lg:py-28 ${joinOnWhite ? "bg-white" : "bg-ivory"}`}>
        <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-20">
          <div>
            <p aria-hidden className="h-display text-5xl leading-none text-sand">
              {num(page.sections.length)}
            </p>
            <h2 className="h-display mt-5 text-4xl sm:text-5xl lg:text-6xl">{page.join.title}</h2>
            {page.join.paragraphs.map((p) => (
              <p key={p} className="lead mt-6 text-navy-900/75">
                {p}
              </p>
            ))}
          </div>
          <div
            className={`border border-navy-900/15 p-6 sm:p-8 ${joinOnWhite ? "bg-ivory" : "bg-white"}`}
          >
            <p className="eyebrow">{page.join.formLabel}</p>
            <div className="mt-6">
              <LeadForm formId={page.formId} />
            </div>
          </div>
        </div>
      </section>
    </LandingShell>
  );
}

function Section({
  section,
  index,
  tone,
  cta,
}: {
  section: LandingSection;
  index: number;
  tone: Tone;
  cta: string;
}) {
  const dark = tone === "navy";
  const background = dark ? "bg-navy-950 text-white" : tone === "ivory" ? "bg-ivory" : "bg-white";
  const muted = dark ? "text-white/75" : "text-navy-900/75";
  const line = dark ? "border-white/15" : "border-navy-900/15";

  const heading = (
    <>
      <p aria-hidden className="h-display text-5xl leading-none text-sand">
        {num(index)}
      </p>
      <h2 className="h-display mt-5 text-4xl sm:text-5xl">{section.title}</h2>
    </>
  );

  const body = (
    <>
      {section.paragraphs?.map((p, i) => (
        <p key={p} className={`${i === 0 ? "lead" : "mt-4 leading-relaxed"} ${muted}`}>
          {p}
        </p>
      ))}

      {section.items && (
        <dl className={`grid gap-x-10 sm:grid-cols-2 ${section.paragraphs ? "mt-8" : ""}`}>
          {section.items.map((item) => (
            <div key={item.label} className={`border-t py-5 ${line}`}>
              <dt className="text-[0.78rem] font-semibold uppercase tracking-[0.2em]">{item.label}</dt>
              <dd className={`mt-2 leading-relaxed ${muted}`}>{item.text}</dd>
            </div>
          ))}
        </dl>
      )}

      {section.bullets && (
        <ul className={`mt-6 border-b ${line}`}>
          {section.bullets.map((bullet, i) => (
            <li key={bullet} className={`flex gap-5 border-t py-4 ${line}`}>
              <span aria-hidden className="h-display text-2xl leading-none text-sand">
                {num(i)}
              </span>
              <span className="text-lg leading-snug">{bullet}</span>
            </li>
          ))}
        </ul>
      )}

      {section.program && <ProgramFacts />}

      {section.cta && (
        <div className="mt-10">
          <Cta href="#join" variant={dark ? "light" : "solid"}>
            {cta}
          </Cta>
        </div>
      )}
    </>
  );

  return (
    <section id={section.id} className={`py-20 lg:py-28 ${background}`}>
      {section.image ? (
        <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            {heading}
            <div className="mt-8">{body}</div>
          </div>
          <Photo
            src={section.image.src}
            alt={section.image.alt}
            objectPosition={section.image.pos}
            sizes="(min-width: 1024px) 40rem, 100vw"
            className="aspect-[4/3] w-full"
          />
        </div>
      ) : (
        <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div>{heading}</div>
          <div className="lg:pt-2">{body}</div>
        </div>
      )}
    </section>
  );
}
