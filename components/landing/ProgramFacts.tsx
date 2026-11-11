import Link from "next/link";
import { course, curriculum, included } from "../../lib/course";

// The real facts of the YB Learn program, for the landing pages that talk about
// it. Everything comes from lib/course.ts, the same source as the /learn page,
// so the two can never disagree.
export function ProgramFacts() {
  return (
    <div className="mt-10 border border-navy-900/15 bg-white p-6 sm:p-8">
      <p className="eyebrow">THE PROGRAM</p>
      <p className="h-display mt-3 text-2xl sm:text-3xl">{course.title}</p>

      <ol className="mt-6 grid gap-x-8 sm:grid-cols-2">
        {curriculum.map((row, i) => (
          <li key={row.phase} className="border-t border-navy-900/15 py-4">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-navy-700">
              Phase {i + 1} · Modules {row.modules}
            </p>
            <p className="h-display mt-2 text-xl">{row.phase}</p>
            <p className="mt-1 text-sm text-navy-900/70">{row.focus}</p>
          </li>
        ))}
      </ol>

      <ul className="mt-2 space-y-2 border-t border-navy-900/15 pt-5 text-sm leading-relaxed text-navy-900/80">
        {included.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden className="mt-[0.6em] h-px w-4 shrink-0 bg-brass" />
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-5 text-xs leading-relaxed text-navy-900/60">{course.credentialNote}</p>

      <Link
        href="/learn"
        className="mt-5 inline-flex min-h-11 items-center text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-navy-900 underline decoration-sand decoration-2 underline-offset-8 hover:decoration-navy-900"
      >
        See the full program
      </Link>
    </div>
  );
}
