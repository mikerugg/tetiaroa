import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "History Section Chooser | Tetiaroa Society",
  description:
    "A consolidated chooser for the Tetiaroa Society homepage history section concept pages.",
};

type HistoryConceptLink = {
  title: string;
  href: string;
  image: string;
  note: string;
};

type HistoryConceptGroup = {
  label: string;
  href: string;
  summary: string;
  concepts: HistoryConceptLink[];
};

const groups: HistoryConceptGroup[] = [
  {
    label: "Archive Collage Set",
    href: "/brando-story",
    summary:
      "The first standalone Brando history explorations: sepia, archival, and documentary-led.",
    concepts: [
      {
        title: "Camera",
        href: "/brando-story/first-sight",
        image: "/story/history-camera-finds-tetiaroa.png",
        note: "Brando in the lagoon with the camera as the emotional anchor.",
      },
      {
        title: "Promise",
        href: "/brando-story/vow",
        image: "/story/history-promise-note.png",
        note: "A notebook, atoll map, and film reel as the protection promise.",
      },
      {
        title: "Living Archive",
        href: "/brando-story/work",
        image: "/story/history-living-archive.png",
        note: "Brando's legacy bridged into present-day fieldwork and education.",
      },
    ],
  },
  {
    label: "New History Section Set",
    href: "/history-section-concepts",
    summary:
      "A second standalone batch with quieter cinematic compositions and new story mechanics.",
    concepts: [
      {
        title: "Lagoon Witness",
        href: "/history-section-concepts/lagoon-witness",
        image: "/story/history-new-lagoon-witness.png",
        note: "A sparse first-sight horizon moment with Brando facing Tetiaroa.",
      },
      {
        title: "Archive Vow",
        href: "/history-section-concepts/archive-vow",
        image: "/story/history-new-archive-vow.png",
        note: "An evidence-table scene with portrait, camera, and atoll map.",
      },
      {
        title: "Living Handoff",
        href: "/history-section-concepts/living-handoff",
        image: "/story/history-new-living-handoff.png",
        note: "An archival-to-present handoff from Brando to Society stewardship.",
      },
    ],
  },
  {
    label: "Council-Approved Set",
    href: "/history-council-concepts",
    summary:
      "The latest batch shaped by copy, visual direction, frontend design, and storytelling review.",
    concepts: [
      {
        title: "After the Camera Left",
        href: "/history-council-concepts/after-camera-left",
        image: "/story/history-council-after-camera-left.png",
        note: "A projector contact sheet connecting Brando, Tetiaroa, and fieldwork.",
      },
      {
        title: "Changed by the Atoll",
        href: "/history-council-concepts/changed-by-the-atoll",
        image: "/story/history-council-changed-by-atoll.png",
        note: "A deed and map becoming reef: ownership transformed into care.",
      },
      {
        title: "Promise in the Work",
        href: "/history-council-concepts/promise-in-the-work",
        image: "/story/history-council-promise-work.png",
        note: "A dusk field station where Brando's promise becomes daily work.",
      },
    ],
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[#070604] text-[#fff7e8]">
      <section className="mx-auto flex min-h-[42vh] max-w-[1600px] flex-col justify-end px-[5vw] pb-12 pt-24">
        <div className="max-w-5xl">
          <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#d7b57e]">
            History section chooser
          </p>
          <h1 className="mt-5 max-w-4xl font-display text-6xl leading-[0.94] md:text-8xl">
            All Brando history section concepts in one place.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#fff7e8bf]">
            Use this as the quick navigation board for every standalone history
            section page currently in the app.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-[5vw] pb-20">
        <div className="grid gap-10">
          {groups.map((group) => (
            <section
              className="border-t border-[#d7b57e4d] pt-6"
              key={group.href}
            >
              <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#d7b57e]">
                    {group.label}
                  </p>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#fff7e8b8]">
                    {group.summary}
                  </p>
                </div>
                <Link
                  className="inline-flex w-fit items-center gap-3 font-display text-2xl text-[#fff7e8] transition hover:text-[#d7b57e]"
                  href={group.href}
                >
                  Open batch
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {group.concepts.map((concept) => (
                  <Link
                    className="group overflow-hidden border border-[#fff7e814] bg-white/[0.035] transition hover:border-[#d7b57e66] hover:bg-white/[0.07]"
                    href={concept.href}
                    key={concept.href}
                  >
                    <div className="relative aspect-[21/9] overflow-hidden bg-[#120d09]">
                      <Image
                        className="object-cover transition duration-500 group-hover:scale-[1.025]"
                        src={concept.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 29vw, 90vw"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_6_4/.02),rgb(7_6_4/.54))]" />
                    </div>
                    <div className="p-5">
                      <h2 className="font-display text-3xl leading-none">
                        {concept.title}
                      </h2>
                      <p className="mt-3 min-h-12 text-sm leading-6 text-[#fff7e8b8]">
                        {concept.note}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-3 font-display text-xl text-[#fff7e8]">
                        View
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
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
