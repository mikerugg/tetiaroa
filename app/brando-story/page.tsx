import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Brando Story Concepts | Tetiaroa Society",
  description:
    "Three standalone story concepts for the Tetiaroa Society homepage history section.",
};

const concepts = [
  {
    href: "/brando-story/first-sight",
    title: "Camera",
    copy: "A wide archival lagoon plate: Brando, the camera, and the moment Tetiaroa stops being a film location.",
  },
  {
    href: "/brando-story/vow",
    title: "Promise",
    copy: "A curator's table of film, notebook, atoll sketch, and the responsibility that grew out of Brando's relationship with the island.",
  },
  {
    href: "/brando-story/work",
    title: "Living Mission",
    copy: "An archival-to-present handoff from Brando's promise to field science, education, wildlife protection, and stewardship.",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[#041111] px-[7vw] py-24 text-[#fff8eb]">
      <div className="max-w-5xl">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#ffd89b]">
          Brando story concepts
        </p>
        <h1 className="mt-5 font-display text-6xl leading-[0.96] md:text-8xl">
          Three new cinematic candidates for the homepage history section.
        </h1>
      </div>
      <div className="mt-16 grid gap-px md:grid-cols-3">
        {concepts.map((concept) => (
          <Link
            className="border-t border-[#ffd89b55] bg-white/[0.04] p-8 transition hover:bg-white/[0.08]"
            href={concept.href}
            key={concept.href}
          >
            <h2 className="font-display text-4xl">{concept.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[#fff8ebbf]">
              {concept.copy}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
