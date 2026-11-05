import type { Metadata } from "next";
import { PageHero } from "../../components/PageHero";
import { Reveal } from "../../components/Reveal";

export const metadata: Metadata = {
  title: "About YB University",
  description:
    "A new perspective on an established industry. YB University is connected to Palm Beach Yachts and built to introduce a new generation to the business of yachting.",
};

const approach = [
  {
    name: "PRACTICAL BY DESIGN.",
    body: "Learn through real-world examples and professional challenges.",
  },
  {
    name: "CONNECTED TO THE INDUSTRY.",
    body: "Build relationships with people who know the business.",
  },
  {
    name: "BUILT FOR WHAT'S NEXT.",
    body: "Explore how new talent, digital media, technology, and entrepreneurship can contribute to the future of yachting.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        name="ABOUT YB UNIVERSITY"
        title="A NEW PERSPECTIVE ON AN ESTABLISHED INDUSTRY."
        variant={2}
      />

      <section className="py-24 lg:py-32">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <div className="rule" />
            <p className="h-display mt-8 text-3xl sm:text-4xl lg:text-5xl">
              YB University is built to introduce a new generation to the business of yachting.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p className="lead text-navy-900/75">
              Connected to Palm Beach Yachts, our platform combines professional education with practical experiences, industry relationships, and selected opportunities.
            </p>
            <p className="lead mt-6 text-navy-900/75">We believe learning should go beyond information.</p>
            <p className="lead mt-2 text-navy-900/75">
              It should help people understand an industry, develop useful skills, and demonstrate what they can contribute.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory py-24 lg:py-32">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">OUR APPROACH</p>
          </Reveal>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {approach.map((a, i) => (
              <Reveal key={a.name} delay={i * 100}>
                <div className="border-t border-navy-900/30 pt-8">
                  <span className="h-display text-3xl text-sand">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="h-display mt-5 text-3xl sm:text-4xl">{a.name}</h3>
                  <p className="mt-4 leading-relaxed text-navy-900/70">{a.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-950 py-24 text-white lg:py-32">
        <div className="container-x">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow !text-sand">OUR PURPOSE</p>
            <p className="h-display mt-6 text-3xl sm:text-4xl lg:text-5xl">
              Help more people understand the yachting industry and develop the skills to participate in its future.
            </p>
            <div className="rule mx-auto mt-10" />
            <p className="mt-10 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/80">
              YB UNIVERSITY. THE NEXT GENERATION OF YACHTING STARTS HERE.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
