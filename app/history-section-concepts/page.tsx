import type { Metadata } from "next";
import Link from "next/link";

import { historyConcepts } from "./concepts";

export const metadata: Metadata = {
  title: "New History Section Concepts | Tetiaroa Society",
  description:
    "Three new standalone homepage history section concepts for Tetiaroa Society.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#100a06] px-[7vw] py-24 text-[#fff7e8]">
      <div className="max-w-5xl">
        <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#d4b17c]">
          New history section concepts
        </p>
        <h1 className="mt-5 max-w-4xl font-display text-6xl leading-[0.94] md:text-8xl">
          Three untouched standalone directions.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-[#fff7e8bf]">
          These live outside the current homepage and outside the existing
          Brando concept routes, so each can be judged on its own.
        </p>
      </div>

      <div className="mt-16 grid gap-px md:grid-cols-3">
        {historyConcepts.map((concept) => (
          <Link
            className="group border-t border-[#d4b17c55] bg-white/[0.04] p-7 transition hover:bg-white/[0.08]"
            href={`/history-section-concepts/${concept.slug}`}
            key={concept.slug}
          >
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#d4b17c]">
              {concept.navLabel}
            </p>
            <h2 className="mt-5 font-display text-4xl leading-none">
              {concept.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#fff7e8b8]">
              {concept.lead}
            </p>
            <span className="mt-8 inline-flex items-center gap-4 font-display text-2xl">
              Open
              <span
                className="transition group-hover:translate-x-1"
                aria-hidden="true"
              >
                &rarr;
              </span>
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
