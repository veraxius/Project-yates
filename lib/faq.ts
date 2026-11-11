// The FAQ system: one master list of questions (lib/faq.json) used in two places.
//
//  - the public /faq page, with search, eight topics and 20 featured questions
//  - a block of five questions on each campaign landing page
//
// Edit an answer in lib/faq.json and it changes everywhere it appears. The
// content comes from the client's FAQ package ("YB University Website Q&As
// Section Guidelines"). It separates what is confirmed from what is only
// proposed; keep that distinction when editing, and do not turn any answer into
// a promise of jobs, income, internships, yacht access, licensing or accreditation.
//
// Answers about price, payment plans, refunds, access period and support still
// say "will be published". Update them once the client confirms the facts.

import source from "./faq.json";

export const CATEGORIES = [
  "Getting Started",
  "The Industry",
  "The Learning Experience",
  "Costs & Enrollment",
  "Certification & Careers",
  "Real-World Experiences",
  "Creators & Students",
  "Trust & Support",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Faq = {
  id: string;
  category: Category;
  question: string;
  answer: string;
  featured: boolean;
};

export const FAQS = source as Faq[];

export const FEATURED_FAQS = FAQS.filter((item) => item.featured);

/** Which five questions each audience sees, with the heading above them. */
export const AUDIENCES = {
  genz: {
    title: "A different path starts with a question.",
    subtitle: "New to the industry? You belong in the conversation.",
    questionIds: ["faq-04", "faq-03", "faq-10", "faq-24", "faq-38"],
  },
  millennials: {
    title: "Ready for a different direction?",
    subtitle: "Explore how your experience could open new possibilities.",
    questionIds: ["faq-51", "faq-10", "faq-17", "faq-11", "faq-37"],
  },
  college: {
    title: "Go beyond the classroom.",
    subtitle: "Discover an industry while you build your future.",
    questionIds: ["faq-44", "faq-45", "faq-46", "faq-35", "faq-31"],
  },
  creators: {
    title: "Make your niche more meaningful.",
    subtitle: "Turn curiosity into informed, original content.",
    questionIds: ["faq-47", "faq-48", "faq-49", "faq-38", "faq-50"],
  },
  entrepreneurs: {
    title: "Understand the business behind the experience.",
    subtitle: "Learn the industry before making your next move.",
    questionIds: ["faq-37", "faq-11", "faq-33", "faq-14", "faq-50"],
  },
} as const;

export type AudienceKey = keyof typeof AUDIENCES;

/** The questions of one audience, in the order listed above. */
export function audienceQuestions(audience: AudienceKey): Faq[] {
  return AUDIENCES[audience].questionIds
    .map((id) => FAQS.find((item) => item.id === id))
    .filter((item): item is Faq => Boolean(item));
}

/** Where the buttons of the FAQ lead. These are this site's real routes. */
export const FAQ_LINKS = {
  discover: "/discovery-pass",
  program: "/learn",
  experiences: "/yb-experience",
  contact: "/contact",
} as const;
