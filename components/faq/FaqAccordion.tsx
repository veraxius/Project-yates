"use client";

import { useState } from "react";
import type { Faq } from "../../lib/faq";

// A list of questions that open and close. Several can be open at once, and
// "Expand all" opens them together. Each question is a real button that
// reports whether it is open (aria-expanded) and points at its answer, so it
// works with a keyboard and a screen reader.
export function FaqAccordion({
  items,
  defaultOpenId,
  tone = "light",
}: {
  items: Faq[];
  defaultOpenId?: string;
  tone?: "light" | "dark";
}) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);
  const allOpen = items.length > 0 && items.every((item) => openIds.includes(item.id));
  const dark = tone === "dark";

  return (
    <div>
      <div
        className={`flex items-center justify-between gap-4 pb-4 text-[0.72rem] font-semibold uppercase tracking-[0.2em] ${
          dark ? "text-white/60" : "text-navy-900/60"
        }`}
      >
        <span>
          {items.length} {items.length === 1 ? "question" : "questions"}
        </span>
        <button
          type="button"
          onClick={() => setOpenIds(allOpen ? [] : items.map((item) => item.id))}
          className={`inline-flex min-h-11 items-center underline decoration-sand decoration-2 underline-offset-8 transition-colors ${
            dark ? "text-white hover:text-sand" : "text-navy-900 hover:text-brass"
          }`}
        >
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>

      <div
        className={`divide-y border-y ${
          dark ? "divide-white/15 border-white/15" : "divide-navy-900/15 border-navy-900/15"
        }`}
      >
        {items.map((item) => {
          const open = openIds.includes(item.id);
          return (
            <div key={item.id}>
              <h3>
                <button
                  type="button"
                  id={`${item.id}-button`}
                  aria-expanded={open}
                  aria-controls={`${item.id}-panel`}
                  onClick={() =>
                    setOpenIds((previous) =>
                      open ? previous.filter((id) => id !== item.id) : [...previous, item.id],
                    )
                  }
                  className="flex min-h-11 w-full items-start justify-between gap-6 py-6 text-left"
                >
                  <span className="h-display text-2xl leading-snug sm:text-3xl">{item.question}</span>
                  <span
                    aria-hidden
                    className={`mt-2 flex h-6 w-6 shrink-0 items-center justify-center text-sand transition-transform duration-300 ${
                      open ? "rotate-45" : ""
                    }`}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 0v16M0 8h16" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </span>
                </button>
              </h3>
              <div
                id={`${item.id}-panel`}
                role="region"
                aria-labelledby={`${item.id}-button`}
                hidden={!open}
                className={`pb-7 pr-10 ${dark ? "text-white/75" : "text-navy-900/70"}`}
              >
                <p className="max-w-2xl leading-relaxed">{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
