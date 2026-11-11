// Content of the campaign landing pages.
//
// The copy (headlines, sections, button labels) comes from the client's
// "Digital Acquisition Strategy" document and is reproduced as written,
// including where it calls something "proposed" or "approved". Nothing here
// promises jobs, licensing, yacht access, compensation, academic credit or
// partnerships; keep it that way when editing.
//
// Photos: the document asks for people before vessels. /discover and /campus
// use the closest photos available; replace them when real photos of young
// adults and students arrive.

import type { AudienceKey } from "./faq";
import type { FormId } from "./lead-forms";

export type LandingImage = { src: string; alt: string; pos?: string };

export type LandingSection = {
  /** Anchor, when a button on the page needs to jump here. */
  id?: string;
  title: string;
  paragraphs?: string[];
  /** Short label + description pairs. */
  items?: { label: string; text: string }[];
  bullets?: string[];
  image?: LandingImage;
  /** Dark band with the page's main button: the visible offer. */
  cta?: boolean;
  /** Adds the real facts of the YB Learn program under the text. */
  program?: boolean;
};

export type Landing = {
  path: string;
  formId: FormId;
  /** Which five questions of the FAQ (lib/faq.ts) this page shows. */
  faqAudience: AudienceKey;
  /** Small label above the headline. */
  audience: string;
  metaTitle: string;
  metaDescription: string;
  /** "sky" for the discovery audiences, "sand" for the professional ones. */
  accent: "sky" | "sand";
  hero: {
    headline: string;
    subhead: string;
    paragraphs: string[];
    /** Last line of the hero, shown with more weight. */
    closing: string;
    image: LandingImage;
  };
  /** Main button. Every copy of it leads to the form. */
  primaryCta: string;
  /** Label of the hero button, when the document gives a different one. */
  heroCta?: string;
  /** Short version for the header on phones. */
  shortCta: string;
  secondaryCta: { label: string; href: string };
  sections: LandingSection[];
  /** The closing section, shown next to the form. */
  join: { title: string; paragraphs: string[]; formLabel: string };
};

export const landings = {
  discover: {
    path: "/discover",
    formId: "discover",
    faqAudience: "genz",
    audience: "YB DISCOVER",
    metaTitle: "Wait. That's a Career?",
    metaDescription:
      "Discover the business of yachting through real people, practical learning, and experiences that show you what's possible. Start with a free YB Discovery Pass.",
    accent: "sky",
    hero: {
      headline: "Wait. That's a Career?",
      subhead: "Your future might look nothing like you imagined.",
      paragraphs: [
        "What if your next career took you beyond an office, connected you with extraordinary people, and introduced you to an industry you never considered?",
        "Welcome to YB University. Discover the business of yachting through real people, practical learning, and experiences that show you what's possible.",
      ],
      closing: "You don't need to know anything about yachts. You just need to be curious.",
      image: {
        src: "/broker-dock-yacht.png",
        alt: "Young professional in a navy suit standing at the marina in front of a yacht",
        pos: "22% 50%",
      },
    },
    primaryCta: "Get My Free Discovery Pass",
    heroCta: "Discover What's Possible",
    shortCta: "Get My Pass",
    secondaryCta: { label: "See What I Could Become", href: "#explore" },
    sections: [
      {
        title: "A career you never saw coming.",
        paragraphs: [
          "There is an entire industry behind the yachts. Sales. Marketing. Technology. Design. Relationships. Business. And people who make it all happen.",
          "Your place in that world might surprise you.",
        ],
        image: {
          src: "/surveyor-hull-inspection-boatyard.png",
          alt: "Marine surveyor inspecting a yacht hull in a boatyard",
          pos: "60% 50%",
        },
      },
      {
        id: "explore",
        title: "More than a course. A world to explore.",
        items: [
          { label: "Explore", text: "Discover roles you didn't know existed." },
          { label: "Learn", text: "Build practical industry knowledge." },
          { label: "Connect", text: "Meet people who work in yachting." },
          { label: "Experience", text: "Explore approved events and real-world activities." },
        ],
      },
      {
        title: "Zero yacht experience? Perfect.",
        paragraphs: [
          "You don't need an industry background or a professional network to begin. YB University introduces the fundamentals, the people, and the possibilities.",
        ],
      },
      {
        title: "Start free. Go further when you're ready.",
        paragraphs: [
          "Get your YB Discovery Pass. Explore introductory learning, find upcoming experiences, and discover which professional path interests you.",
        ],
        cta: true,
      },
    ],
    join: {
      title: "Your next move starts here.",
      paragraphs: ["Join the curious. Discover the unexpected. Find your place."],
      formLabel: "FREE DISCOVERY PASS",
    },
  },

  reinvent: {
    path: "/reinvent",
    formId: "reinvent",
    faqAudience: "millennials",
    audience: "YB REINVENT",
    metaTitle: "Your Next Chapter Could Take You Places",
    metaDescription:
      "You've built experience. Now build something different. YB University introduces you to the business of yachting through structured education, industry connections, and practical experiences.",
    accent: "sand",
    hero: {
      headline: "Your Next Chapter Could Take You Places.",
      subhead: "You've built experience. Now build something different.",
      paragraphs: [
        "You've developed skills, navigated challenges, and learned how business works.",
        "But what if your next professional chapter offered a new industry, meaningful relationships, and a different kind of opportunity?",
        "YB University introduces you to the business of yachting through structured education, industry connections, and practical experiences.",
      ],
      closing: "You are not starting over. You are bringing everything you've learned into something new.",
      image: {
        src: "/handshake-marina-dock.png",
        alt: "Two professionals shaking hands on the marina dock in front of yachts",
        pos: "42% 50%",
      },
    },
    primaryCta: "Explore My Next Chapter",
    shortCta: "Explore",
    secondaryCta: { label: "View the Professional Foundations Program", href: "#program" },
    sections: [
      {
        title: "Your experience still counts.",
        paragraphs: [
          "Communication. Negotiation. Marketing. Leadership. Sales. Client relationships. The skills you've developed may have real applications in the yacht industry.",
        ],
      },
      {
        title: "A different industry. Familiar strengths.",
        paragraphs: [
          "Discover how brokerage professionals combine industry knowledge, business development, trust, and relationships to support buyers and sellers.",
        ],
        image: {
          src: "/corporate-meeting-marina.png",
          alt: "Brokerage team and client reviewing documents on a marina dock",
          pos: "59% 50%",
        },
      },
      {
        id: "program",
        title: "Learn the industry. Understand the opportunity.",
        paragraphs: [
          "Our proposed Yacht Brokerage Professional Foundations program introduces vessel knowledge, brokerage practices, client experience, negotiations, legal considerations, and modern business tools.",
        ],
        program: true,
      },
      {
        title: "Meet the people behind the business.",
        paragraphs: [
          "YB University connects education with opportunities to engage with experienced professionals, industry conversations, and selected in-person activities.",
        ],
      },
      {
        title: "Explore before you commit.",
        paragraphs: [
          "You don't have to make a career decision today. Start by understanding the industry, the learning commitment, and the potential professional pathways.",
        ],
        cta: true,
      },
    ],
    join: {
      title: "Your next chapter deserves a closer look.",
      paragraphs: ["Explore a different professional future. Bring your experience. Discover what comes next."],
      formLabel: "PROGRAM INQUIRY",
    },
  },

  entrepreneurs: {
    path: "/entrepreneurs",
    formId: "entrepreneurs",
    faqAudience: "entrepreneurs",
    audience: "YB ENTREPRENEURS",
    metaTitle: "Learn the Business. Build Your Future.",
    metaDescription:
      "An industry to understand. Skills to develop. Opportunities to explore. Discover how the business of yachting works and how professionals create value in a specialized market.",
    accent: "sand",
    hero: {
      headline: "Learn the Business. Build Your Future.",
      subhead: "An industry to understand. Skills to develop. Opportunities to explore.",
      paragraphs: [
        "Every industry has its own language, relationships, and commercial opportunities.",
        "Yachting is no exception.",
        "At YB University, discover how the business works, what drives transactions, and how professionals build relationships and create value in a specialized market.",
      ],
      closing: "Think beyond the yacht. Understand the business behind it.",
      image: {
        src: "/clients-reviewing-yacht-brochure.png",
        alt: "Brokers and a client reviewing a yacht brochure together",
        pos: "45% 40%",
      },
    },
    primaryCta: "Explore the Business Opportunity",
    shortCta: "Explore",
    secondaryCta: { label: "Discover the Professional Foundations Program", href: "#program" },
    sections: [
      {
        title: "The business behind the experience.",
        paragraphs: [
          "Yacht brokerage brings together sales, negotiation, marketing, client relationships, market knowledge, and professional collaboration.",
          "Discover the commercial ecosystem behind the industry.",
        ],
      },
      {
        title: "Build skills that matter.",
        paragraphs: ["Explore five practical areas:"],
        bullets: [
          "Business development and prospecting",
          "Sales and negotiation",
          "Client experience and relationship management",
          "Digital marketing and personal positioning",
          "Professional networks and brokerage operations",
        ],
      },
      {
        title: "Learn by solving real problems.",
        paragraphs: [
          "Apply business thinking through brokerage scenarios, marketing exercises, client case studies, and commercial challenges.",
        ],
        image: {
          src: "/sale-closing-yacht-deck.png",
          alt: "Broker shaking hands with a smiling couple on a yacht deck",
          pos: "50% 55%",
        },
      },
      {
        id: "program",
        title: "From learning to application.",
        paragraphs: [
          "Explore how YB Learn builds foundational knowledge and how eligible participants may apply for selected YB Opportunities projects.",
        ],
        program: true,
      },
      {
        title: "Meet the industry. Build your network.",
        paragraphs: [
          "Connect with professionals, entrepreneurs, and specialists who understand the commercial side of yachting.",
        ],
        cta: true,
      },
    ],
    join: {
      title: "Opportunity starts with understanding.",
      paragraphs: ["Before you build a business in an unfamiliar industry, learn how that industry works."],
      formLabel: "BUSINESS INQUIRY",
    },
  },

  creators: {
    path: "/creators",
    formId: "creators",
    faqAudience: "creators",
    audience: "YB CREATORS COLLECTIVE",
    metaTitle: "Find Your Niche. Build Your Voice.",
    metaDescription:
      "Your next great story might be waiting on the water. The YB Creators Collective is a proposed community for storytellers ready to discover the world behind yachting.",
    accent: "sky",
    hero: {
      headline: "Find Your Niche. Build Your Voice.",
      subhead: "Your next great story might be waiting on the water.",
      paragraphs: [
        "You know how to create content. But what makes your content different?",
        "A distinctive perspective. Access to people worth listening to. A subject your audience hasn't explored a thousand times.",
        "Welcome to the YB Creators Collective. A proposed community for emerging storytellers, creators, and digital voices ready to discover the world behind yachting.",
      ],
      closing: "Don't just create more content. Create something worth following.",
      image: {
        src: "/creator-filming-yacht-bow.png",
        alt: "Young creator filming with a phone on a gimbal at the bow of a boat",
        pos: "72% 45%",
      },
    },
    primaryCta: "Apply to the Creators Collective",
    shortCta: "Apply",
    secondaryCta: { label: "Explore the Creator Challenge", href: "#challenge" },
    sections: [
      {
        title: "One industry. A thousand stories.",
        paragraphs: [
          "Yachting is more than beautiful vessels. It's people, technology, craftsmanship, business, destinations, and environmental challenges.",
          "Discover a subject with depth.",
        ],
      },
      {
        title: "Find the story that fits your voice.",
        items: [
          { label: "Travel & Lifestyle", text: "Destinations and coastal culture" },
          { label: "Business", text: "Entrepreneurship and brokerage" },
          { label: "Luxury & Design", text: "Craftsmanship and interiors" },
          { label: "Technology", text: "Innovation and marine systems" },
          { label: "Sustainability", text: "Responsible boating and conservation" },
          { label: "Marine Expertise", text: "Vessel reviews and ownership" },
        ],
      },
      {
        title: "Go behind the content.",
        paragraphs: [
          "Selected creators may participate in approved yacht experiences, expert interviews, marina visits, and industry events. Build stories grounded in actual knowledge and firsthand experiences.",
        ],
        image: {
          src: "/glamorous-yacht-film-shoot.png",
          alt: "Videographer with a gimbal filming a crew on the deck of a yacht",
          pos: "50% 50%",
        },
      },
      {
        id: "challenge",
        title: "Introducing the YB Creator Challenge.",
        paragraphs: [
          "One industry. Your perspective.",
          "Selected participants receive a creative brief and an opportunity to develop an original story about the yachting industry. Work is evaluated for originality, accuracy, storytelling, production quality, and audience relevance.",
        ],
        cta: true,
      },
      {
        title: "Your portfolio. Your professional identity.",
        paragraphs: [
          "Develop a distinctive body of work, connect with industry specialists, and explore potential collaborations.",
        ],
      },
    ],
    join: {
      title: "Apply to the founding collective.",
      paragraphs: [
        "We're looking for curious, committed storytellers who want to build meaningful expertise. Your audience size is only one part of the picture.",
      ],
      formLabel: "CREATOR APPLICATION",
    },
  },

  campus: {
    path: "/campus",
    formId: "campus",
    faqAudience: "college",
    audience: "YB CAMPUS EXPERIENCE",
    metaTitle: "Your Campus. Your Crew. Your Next Adventure.",
    metaDescription:
      "Some of the best things you'll learn won't happen in a classroom. Discover yachting through people, events, creative challenges and professional connections with YB Campus Experience.",
    accent: "sky",
    hero: {
      headline: "Your Campus. Your Crew. Your Next Adventure.",
      subhead: "Some of the best things you'll learn won't happen in a classroom.",
      paragraphs: [
        "College opens doors. What if one of those doors led to an industry you never imagined?",
        "Meet YB Campus Experience. Discover yachting through people, events, creative challenges, professional connections, and experiences that could change the way you think about your future.",
      ],
      closing: "No yacht knowledge required. No career decision needed. Just curiosity.",
      image: {
        src: "/yacht-deck-interview.png",
        alt: "Friends laughing together on a boat deck while a crew films them",
        pos: "35% 50%",
      },
    },
    primaryCta: "Join the Campus Crew",
    shortCta: "Join the Crew",
    secondaryCta: { label: "Apply to Be a Campus Ambassador", href: "#join" },
    sections: [
      {
        title: "Your world just got bigger.",
        paragraphs: [
          "Discover an industry where business, travel, design, marketing, technology, and professional relationships come together.",
        ],
      },
      {
        title: "Introducing YB Campus Crew.",
        paragraphs: [
          "Your connection to a world beyond campus.",
          "Meet other curious students, explore the industry, participate in approved experiences, and build connections beyond your usual circle.",
        ],
        image: {
          src: "/marina-networking-event.png",
          alt: "People meeting on a marina terrace in front of yachts",
          pos: "50% 55%",
        },
      },
      {
        title: "Five ways to get involved.",
        items: [
          {
            label: "YB Discovery Days",
            text: "Campus conversations, interactive demonstrations, and unexpected career insights.",
          },
          {
            label: "YB Step Aboard",
            text: "Approved, supervised marina and yacht experiences with industry professionals.",
          },
          {
            label: "YB Campus Creator Challenge",
            text: "Turn what you discover into original stories, videos, and portfolio work.",
          },
          {
            label: "YB Business Challenge",
            text: "Work with other students to solve realistic marketing, business, and technology problems.",
          },
          {
            label: "YB Campus Crew Ambassadors",
            text: "Apply to help build your campus community and introduce peers to the industry.",
          },
        ],
      },
      {
        title: "One day. A whole new world.",
        paragraphs: [
          "Introducing the proposed YB Campus Takeover: a campus-to-marina discovery event combining professional conversations, hands-on exploration, networking, and creative challenges.",
        ],
        cta: true,
      },
      {
        title: "Make your college experience count beyond the classroom.",
        paragraphs: [
          "Develop projects, build your portfolio, meet professionals, and discover how your academic interests might connect to yachting.",
        ],
      },
    ],
    join: {
      title: "Your crew is waiting.",
      paragraphs: [
        "Start with a free Discovery Pass and be among the first to hear about upcoming campus activities.",
      ],
      formLabel: "FREE CAMPUS CREW REGISTRATION",
    },
  },
} satisfies Record<string, Landing>;
