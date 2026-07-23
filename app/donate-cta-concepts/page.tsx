import type { Metadata } from "next";
import { ConceptLantern } from "./concept-lantern";
import { ConceptTurtleTrack } from "./concept-turtle-track";
import { ConceptConstellation } from "./concept-constellation";
import { ConceptRedTorch } from "./concept-red-torch";
import { ConceptWeight } from "./concept-weight";

export const metadata: Metadata = {
  title: "Donate CTA concepts — prototype",
  robots: { index: false, follow: false },
};

type Concept = {
  id: string;
  index: string;
  name: string;
  mechanic: string;
  lever: string;
};

const CONCEPTS: Concept[] = [
  {
    id: "turtle-track",
    index: "01",
    name: "Follow one turtle home",
    mechanic:
      "Scroll-driven satellite-telemetry chart. One tagged hatchling's 25-year loop draws across the Pacific and returns to the same beach.",
    lever: "Tangibility — a gift you can watch your money touch",
  },
  {
    id: "constellation",
    index: "03",
    name: "The constellation",
    mechanic:
      "A living night sky. Every gift is a star; new ones ignite in real time. Name your own light and watch it join the field.",
    lever: "Belonging — join something visibly built by others",
  },
  {
    id: "red-torch",
    index: "06",
    name: "The red torch",
    mechanic:
      "A pitch-black beach. Your cursor is a patrol torch; sweep it to find the nests hidden in the dark. Move your mouse across it.",
    lever: "Agency — you do the finding, exactly as the patrol does",
  },
  {
    id: "weight",
    index: "08",
    name: "The weight of a season",
    mechanic:
      "Scroll and hundreds of small gifts fly up and settle into the silhouette of a sea turtle — proof that small amounts compound.",
    lever: "Scale — how tiny gifts add up to a funded season",
  },
];

function ConceptFrame({ concept }: { concept: Concept }) {
  return (
    <div className="border-t border-[color:rgba(127,214,214,0.14)] px-6 py-8 sm:px-12">
      <div className="mx-auto flex max-w-[1380px] flex-wrap items-baseline gap-x-6 gap-y-2">
        <span className="font-mono text-[13px] tracking-[0.2em] text-[color:var(--glow)]">
          {concept.index}
        </span>
        <h2 className="font-header text-[clamp(1.3rem,2.4vw,2rem)] uppercase leading-none text-[color:var(--paper)]">
          {concept.name}
        </h2>
        <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.18em] text-[color:rgba(220,240,240,0.5)]">
          {concept.lever}
        </span>
      </div>
      <p className="mx-auto mt-3 max-w-[70ch] text-[14px] leading-relaxed text-[color:rgba(220,240,240,0.6)]">
        {concept.mechanic}
      </p>
    </div>
  );
}

export default function DonateCtaConceptsPage() {
  return (
    <main style={{ background: "var(--ink)" }} className="text-[color:var(--paper)]">
      {/* header */}
      <header className="px-6 pb-10 pt-20 sm:px-12">
        <div className="mx-auto max-w-[1380px]">
          <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-[color:var(--glow)]">
            Prototype · Tetiaroa Society
          </div>
          <h1 className="font-header mt-4 max-w-[18ch] text-[clamp(2.2rem,5vw,4.5rem)] uppercase leading-[0.92]">
            Four ways to ask
          </h1>
          <p className="font-display mt-5 max-w-[58ch] text-[clamp(1.05rem,1.8vw,1.5rem)] italic text-[color:rgba(220,240,240,0.7)]">
            Alternatives to the lantern sequence — each a different answer to the
            same question: what makes someone stop scrolling and give? Best viewed
            one at a time. Scroll into each; the red torch and the constellation
            want your mouse.
          </p>
        </div>
      </header>

      {/* the reimagining of the current live lantern sequence */}
      <section id="lantern">
        <div className="border-t border-[color:rgba(127,214,214,0.14)] px-6 py-8 sm:px-12">
          <div className="mx-auto flex max-w-[1380px] flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="font-mono text-[13px] tracking-[0.2em] text-[color:var(--flame)]">
              00
            </span>
            <h2 className="font-header text-[clamp(1.3rem,2.4vw,2rem)] uppercase leading-none text-[color:var(--paper)]">
              The lantern, reimagined
            </h2>
            <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.18em] text-[color:rgba(220,240,240,0.5)]">
              A fresh take on your current sequence
            </span>
          </div>
          <p className="mx-auto mt-3 max-w-[70ch] text-[14px] leading-relaxed text-[color:rgba(220,240,240,0.6)]">
            Same story beats and donation tiers as the live section — rebuilt as
            a moonlit ocean where a single lantern lifts off the water, throws its
            reflection across the moonpath, and multiplies into a drifting
            flotilla. Then you light your own. Scroll through it.
          </p>
        </div>
        <ConceptLantern />
      </section>

      {CONCEPTS.map((concept) => (
        <section key={concept.id} id={concept.id}>
          <ConceptFrame concept={concept} />
          {concept.id === "turtle-track" && <ConceptTurtleTrack />}
          {concept.id === "constellation" && <ConceptConstellation />}
          {concept.id === "red-torch" && <ConceptRedTorch />}
          {concept.id === "weight" && <ConceptWeight />}
        </section>
      ))}

      <footer className="border-t border-[color:rgba(127,214,214,0.14)] px-6 py-16 text-center sm:px-12">
        <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-[color:rgba(220,240,240,0.5)]">
          Prototypes — not wired to payments. Donate buttons link to /donate.
        </p>
      </footer>
    </main>
  );
}
