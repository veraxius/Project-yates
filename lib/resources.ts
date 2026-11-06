// Documents shown on /resources.
//
// To add a document:
//   1. Put the file in  public/resources/  (e.g. public/resources/listing-agreement.pdf)
//   2. Add an entry to one of the groups below, with  href: "/resources/<file name>".
// A group with no items is hidden. While every group is empty, the page shows a
// "coming soon" message.
//
// Note: everything in public/ is reachable by anyone who has the link. If a
// document must only be available to course members, keep it inside
// LearnWorlds instead.

export type Resource = {
  title: string;
  description?: string;
  /** Path of the file, e.g. "/resources/listing-agreement.pdf" */
  href: string;
  /** Shown as a small tag, e.g. "PDF", "DOCX", "XLSX" */
  format?: string;
};

export type ResourceGroup = {
  name: string;
  blurb: string;
  items: Resource[];
};

export const resourceGroups: ResourceGroup[] = [
  {
    name: "Forms",
    blurb: "Forms brokers use in day-to-day work.",
    items: [],
  },
  {
    name: "Templates",
    blurb: "Ready-to-adapt templates.",
    items: [],
  },
  {
    name: "Other documents",
    blurb: "Guides, checklists and reference material.",
    items: [],
  },
];
