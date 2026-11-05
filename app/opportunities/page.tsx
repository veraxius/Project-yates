import type { Metadata } from "next";
import { Cta } from "../../components/Cta";
import { PageHero } from "../../components/PageHero";
import { Reveal } from "../../components/Reveal";

export const metadata: Metadata = {
  title: "YB Opportunities",
  description:
    "Connecting qualified and selected participants with projects, mentorship, and professional development pathways within the Palm Beach Yachts ecosystem.",
};

const skills = [
  { name: "YACHT CONTENT CREATION", body: "Create approved yacht photography, video, and digital content." },
  {
    name: "DIGITAL MARKETING",
    body: "Support yacht marketing campaigns, listings, and online brand experiences.",
  },
  {
    name: "MARKET INTELLIGENCE",
    body: "Research vessels, market activity, and potential business opportunities.",
  },
  { name: "LEAD GENERATION", body: "Support approved prospecting and business development initiatives." },
  {
    name: "BROKERAGE SUPPORT",
    body: "Contribute to selected brokerage activities under appropriate professional supervision and within applicable legal requirements.",
  },
];

const path = [
  { name: "LEARN.", body: "Develop your industry knowledge." },
  { name: "PROVE.", body: "Complete practical challenges and assessments." },
  { name: "BUILD.", body: "Create a portfolio that demonstrates your capabilities." },
  { name: "APPLY.", body: "Submit your profile for selected opportunities." },
  { name: "ADVANCE.", body: "Develop through projects, mentorship, and further experience." },
];

export default function OpportunitiesPage() {
  return (
    <>
      <PageHero
        label="TALENT & BUSINESS PIPELINE"
        name="YB OPPORTUNITIES"
        title="TURN WHAT YOU KNOW INTO WHAT YOU CAN DO."
        variant={5}
      />

      <section className="py-24 lg:py-32">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <div className="rule" />
            <h2 className="h-display mt-8 text-4xl sm:text-5xl lg:text-6xl">
              Learning creates knowledge. Applying it builds capability.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="lead text-navy-900/75">
              YB Opportunities connects qualified and selected participants with potential projects, mentorship, and professional development pathways within the Palm Beach Yachts ecosystem.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory py-24 lg:py-32">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">WHERE YOUR SKILLS CAN TAKE YOU</p>
          </Reveal>
          <div className="mt-10 divide-y divide-navy-900/15 border-y border-navy-900/15">
            {skills.map((s, i) => (
              <Reveal key={s.name}>
                <div className="grid gap-3 py-9 md:grid-cols-[4rem_1.2fr_1.5fr] md:items-baseline md:gap-8">
                  <span className="h-display text-3xl text-sand">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="h-display text-3xl sm:text-4xl">{s.name}</h3>
                  <p className="text-lg leading-relaxed text-navy-900/75">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-950 py-24 text-white lg:py-32">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow !text-sand">HOW YOU MOVE FORWARD</p>
          </Reveal>
          <ol className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {path.map((p, i) => (
              <Reveal key={p.name} delay={i * 80} className="bg-navy-950">
                <li className="h-full p-8">
                  <span className="h-display text-5xl text-sand">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-6 text-[0.8rem] font-semibold uppercase tracking-[0.24em]">{p.name}</h3>
                  <p className="mt-3 leading-relaxed text-white/70">{p.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="container-x">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="h-display text-4xl sm:text-5xl lg:text-6xl">
              OPPORTUNITY IS EARNED THROUGH CAPABILITY.
            </h2>
            <p className="mt-8 text-sm leading-relaxed text-navy-900/60">
              Applications are reviewed against the requirements of each opportunity. Projects, placements, compensation, and mentorship are subject to availability, selection, eligibility, and separate terms. Completion of a course does not guarantee employment, commissions, or a brokerage position.
            </p>
            <div className="mt-10 flex justify-center">
              <Cta href="#">EXPLORE THE OPPORTUNITY PATHWAY</Cta>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
