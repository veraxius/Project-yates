import { Reveal } from "./Reveal";

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  items?: string[];
};

type Props = {
  title: string;
  intro: string;
  sections: LegalSection[];
};

// Shared layout for the legal pages. The banner is intentionally loud: the
// text on these pages is a DRAFT TEMPLATE and must be reviewed by a lawyer
// before the site goes live.
export function LegalPage({ title, intro, sections }: Props) {
  return (
    <>
      <section className="bg-navy-950 py-16 text-white sm:py-20 lg:py-24">
        <div className="container-x">
          <p className="eyebrow !text-sand">LEGAL</p>
          <h1 className="h-display mt-5 max-w-4xl text-[clamp(2.25rem,7vw,4.5rem)]">
            {title.toUpperCase()}
          </h1>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            <div
              role="note"
              className="border-2 border-dashed border-red-700 bg-red-50 p-5 text-sm leading-relaxed text-red-900"
            >
              <p className="font-semibold uppercase tracking-[0.18em]">
                [LEGAL REVIEW REQUIRED] · TEMPLATE
              </p>
              <p className="mt-2">
                This page is a draft template and has NOT been reviewed by a lawyer. Do not
                publish it as final. Text in [square brackets] must be completed or replaced
                with the correct legal information.
              </p>
            </div>

            <p className="mt-8 text-sm text-navy-900/60">Last updated: [DATE]</p>
            <p className="lead mt-4 text-navy-900/80">{intro}</p>

            <div className="mt-12 space-y-12">
              {sections.map((s, i) => (
                <Reveal key={s.heading}>
                  <h2 className="h-display text-2xl sm:text-3xl">
                    <span className="mr-3 text-sand">{String(i + 1).padStart(2, "0")}</span>
                    {s.heading}
                  </h2>
                  {s.paragraphs?.map((p) => (
                    <p key={p} className="mt-4 leading-relaxed text-navy-900/80">
                      {p}
                    </p>
                  ))}
                  {s.items && (
                    <ul className="mt-4 list-disc space-y-2 pl-6 leading-relaxed text-navy-900/80">
                      {s.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
