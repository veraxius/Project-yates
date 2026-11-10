// Single source of truth for the course shown on /learn.
// Copy comes from the client's YB LEARN document. Nothing here is invented:
// the individual module titles were not in the documents, so only the four
// phases (and their module ranges) are listed.
// The price is not kept here: it is set in LearnWorlds, where the course is sold.

export const course = {
  name: "The YB Broker Certification Experience",
  title: "Yacht Brokerage Professional Foundations",
  tagline: "Your first step into yacht brokerage.",
  modules: 16,
  credentialNote:
    "This is a YB University-issued educational credential. It is not a government-issued brokerage license or a substitute for any licensing requirements that may apply.",
} as const;

export const learn = [
  "Understand the yacht brokerage industry.",
  "Identify vessel types, systems, and specifications.",
  "Evaluate market positioning and yacht pricing.",
  "Develop buyer and seller relationships.",
  "Create professional yacht listings and marketing strategies.",
  "Understand negotiation and transaction processes.",
  "Build a professional approach to brokerage.",
];

export const curriculum = [
  {
    phase: "Know the Industry",
    modules: "1–4",
    focus: "Yachts, systems, safety, brokerage",
    src: "/diver-hull-inspection.png",
    alt: "Diver inspecting a yacht hull underwater",
    pos: "50% 40%",
  },
  {
    phase: "Find the Opportunity",
    modules: "5–8",
    focus: "Prospecting, clients, valuation, listings",
    src: "/broker-showing-yacht-couple.png",
    alt: "Broker presenting a yacht to a couple at the marina",
    pos: "50% 45%",
  },
  {
    phase: "Build the Business",
    modules: "9–12",
    focus: "Marketing, showings, negotiation, transactions",
    src: "/contract-signing-yacht.png",
    alt: "Hand signing a contract with a yacht in the background",
    pos: "70% 60%",
  },
  {
    phase: "Become the Professional",
    modules: "13–16",
    focus: "Compliance, networks, client experience, business development",
    src: "/clients-reviewing-yacht-brochure.png",
    alt: "Brokers and a client reviewing a yacht brochure together",
    pos: "60% 50%",
  },
];

export const included = [
  "16 professional learning modules",
  "Practical assignments after each module",
  "Competency assessments",
  "A final brokerage challenge",
  "The YB University credential in Yacht Brokerage Professional Foundations, on meeting the assessment requirements",
];
