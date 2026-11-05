import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "../../components/Reveal";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to the questions visitors ask most about the YB University program.",
};

const faqs = [
  {
    q: "Do I need previous yachting experience?",
    a: "No previous brokerage experience is required for the foundational program. An interest in the industry and a willingness to learn are essential.",
  },
  {
    q: "Who is the program for?",
    a: "The program is designed for aspiring yacht brokers, entrepreneurs, content creators, sales and marketing professionals, and people interested in developing a professional understanding of the yachting industry.",
  },
  {
    q: "What will I learn?",
    a: "You'll learn the foundations of yacht brokerage, including vessel knowledge, prospecting, client relationships, yacht valuation, listings, marketing, negotiation, and transaction management.",
  },
  {
    q: "Is this a professional certification?",
    a: "Participants who meet the program's assessment requirements receive a YB University-issued educational credential in Yacht Brokerage Professional Foundations. It is not a government-issued brokerage license or an independently accredited qualification.",
  },
  {
    q: "Does completing the program guarantee a job or commission?",
    a: "No. Completion demonstrates that you've met the program's learning and assessment requirements. Selected projects and opportunities may be available through YB Opportunities, subject to eligibility and selection.",
  },
  {
    q: "Can I participate in yacht tours and events?",
    a: "Selected experiences may be available to eligible participants, depending on scheduling, availability, permissions, and applicable requirements.",
  },
  {
    q: "Can I join the YB Network?",
    a: "Network access is provided according to the applicable enrollment or membership terms.",
  },
  {
    q: "How long does the program take?",
    a: "The program is organized into 16 modules. The expected completion time, learning schedule, and access period will be published with the enrollment details.",
  },
  {
    q: "How do I enroll?",
    a: "Visit the YB Learn page, review the program details, and follow the enrollment process.",
    link: true,
  },
  {
    q: "Does YB University offer employment or brokerage placement?",
    a: "YB University does not guarantee employment or brokerage placement. Selected participants may apply for available projects and professional opportunities through YB Opportunities.",
  },
];

export default function FaqPage() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.8fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="rule" />
          <h1 className="h-display mt-8 text-5xl sm:text-6xl">FREQUENTLY ASKED QUESTIONS</h1>
        </div>

        <Reveal>
          <div className="divide-y divide-navy-900/15 border-y border-navy-900/15">
            {faqs.map((f) => (
              <details key={f.q} className="group py-7">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                  <h2 className="h-display text-2xl leading-snug sm:text-3xl">{f.q}</h2>
                  <span
                    aria-hidden
                    className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center text-sand transition-transform duration-300 group-open:rotate-45"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 0v16M0 8h16" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-5 max-w-2xl leading-relaxed text-navy-900/70">
                  {f.a}
                  {f.link && (
                    <>
                      {" "}
                      <Link href="/learn" className="font-semibold text-navy-700 underline underline-offset-4">
                        Go to YB Learn
                      </Link>
                      .
                    </>
                  )}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
