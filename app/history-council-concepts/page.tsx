import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { councilConcepts } from "./council-concepts";

export const metadata: Metadata = {
  title: "Council History Concepts | Tetiaroa Society",
  description:
    "Three new council-approved standalone history section concepts for Tetiaroa Society.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#070604] px-[7vw] py-24 text-[#fff7e8]">
      <div className="max-w-5xl">
        <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#d7b57e]">
          Council-approved history concepts
        </p>
        <h1 className="mt-5 max-w-4xl font-display text-6xl leading-[0.94] md:text-8xl">
          Three new sections, built apart from the current site.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-[#fff7e8bf]">
          The copy, visual direction, frontend approach, and story arc were
          reviewed before implementation. These routes do not replace the
          homepage or any existing history concept.
        </p>
      </div>

      <div className="mt-16 grid gap-4 lg:grid-cols-3">
        {councilConcepts.map((concept) => (
          <Link
            className="group block border-t border-[#d7b57e55] bg-white/[0.04] transition hover:bg-white/[0.08]"
            href={`/history-council-concepts/${concept.slug}`}
            key={concept.slug}
          >
            <div className="relative aspect-[21/9] overflow-hidden">
              <Image
                className="object-cover transition duration-500 group-hover:scale-[1.025]"
                src={concept.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 29vw, 86vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_6_4/.04),rgb(7_6_4/.56))]" />
            </div>
            <div className="p-7">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#d7b57e]">
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
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
