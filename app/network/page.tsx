import type { Metadata } from "next";
import { canonicalFor } from "../../lib/site-env";
import { Cta } from "../../components/Cta";
import { PageHero } from "../../components/PageHero";
import { Photo } from "../../components/Photo";
import { Reveal } from "../../components/Reveal";
import { ENROLL_HREF } from "../../lib/site";

export const metadata: Metadata = {
  alternates: canonicalFor("/network"),
  title: "YB Network",
  description:
    "A focused community of students, emerging professionals, experienced industry members, and mentors.",
};

const rooms = [
  { name: "THE DOCK", body: "Meet the community. Introduce yourself. Discover who is building what." },
  {
    name: "YACHT INTELLIGENCE",
    body: "Discuss yachts, vessel specifications, market activity, and industry developments.",
  },
  {
    name: "THE BROKER ROOM",
    body: "Exchange ideas about sales, marketing, negotiation, and real-world brokerage challenges.",
  },
  {
    name: "THE INDUSTRY LOUNGE",
    body: "Connect with guest professionals, mentors, and industry conversations.",
  },
  {
    name: "THE OPPORTUNITY BOARD",
    body: "Discover approved projects, mentorship opportunities, and professional applications.",
  },
];

export default function NetworkPage() {
  return (
    <>
      <PageHero
        label="COMMUNITY & PROFESSIONAL RELATIONSHIPS"
        name="YB NETWORK"
        title="YOUR PEOPLE. YOUR INDUSTRY. YOUR NEXT CONNECTION."
        variant={4}
        src="/captain-crew-meeting.png"
        alt="Yacht captain meeting with crew and guests around a table on the bridge"
        objectPosition="50% 45%"
      />

      <section className="py-24 lg:py-32">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <div className="rule" />
            <h2 className="h-display mt-8 text-4xl sm:text-5xl lg:text-6xl">
              The yachting industry runs on relationships.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="lead text-navy-900/75">
              YB Network brings together students, emerging professionals, experienced industry members, and mentors in one focused community.
            </p>
            <p className="lead mt-5 text-navy-900/75">
              A place to exchange knowledge, discuss the business, share ideas, and build meaningful professional connections.
            </p>
          </Reveal>
        </div>
        <div className="container-x mt-16">
          <Reveal>
            <Photo
              src="/sale-closing-yacht-deck.png"
              alt="Broker shaking hands with a smiling couple on a yacht deck"
              objectPosition="50% 55%"
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="aspect-[16/8] w-full"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory py-24 lg:py-32">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">INSIDE THE NETWORK</p>
          </Reveal>
          <div className="mt-10 grid gap-px bg-navy-900/15 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((r, i) => (
              <Reveal key={r.name} delay={(i % 3) * 100} className="bg-ivory">
                <div className="h-full p-8 sm:p-10">
                  <span className="h-display text-3xl text-sand">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="h-display mt-6 text-3xl sm:text-4xl lg:text-3xl xl:text-4xl">{r.name}</h3>
                  <p className="mt-4 leading-relaxed text-navy-900/70">{r.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-950 py-24 text-white lg:py-32">
        <div className="container-x">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="h-display text-4xl sm:text-5xl lg:text-6xl">MORE THAN A SOCIAL FEED.</h2>
            <p className="lead mt-8 text-white/75">
              A focused community built around knowledge, contribution, and professional relationships.
            </p>
            <div className="mt-10 flex justify-center">
              <Cta href={ENROLL_HREF} variant="light">JOIN THE YB NETWORK</Cta>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
