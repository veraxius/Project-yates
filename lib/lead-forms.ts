// The registration and application forms of the campaign landing pages.
//
// Each form is defined once and used twice: the browser draws it from this
// definition (components/landing/LeadForm.tsx) and the server checks every
// answer against the same definition before anything is forwarded
// (lib/lead-validate.ts). A field that is not listed here is never accepted.
//
// The fields of each form are the ones listed under "Lead capture" in the
// client's Digital Acquisition Strategy document. The answer options of the
// select fields are ours; change them here if the client wants other wording.

/** How the CRM classifies the person (the document's "CRM classification"). */
export type Segment =
  | "GENZ_EXPLORER"
  | "CAREER_REINVENTOR"
  | "ENTREPRENEUR"
  | "CREATOR"
  | "CAMPUS";

export type Option = { value: string; label: string };

type Base = { name: string; label: string; required?: boolean; hint?: string };

export type Field =
  | (Base & {
      type: "text" | "email" | "tel" | "url";
      maxLength: number;
      autoComplete?: string;
      placeholder?: string;
      inputMode?: "numeric";
      /** Regular expression the whole answer must match. */
      pattern?: string;
    })
  | (Base & { type: "textarea"; maxLength: number })
  | (Base & { type: "select" | "radio"; options: Option[] })
  | (Base & { type: "checkboxes"; options: Option[] })
  | (Base & { type: "checkbox" });

export type LeadFormDef = {
  /** The page the form lives on. Sent to the CRM as landing_page. */
  landingPage: string;
  /** Kind of conversion. Registrations, inquiries and applications stay distinct. */
  event:
    | "discovery_pass_registration"
    | "program_inquiry"
    | "business_inquiry"
    | "creator_application"
    | "campus_crew_registration";
  /** The segment, or the field whose answer decides it. */
  segment: Segment | { fromField: string; map: Record<string, Segment> };
  /** primary_interest for the CRM: a fixed value, or the answer to a field. */
  primaryInterest: string | { fromField: string };
  /** Fields whose answers are sent as secondary_interests. */
  secondaryFrom?: string[];
  fields: Field[];
  submitLabel: string;
  success: { title: string; text: string };
  /** Small print shown above the button. */
  note?: string;
};

/** Optional marketing opt-in shown on every form. Stored with the consent. */
export const CONSENT_TEXT =
  "I would like to receive YB University program updates. I can unsubscribe at any time.";

const email: Field = {
  name: "email",
  label: "Email",
  type: "email",
  required: true,
  maxLength: 254,
  autoComplete: "email",
};

const fullName: Field = {
  name: "name",
  label: "Full name",
  type: "text",
  required: true,
  maxLength: 100,
  autoComplete: "name",
};

const firstName: Field = {
  name: "first_name",
  label: "First name",
  type: "text",
  required: true,
  maxLength: 60,
  autoComplete: "given-name",
};

const NEXT_STEPS = "Thank you. We have your details and will be in touch with next steps.";

export const leadForms = {
  discover: {
    landingPage: "/discover",
    event: "discovery_pass_registration",
    segment: "GENZ_EXPLORER",
    primaryInterest: { fromField: "primary_interest" },
    fields: [
      firstName,
      email,
      {
        name: "primary_interest",
        label: "What interests you most?",
        type: "select",
        required: true,
        options: [
          { value: "careers", label: "Careers" },
          { value: "creativity", label: "Creativity" },
          { value: "business", label: "Business" },
          { value: "technology", label: "Technology" },
          { value: "general_discovery", label: "General discovery" },
        ],
      },
      {
        name: "mobile",
        label: "Mobile number (optional)",
        type: "tel",
        maxLength: 30,
        autoComplete: "tel",
      },
    ],
    submitLabel: "Get My Free Discovery Pass",
    success: { title: "Your Discovery Pass request is in.", text: NEXT_STEPS },
  },

  reinvent: {
    landingPage: "/reinvent",
    event: "program_inquiry",
    segment: "CAREER_REINVENTOR",
    primaryInterest: "career_transition",
    fields: [
      fullName,
      email,
      {
        name: "professional_field",
        label: "Current professional field",
        type: "text",
        required: true,
        maxLength: 120,
        autoComplete: "organization-title",
      },
      {
        name: "transition_interest",
        label: "Your interest in a career transition",
        type: "select",
        required: true,
        options: [
          { value: "exploring", label: "Just exploring" },
          { value: "considering", label: "Seriously considering a change" },
          { value: "ready", label: "Ready to make a move" },
        ],
      },
      {
        name: "session_format",
        label: "Preferred information-session format",
        type: "select",
        required: true,
        options: [
          { value: "online", label: "Online" },
          { value: "in_person", label: "In person" },
          { value: "either", label: "Either works" },
        ],
      },
    ],
    submitLabel: "Explore My Next Chapter",
    success: { title: "Your inquiry is in.", text: NEXT_STEPS },
  },

  entrepreneurs: {
    landingPage: "/entrepreneurs",
    event: "business_inquiry",
    segment: "ENTREPRENEUR",
    primaryInterest: "business",
    fields: [
      fullName,
      email,
      {
        name: "professional_background",
        label: "Professional background",
        type: "text",
        required: true,
        maxLength: 160,
      },
      {
        name: "business_interests",
        label: "Business interests",
        type: "textarea",
        required: true,
        maxLength: 600,
        hint: "What would you like to understand or build?",
      },
      {
        name: "training_readiness",
        label: "Readiness to explore training",
        type: "select",
        required: true,
        options: [
          { value: "curious", label: "Just curious for now" },
          { value: "soon", label: "In the next few months" },
          { value: "ready", label: "Ready now" },
        ],
      },
    ],
    submitLabel: "Explore the Business Opportunity",
    success: { title: "Your inquiry is in.", text: NEXT_STEPS },
  },

  creators: {
    landingPage: "/creators",
    event: "creator_application",
    segment: "CREATOR",
    primaryInterest: { fromField: "content_niche" },
    fields: [
      fullName,
      email,
      {
        name: "creator_handle",
        label: "Creator handle",
        type: "text",
        required: true,
        maxLength: 80,
        placeholder: "@yourhandle",
      },
      {
        name: "primary_platform",
        label: "Primary platform",
        type: "select",
        required: true,
        options: [
          { value: "instagram", label: "Instagram" },
          { value: "tiktok", label: "TikTok" },
          { value: "youtube", label: "YouTube" },
          { value: "linkedin", label: "LinkedIn" },
          { value: "x", label: "X" },
          { value: "podcast", label: "Podcast" },
          { value: "blog_newsletter", label: "Blog or newsletter" },
          { value: "other", label: "Other" },
        ],
      },
      {
        name: "content_niche",
        label: "Content niche",
        type: "select",
        required: true,
        options: [
          { value: "travel_lifestyle", label: "Travel & Lifestyle" },
          { value: "business", label: "Business" },
          { value: "luxury_design", label: "Luxury & Design" },
          { value: "technology", label: "Technology" },
          { value: "sustainability", label: "Sustainability" },
          { value: "marine_expertise", label: "Marine Expertise" },
          { value: "other", label: "Other" },
        ],
      },
      {
        name: "portfolio_link",
        label: "Portfolio link",
        type: "url",
        required: true,
        maxLength: 300,
        placeholder: "https://",
        autoComplete: "url",
      },
      {
        name: "audience_size",
        label: "Audience size",
        type: "select",
        required: true,
        options: [
          { value: "under_1k", label: "Under 1,000" },
          { value: "1k_10k", label: "1,000 to 10,000" },
          { value: "10k_50k", label: "10,000 to 50,000" },
          { value: "50k_250k", label: "50,000 to 250,000" },
          { value: "over_250k", label: "More than 250,000" },
        ],
      },
      {
        name: "motivation",
        label: "Why do you want to join?",
        type: "textarea",
        required: true,
        maxLength: 1000,
      },
    ],
    submitLabel: "Apply to the Creators Collective",
    success: {
      title: "Application received.",
      text: "Thank you. We review every application and will contact you about next steps.",
    },
    note: "Applying does not guarantee selection. Participation, vessel access, project assignments and any compensation are defined separately, and creator work and usage rights require a separate agreement.",
  },

  campus: {
    landingPage: "/campus",
    event: "campus_crew_registration",
    segment: "CAMPUS",
    primaryInterest: "campus_experiences",
    secondaryFrom: ["interests", "ambassador"],
    fields: [
      fullName,
      email,
      {
        name: "college",
        label: "College or university",
        type: "text",
        required: true,
        maxLength: 120,
        autoComplete: "organization",
      },
      {
        name: "graduation_year",
        label: "Graduation year",
        type: "text",
        required: true,
        maxLength: 4,
        inputMode: "numeric",
        pattern: "20[2-4][0-9]",
        hint: "Four digits, for example 2028.",
      },
      {
        name: "field_of_study",
        label: "Field of study",
        type: "text",
        required: true,
        maxLength: 120,
      },
      {
        name: "interests",
        label: "What would you like to take part in?",
        type: "checkboxes",
        options: [
          { value: "discovery_days", label: "YB Discovery Days" },
          { value: "step_aboard", label: "YB Step Aboard" },
          { value: "creator_challenge", label: "YB Campus Creator Challenge" },
          { value: "business_challenge", label: "YB Business Challenge" },
        ],
      },
      {
        name: "ambassador",
        label: "I am interested in becoming a Campus Crew Ambassador",
        type: "checkbox",
      },
    ],
    submitLabel: "Join the Campus Crew",
    success: {
      title: "You are on the list.",
      text: "Thank you. We will let you know about upcoming campus activities.",
    },
  },

  // The shared registration for people who arrive without a campaign page.
  // The answer to "What interests you most?" decides the segment.
  "discovery-pass": {
    landingPage: "/discovery-pass",
    event: "discovery_pass_registration",
    segment: {
      fromField: "primary_interest",
      map: {
        new_career: "GENZ_EXPLORER",
        career_transition: "CAREER_REINVENTOR",
        business: "ENTREPRENEUR",
        content: "CREATOR",
        campus: "CAMPUS",
      },
    },
    primaryInterest: { fromField: "primary_interest" },
    fields: [
      firstName,
      email,
      {
        name: "primary_interest",
        label: "What interests you most?",
        type: "radio",
        required: true,
        options: [
          { value: "new_career", label: "Discover a new career" },
          { value: "career_transition", label: "Explore a career transition" },
          { value: "business", label: "Learn the business" },
          { value: "content", label: "Create content and build my niche" },
          { value: "campus", label: "Join campus experiences" },
        ],
      },
    ],
    submitLabel: "Get My Free Discovery Pass",
    success: { title: "Your Discovery Pass request is in.", text: NEXT_STEPS },
  },
} satisfies Record<string, LeadFormDef>;

export type FormId = keyof typeof leadForms;

export function isFormId(value: unknown): value is FormId {
  return typeof value === "string" && Object.hasOwn(leadForms, value);
}
