import type { Metadata } from "next";
import { Cta } from "../../components/Cta";
import { PageHero } from "../../components/PageHero";
import { Photo } from "../../components/Photo";
import { Reveal } from "../../components/Reveal";

export const metadata: Metadata = {
  title: "YB Experience",
  description:
    "Yacht visits, marina experiences, industry conversations, and professional events that take learning beyond the screen.",
};

const experiences = [
  {
    name: "YACHT DISCOVERY TOURS",
    body: "Get onboard. Explore vessel layouts, features, systems, and the details that matter.",
  },
  {
    name: "MARINA EXPERIENCES",
    body: "Discover the places, people, and businesses that make the yachting industry work.",
  },
  {
    name: "MEET THE INDUSTRY",
    body: "Learn from yacht brokers, captains, surveyors, and other marine professionals.",
  },
  {
    name: "CONTENT CREATION MISSIONS",
    body: "Develop your creative and communication skills through approved yacht-related content assignments.",
  },
  {
    name: "INDUSTRY EVENTS",
    body: "Take part in selected boat shows, networking gatherings, and educational experiences.",
  },
];

export default function ExperiencePage() {
  return (
    <>
      <PageHero
        label="EVENTS & INDUSTRY EXPERIENCES"
        name="YB EXPERIENCE"
        title="DON'T JUST STUDY YACHTING. GET CLOSER TO IT."
        variant={3}
        src="/Evento de networking en terraza del puerto.png"
        alt="Industry professionals networking on a marina terrace in front of luxury yachts"
        objectPosition="50% 55%"
      />

      <section className="py-24 lg:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <div className="rule" />
            <h2 className="h-display mt-8 text-4xl sm:text-5xl lg:text-6xl">
              The best way to understand the industry is to experience it.
            </h2>
            <p className="lead mt-8 text-navy-900/75">
              YB Experience brings learning beyond the screen through selected yacht visits, marina experiences, industry conversations, and professional events.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <Photo
              src="/Corredor mostrando el puente de mando.png"
              alt="Yacht broker showing a couple the helm station during an onboard visit"
              objectPosition="45% 50%"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-[5/4] w-full"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory py-24 lg:py-32">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">EXPLORE THE INDUSTRY</p>
          </Reveal>
          <div className="mt-10 divide-y divide-navy-900/15 border-y border-navy-900/15">
            {experiences.map((e, i) => (
              <Reveal key={e.name}>
                <div className="grid gap-3 py-9 md:grid-cols-[4rem_1.2fr_1.5fr] md:items-baseline md:gap-8">
                  <span className="h-display text-3xl text-sand">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="h-display text-3xl sm:text-4xl">{e.name}</h3>
                  <p className="text-lg leading-relaxed text-navy-900/75">{e.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {[
              {
                name: "MEET THE INDUSTRY",
                src: "/Inspector revisando el casco en astillero.png",
                alt: "Marine surveyor inspecting a yacht hull in a boatyard",
                pos: "60% 50%",
              },
              {
                name: "CONTENT CREATION MISSIONS",
                src: "/Equipo de video filmando en cubierta.png",
                alt: "Video crew filming on a yacht deck with a professional camera",
                pos: "50% 50%",
              },
            ].map((p) => (
              <Reveal key={p.name}>
                <Photo
                  src={p.src}
                  alt={p.alt}
                  objectPosition={p.pos}
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="aspect-[16/10] w-full"
                />
                <p className="eyebrow mt-4">{p.name}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-950 py-24 text-white lg:py-32">
        <div className="container-x">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="h-display text-4xl sm:text-5xl lg:text-6xl">
              ONE INDUSTRY. MANY WAYS TO EXPERIENCE IT.
            </h2>
            <p className="mt-8 text-sm leading-relaxed text-white/60">
              Experiences are offered according to availability, eligibility, permissions, and applicable event requirements. Participation is not guaranteed by course enrollment.
            </p>
            <div className="mt-10 flex justify-center">
              <Cta href="#" variant="light">EXPLORE UPCOMING EXPERIENCES</Cta>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
