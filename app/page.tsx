import Link from "next/link";
import { Cta } from "../components/Cta";
import { Photo } from "../components/Photo";
import { Reveal } from "../components/Reveal";
import { RevealWords } from "../components/RevealWords";
import type { Metadata } from "next";
import { canonicalFor } from "../lib/site-env";

// Start time (ms) of an element in the hero entrance (see globals.css).
const at = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

const components = [
  {
    n: "01",
    name: "YB LEARN",
    title: "KNOW THE BUSINESS.",
    body: "Master the foundations of yacht brokerage through practical lessons, industry knowledge, and professional challenges.",
    tags: "Professional learning · Assessments · Credential",
    href: "/learn",
    variant: 1 as const,
    src: "/broker-dock-yacht.png",
    alt: "Young broker in a navy suit standing at the marina in front of a luxury yacht",
    pos: "25% 45%",
  },
  {
    n: "02",
    name: "YB EXPERIENCE",
    title: "GET CLOSER TO THE INDUSTRY.",
    body: "Explore yachts, visit marinas, meet industry professionals, and take part in selected experiences.",
    tags: "Yacht tours · Events · Industry encounters",
    href: "/yb-experience",
    variant: 3 as const,
    src: "/luxury-marina-arrival.png",
    alt: "Guests arriving at a luxury marina and greeted by yacht staff",
    pos: "25% 50%",
  },
  {
    n: "03",
    name: "YB NETWORK",
    title: "MEET YOUR INDUSTRY.",
    body: "Connect with ambitious peers, experienced professionals, mentors, and people who understand the business.",
    tags: "Community · Connections · Mentorship",
    href: "/network",
    variant: 4 as const,
    src: "/sunset-toast-yacht.png",
    alt: "Friends toasting and talking on a yacht deck at sunset",
    pos: "55% 50%",
  },
  {
    n: "04",
    name: "YB OPPORTUNITIES",
    title: "TURN CAPABILITY INTO OPPORTUNITY.",
    body: "Build your portfolio, demonstrate your skills, and apply for selected projects and professional opportunities.",
    tags: "Projects · Talent · Professional pathways",
    href: "/opportunities",
    variant: 5 as const,
    src: "/handshake-marina-dock.png",
    alt: "Two professionals shaking hands on the marina dock in front of luxury yachts",
    pos: "38% 50%",
  },
];

const steps = [
  { n: "01", name: "DISCOVER", body: "Understand the concepts and the business behind them." },
  { n: "02", name: "DECODE", body: "Explore real-world yachts, listings, clients, and scenarios." },
  { n: "03", name: "DO", body: "Apply what you learn through practical assignments." },
  { n: "04", name: "DEMONSTRATE", body: "Show your understanding through assessments and professional challenges." },
];

export const metadata: Metadata = {
  alternates: canonicalFor("/"),
};

export default function Home() {
  return (
    <>
      {/* 01. Hero */}
      <section className="relative isolate flex min-h-[calc(100svh-4.5rem)] items-end text-white">
        <Photo
          src="/golden-sunset-yacht-gathering.png"
          alt="Guests gathered on a luxury yacht at golden sunset"
          quality={90}
          priority
          objectPosition="60% 50%"
          settle
          className="absolute inset-0 -z-10"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-navy-950/5" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/85 via-navy-950/50 to-transparent to-75%" />
        <div className="container-x pb-20 pt-32 lg:pb-28">
          <div className="flex items-center gap-4">
            <p className="eyebrow rise !text-sand" style={at(400)}>YB UNIVERSITY</p>
            <span aria-hidden className="line-draw block h-px w-14 bg-sand" />
          </div>
          <h1 className="h-display mt-6 max-w-4xl text-[clamp(2.6rem,5.4vw,4.9rem)]">
            <RevealWords text="DISCOVER A WORLD. MAKE IT YOURS." />
          </h1>
          <div className="mt-10 max-w-2xl">
            <p
              className="rise text-xl leading-relaxed text-white/95 sm:text-2xl"
              style={at(1300)}
            >
              {"Don't just admire the yachting world. Learn how the business works. Experience the industry. Build your place in it."}
            </p>
            <p className="rise mt-5 leading-relaxed text-white/70" style={at(1500)}>
              A new way to enter the world of yacht brokerage. Built for ambitious people ready to learn, connect, and create opportunities.
            </p>
          </div>
          <div
            className="rise mt-10 flex flex-col gap-4 sm:flex-row"
            style={at(1700)}
          >
            <Cta href="/#experience" variant="light">EXPLORE THE EXPERIENCE</Cta>
            <Cta href="/learn" variant="outline-light">DISCOVER YB LEARN</Cta>
          </div>
        </div>
      </section>

      {/* 02. The proposition */}
      <section className="py-24 lg:py-36">
        <div className="container-x grid gap-14 lg:grid-cols-[minmax(0,28rem)_minmax(0,34rem)] lg:justify-center lg:gap-16 xl:gap-24">
          <Reveal className="h-full">
            <Photo
              src="/corporate-meeting-marina.png"
              alt="Yacht brokerage team and client reviewing documents on a marina dock"
              quality={90}
              sizes="(min-width: 1024px) 28rem, 100vw"
              objectPosition="59% 50%"
              className="aspect-[4/5] w-full lg:aspect-auto lg:h-full"
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="rule" />
            <h2 className="h-display mt-8 text-5xl sm:text-6xl lg:text-7xl">MORE THAN A COURSE.</h2>
            <p className="h-display mt-6 text-2xl text-navy-700 sm:text-3xl">
              A different way into the yachting industry.
            </p>
            <p className="lead mt-8 text-navy-900/75">
              YB University brings professional learning, real-world experiences, industry connections, and business opportunities together.
            </p>
            <p className="lead mt-6 text-navy-900/75">{"You don't just watch lessons."}</p>
            <p className="lead text-navy-900/75">
              You build knowledge, develop practical skills, meet people in the industry, and demonstrate what you can do.
            </p>
            <p className="mt-10 border-t border-navy-900/15 pt-6 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-navy-900">
              Four components. One connected experience.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 03. The four components */}
      <section id="experience" className="bg-ivory py-24 lg:py-32">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">THE EXPERIENCE</p>
            <h2 className="h-display mt-5 max-w-3xl text-4xl sm:text-5xl lg:text-6xl">
              Four components. One connected experience.
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
            {components.map((c, i) => (
              <Reveal key={c.name} delay={(i % 2) * 120} className="min-w-0">
                <Link
                  href={c.href}
                  className="group relative isolate flex min-h-[34rem] flex-col justify-end overflow-hidden p-6 text-white min-[400px]:p-8 sm:p-10"
                >
                  <Photo
                    variant={c.variant}
                    src={c.src}
                    alt={c.alt}
                    quality={90}
                    sizes="52rem"
                    objectPosition={c.pos}
                    className="absolute inset-0 -z-10 transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 -z-10 bg-navy-950/20" />
                  <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(3,31,60,0.96)_0%,rgba(3,31,60,0.78)_42%,rgba(3,31,60,0.28)_72%,rgba(3,31,60,0)_100%)]" />
                  <p className="eyebrow !text-sand">
                    {c.n} / {c.name}
                  </p>
                  <h3 className="h-display mt-4 text-[clamp(1.75rem,9.2vw,2.25rem)] sm:text-5xl md:text-4xl lg:text-5xl">{c.title}</h3>
                  <p className="mt-5 max-w-md leading-relaxed text-white/80">{c.body}</p>
                  <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/60">
                    {c.tags}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-14 flex justify-center">
            <Cta href="/learn">EXPLORE THE FOUR COMPONENTS</Cta>
          </Reveal>
        </div>
      </section>

      {/* 04. Flagship program */}
      <section className="relative isolate flex min-h-[85svh] items-center text-white">
        <Photo
          src="/sunset-meeting-yacht-deck.png"
          alt="Professionals networking on a yacht deck at sunset with the city skyline behind"
          quality={90}
          objectPosition="50% 65%"
          className="absolute inset-0 -z-10"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(3,31,60,0.92)_0%,rgba(3,31,60,0.72)_40%,rgba(3,31,60,0.25)_70%,rgba(3,31,60,0)_100%)]" />
        <div className="container-x py-28">
          <Reveal className="max-w-3xl">
            <p className="eyebrow !text-sand">THE YB BROKER CERTIFICATION EXPERIENCE</p>
            <h2 className="h-display mt-6 text-[clamp(2.25rem,11vw,3rem)] sm:text-6xl lg:text-7xl">
              YOUR FIRST STEP INTO YACHT BROKERAGE.
            </h2>
            <h3 className="h-display mt-8 text-2xl text-sky sm:text-3xl">
              Yacht Brokerage Professional Foundations
            </h3>
            <p className="mt-6 text-xl text-white/95">Understand the business behind the yachts.</p>
            <p className="mt-4 max-w-2xl leading-relaxed text-white/75">
              Learn how brokers identify opportunities, understand vessels, work with buyers and sellers, develop listings, market yachts, negotiate deals, and manage transactions.
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-white/75">
              Then put your knowledge to work through practical assignments and a final brokerage challenge.
            </p>
            <p className="mt-8 border-l border-sand pl-5 text-sm font-semibold uppercase leading-relaxed tracking-[0.14em]">
              16 professional learning modules. Practical challenges. Assessed competencies.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Cta href="/learn" variant="light">EXPLORE THE PROGRAM</Cta>
              <Cta href="/learn#curriculum" variant="outline-light">VIEW THE CURRICULUM</Cta>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 05. The learning experience */}
      <section className="py-24 lg:py-36">
        <div className="container-x">
          <Reveal className="max-w-2xl">
            <div className="rule" />
            <h2 className="h-display mt-8 text-5xl sm:text-6xl lg:text-7xl">LEARN BY DOING.</h2>
            <p className="h-display mt-5 text-2xl text-navy-700 sm:text-3xl">Every module moves you forward.</p>
          </Reveal>
          <div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 100}>
                <p className="h-display text-7xl text-sand">{s.n}</p>
                <h3 className="mt-4 border-t border-navy-900/15 pt-5 text-[0.8rem] font-semibold uppercase tracking-[0.24em]">
                  {s.name}
                </h3>
                <p className="mt-4 leading-relaxed text-navy-900/70">{s.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="h-display mt-20 text-3xl text-navy-900 sm:text-4xl lg:text-5xl">
              Knowledge is the starting point. <span className="text-navy-700">Capability is the goal.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* 06. The lifestyle and industry */}
      <section className="bg-ivory py-24 lg:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <Reveal className="grid aspect-[5/6] h-full grid-cols-5 grid-rows-2 gap-3 lg:aspect-auto">
            <Photo
              src="/sailor-at-helm-open-sea.png"
              alt="Sailor in a navy polo at the helm of a sailboat on open blue water"
              quality={90}
              sizes="(min-width: 1024px) 21rem, 60vw"
              className="col-span-3 row-span-2 h-full"
            />
            <Photo
              src="/boat-show-dock.png"
              alt="Crowd walking along a boat show dock lined with yachts and flags"
              quality={90}
              sizes="(min-width: 1024px) 14rem, 40vw"
              className="col-span-2 h-full"
            />
            <Photo
              src="/broker-working-marina-view.png"
              alt="Broker working on a laptop at a desk with a marina full of yachts behind"
              quality={90}
              objectPosition="85% 50%"
              sizes="40rem"
              className="col-span-2 h-full"
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="rule" />
            <h2 className="h-display mt-8 text-4xl sm:text-5xl lg:text-6xl">
              {"THERE'S A BUSINESS BEHIND THE LIFESTYLE."}
            </h2>
            <p className="h-display mt-6 text-2xl text-navy-700 sm:text-3xl">
              Get to know the world beyond the water.
            </p>
            <p className="lead mt-8 text-navy-900/75">
              Yachting brings together business, technology, design, hospitality, sales, marketing, and extraordinary people.
            </p>
            <p className="lead mt-5 text-navy-900/75">
              {"Whether you're building a career in brokerage, creating content, developing a business, or exploring a new industry, there's more to discover than the view from the deck."}
            </p>
            <p className="mt-10 border-t border-navy-900/15 pt-6 text-[0.72rem] font-semibold uppercase tracking-[0.22em]">
              Understand the industry. Find where you fit.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 07. YB Opportunities */}
      <section className="bg-navy-950 text-white">
        <div className="grid lg:grid-cols-2">
          <div className="container-x flex items-center py-24 lg:max-w-none lg:py-32 lg:pl-[max(3rem,calc((100vw-80rem)/2+3rem))] lg:pr-20">
            <Reveal>
              <p className="eyebrow !text-sand">YB OPPORTUNITIES</p>
              <h2 className="h-display mt-6 text-5xl sm:text-6xl">{"DON'T STOP AT LEARNING."}</h2>
              <p className="h-display mt-5 text-2xl text-sky sm:text-3xl">Show us what you can do.</p>
              <p className="lead mt-8 text-white/80">
                YB University is designed to connect learning with action.
              </p>
              <p className="lead mt-4 text-white/70">
                Build your professional portfolio. Take on practical challenges. Demonstrate your capabilities.
              </p>
              <p className="lead mt-4 text-white/70">
                Qualified participants may apply for selected projects, mentorship, and opportunities within the Palm Beach Yachts ecosystem.
              </p>
              <p className="mt-8 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white">
                Your next step starts with what you can demonstrate.
              </p>
              <div className="mt-10">
                <Cta href="/opportunities" variant="light">DISCOVER YB OPPORTUNITIES</Cta>
              </div>
            </Reveal>
          </div>
          <Photo
            src="/glamorous-yacht-film-shoot.png"
            alt="Videographer with a gimbal filming a production crew on the deck of a luxury yacht"
            quality={90}
            sizes="(min-width: 1024px) 50vw, 100vw"
            objectPosition="50% 60%"
            className="min-h-[26rem] lg:min-h-full"
          />
        </div>
      </section>

      {/* 08. About YB University */}
      <section className="py-24 lg:py-36">
        <div className="container-x">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">ABOUT YB UNIVERSITY</p>
            <h2 className="h-display mt-6 text-4xl sm:text-5xl lg:text-6xl">
              BUILT AROUND THE REAL WORLD OF YACHTING.
            </h2>
            <div className="rule mx-auto mt-8" />
            <p className="lead mt-8 text-navy-900/75">
              YB University is the education and professional development platform connected to Palm Beach Yachts.
            </p>
            <p className="lead mt-5 text-navy-900/75">
              We bring together industry knowledge, practical learning, professional relationships, and selected business opportunities.
            </p>
            <p className="lead mt-8 text-navy-900/75">Our goal is simple:</p>
            <p className="h-display mt-3 text-3xl text-navy-900 sm:text-4xl">
              Help the next generation understand the yachting business and develop the capabilities to contribute to it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 09. Final CTA */}
      <section className="relative isolate flex min-h-[80svh] items-center justify-center text-center text-white">
        <Photo
          src="/yacht-deck-interview.png"
          alt="Friends laughing together on a yacht deck while a video crew films them"
          quality={90}
          objectPosition="50% 55%"
          className="absolute inset-0 -z-10"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_80%_at_50%_50%,rgba(3,31,60,0.88),rgba(3,31,60,0.66)_55%,rgba(3,31,60,0.4)_100%)]" />
        <div className="container-x py-28">
          <Reveal className="mx-auto max-w-4xl">
            <h2 className="h-display text-[clamp(2.25rem,11vw,3rem)] sm:text-6xl lg:text-7xl">
              THE INDUSTRY IS OPEN TO NEW PERSPECTIVES.
            </h2>
            <p className="h-display mt-6 text-3xl text-sky sm:text-4xl">Are you ready to explore it?</p>
            <p className="mt-6 text-white/80">
              Start with the knowledge. Experience the business. Build your connections.
            </p>
            <p className="mt-2 text-white/80">Your yachting journey starts here.</p>
            <div className="mt-10 flex justify-center">
              <Cta href="/#experience" variant="light">EXPLORE YB UNIVERSITY</Cta>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
