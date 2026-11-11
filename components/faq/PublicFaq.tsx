"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { CATEGORIES, FAQS, FAQ_LINKS, FEATURED_FAQS, type Category } from "../../lib/faq";
import { FaqAccordion } from "./FaqAccordion";

// The searchable list of the public /faq page.
//
// By default it shows the 20 featured questions. Searching, choosing a topic or
// "Explore all" shows the whole library. Everything runs in the browser on the
// list in lib/faq.json; nothing the visitor types is sent anywhere.

type Filter = Category | "All Questions";

const FILTERS: readonly Filter[] = ["All Questions", ...CATEGORIES];

export function PublicFaq() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Filter>("All Questions");
  const [showAll, setShowAll] = useState(false);
  const top = useRef<HTMLDivElement>(null);

  const searching = query.trim() !== "";
  const featuredMode = !showAll && !searching && category === "All Questions";

  const visible = useMemo(() => {
    if (featuredMode) return FEATURED_FAQS;
    const needle = query.trim().toLocaleLowerCase();
    return FAQS.filter(
      (item) =>
        (category === "All Questions" || item.category === category) &&
        (!needle || `${item.question} ${item.answer} ${item.category}`.toLocaleLowerCase().includes(needle)),
    );
  }, [featuredMode, query, category]);

  const heading = featuredMode
    ? "The questions that matter most"
    : searching
      ? "Search results"
      : category === "All Questions"
        ? "All questions"
        : category;

  function backToFeatured() {
    setShowAll(false);
    setCategory("All Questions");
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section ref={top} aria-label="Frequently asked questions" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
      <div className="container-x">
        <div className="mx-auto max-w-4xl">
          <label htmlFor="faq-search" className="eyebrow">
            WHAT WOULD YOU LIKE TO KNOW?
          </label>
          <div className="mt-3 flex gap-3">
            <input
              id="faq-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search questions, careers, costs, experiences..."
              autoComplete="off"
              className="block w-full border border-navy-900/30 bg-white px-4 py-3.5 text-base text-navy-900 placeholder:text-navy-900/40 focus:border-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900"
            />
            {searching && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="min-h-11 shrink-0 border border-navy-900/30 px-5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-navy-900 transition-colors hover:border-navy-900"
              >
                Clear
              </button>
            )}
          </div>

          <nav aria-label="Question topics" className="mt-6 flex flex-wrap gap-2">
            {FILTERS.map((filter) => {
              const active = category === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setCategory(filter);
                    setShowAll(true);
                  }}
                  className={`min-h-11 border px-4 text-[0.7rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
                    active
                      ? "border-navy-900 bg-navy-900 text-white"
                      : "border-navy-900/30 text-navy-900 hover:border-navy-900"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </nav>

          <div className="mt-12 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1" aria-live="polite">
            <h2 className="h-display text-3xl sm:text-4xl">{heading}</h2>
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-navy-900/60">
              {visible.length} {visible.length === 1 ? "answer" : "answers"}
            </span>
          </div>

          <div className="mt-6">
            {visible.length > 0 ? (
              <FaqAccordion
                key={`${category}:${featuredMode ? "featured" : "all"}`}
                items={visible}
                defaultOpenId={featuredMode ? visible[0]?.id : undefined}
              />
            ) : (
              <div className="border border-navy-900/15 bg-ivory p-8">
                <h3 className="h-display text-3xl">No matching questions.</h3>
                <p className="mt-3 text-navy-900/75">Try a different search, or ask our team directly.</p>
                <Link
                  href={FAQ_LINKS.contact}
                  className="mt-5 inline-flex min-h-11 items-center text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-navy-900 underline decoration-sand decoration-2 underline-offset-8"
                >
                  Ask a question
                </Link>
              </div>
            )}
          </div>

          {featuredMode && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="inline-flex min-h-11 items-center justify-center border border-navy-900/40 px-7 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-navy-900 transition-colors hover:border-navy-900 hover:bg-navy-900 hover:text-white"
              >
                Explore all {FAQS.length} questions
              </button>
            </div>
          )}

          {showAll && !searching && category === "All Questions" && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={backToFeatured}
                className="inline-flex min-h-11 items-center text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-navy-900 underline decoration-sand decoration-2 underline-offset-8 hover:text-brass"
              >
                Back to featured questions
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
