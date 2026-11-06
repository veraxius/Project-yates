import type { Metadata } from "next";
import { Reveal } from "../../components/Reveal";
import { resourceGroups } from "../../lib/resources";

export const metadata: Metadata = {
  title: "Resources",
  description: "Forms, templates and documents that yacht brokers can use.",
};

export default function ResourcesPage() {
  const groups = resourceGroups.filter((g) => g.items.length > 0);

  return (
    <>
      <section className="bg-navy-950 py-16 text-white sm:py-20 lg:py-24">
        <div className="container-x">
          <p className="eyebrow !text-sand">FOR BROKERS</p>
          <h1 className="h-display mt-5 text-[clamp(2.5rem,8vw,5rem)]">RESOURCES</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/75 sm:text-xl">
            Forms, templates, and documents that brokers can use.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20 lg:py-24">
        <div className="container-x">
          {groups.length === 0 ? (
            <Reveal className="mx-auto max-w-2xl border border-navy-900/15 bg-ivory p-8 text-center sm:p-12">
              <p className="eyebrow">COMING SOON</p>
              <p className="h-display mt-4 text-3xl sm:text-4xl">Documents will be available here.</p>
              <p className="mt-4 leading-relaxed text-navy-900/70">
                We are preparing the forms and templates. Check back soon.
              </p>
            </Reveal>
          ) : (
            <div className="space-y-16">
              {groups.map((group) => (
                <Reveal key={group.name}>
                  <h2 className="h-display text-3xl sm:text-4xl">{group.name}</h2>
                  <p className="mt-2 text-navy-900/70">{group.blurb}</p>
                  <ul className="mt-6 divide-y divide-navy-900/15 border-y border-navy-900/15">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          download
                          className="group flex min-h-11 items-center justify-between gap-4 py-5 transition-colors hover:text-navy-700"
                        >
                          <span className="min-w-0">
                            <span className="block text-lg font-medium leading-snug">{item.title}</span>
                            {item.description && (
                              <span className="mt-1 block text-sm leading-relaxed text-navy-900/65">
                                {item.description}
                              </span>
                            )}
                          </span>
                          <span className="flex shrink-0 items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-navy-700">
                            {item.format}
                            <svg
                              aria-hidden
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              className="transition-transform duration-300 group-hover:translate-y-0.5"
                            >
                              <path d="M8 1v10M4 7l4 4 4-4M2 14h12" stroke="currentColor" strokeWidth="1.3" />
                            </svg>
                            <span className="sr-only">Download</span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
