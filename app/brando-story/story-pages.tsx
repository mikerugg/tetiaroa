import Image from "next/image";
import { Homemade_Apple } from "next/font/google";
import Link from "next/link";

import { BrandoPromiseNote } from "./brando-promise-note";
import styles from "./story-pages.module.css";

const handwriting = Homemade_Apple({
  subsets: ["latin"],
  weight: "400",
});

type StoryConcept = {
  slug: "first-sight" | "vow" | "work";
  variantClass: "firstSight" | "vow" | "work";
  navLabel: string;
  image: string;
  alt: string;
  title: string;
  intro: string;
  continuation: string;
  cta: string;
  quote?: string;
  promiseNote?: {
    lines: string[];
  };
};

const concepts: StoryConcept[] = [
  {
    slug: "first-sight",
    variantClass: "firstSight",
    navLabel: "Camera",
    image: "/story/history-camera-finds-tetiaroa.png",
    alt: "Archival sepia collage of Marlon Brando in a lagoon filming toward Tetiaroa.",
    title: "Marlon Brando",
    intro:
      "One of the world's most watched actors arrived in French Polynesia to make Mutiny on the Bounty. Away from the cameras, Tetiaroa met him differently: reef, motu, birds, turtles, and a lagoon quiet enough to make fame feel irrelevant.",
    continuation:
      "What began as wonder became responsibility. Brando acquired the atoll in 1967 and tied his name to its protection; Tetiaroa Society carries that vow forward through science, conservation, education, and stewardship.",
    cta: "Discover the story",
  },
  {
    slug: "vow",
    variantClass: "vow",
    navLabel: "Promise",
    image: "/story/history-promise-note.png",
    alt: "Archival collage of Marlon Brando beside a shoreline notebook, atoll sketch, and film reel.",
    title: "The Promise",
    intro:
      "The easy story is celebrity buys paradise. The truer story is harder and more useful: Brando loved Tetiaroa enough to understand that beauty alone would not save it.",
    continuation:
      "He wanted the atoll protected as a living system, not preserved as a postcard. Today the Society turns that promise into field research, habitat care, youth education, and decisions made for the island's future.",
    cta: "See how it continues",
  },
  {
    slug: "work",
    variantClass: "work",
    navLabel: "Living Mission",
    image: "/story/history-living-updated.png",
    alt: "Archival-to-present collage showing Marlon Brando, Tetiaroa, researchers, children, and a turtle.",
    title: "The work continues",
    intro:
      "Brando's story only matters if it keeps moving. Tetiaroa Society carries his protection mission from memory into practice: turtle monitoring, reef and lagoon science, education for young stewards, and care for the motu.",
    continuation:
      "The atoll remains the protagonist. The Society's work keeps asking the question Brando first faced: what does it mean to love a place enough to protect it?",
    cta: "Explore the mission",
    promiseNote: {
      lines: ["Tetiaroa", "must be protected", "for the future."],
    },
  },
];

const conceptLinks = concepts.map(({ slug, navLabel }) => ({
  href: `/brando-story/${slug}`,
  label: navLabel,
  slug,
}));

function ConceptNav({ current }: { current: StoryConcept["slug"] }) {
  return (
    <nav className={styles.nav} aria-label="Brando history concept options">
      <Link className={`${styles.brand} font-mono`} href="/">
        Tetiaroa Society
      </Link>
      <div className={styles.navLinks}>
        {conceptLinks.map((link) => (
          <Link
            aria-current={link.slug === current ? "page" : undefined}
            className="font-mono"
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

function ArchiveConcept({ concept }: { concept: StoryConcept }) {
  return (
    <main className={`${styles.page} ${styles[concept.variantClass]}`}>
      <ConceptNav current={concept.slug} />

      <section className={styles.section} aria-label="Tetiaroa Society history">
        <div className={styles.imageStage}>
          <Image
            className={styles.image}
            src={concept.image}
            alt={concept.alt}
            fill
            sizes="100vw"
            priority
          />
        </div>
        <div className={styles.veil} aria-hidden="true" />
        <div className={styles.texture} aria-hidden="true" />

        <div className={styles.copyWrap}>
          <div className={styles.copy}>
            <p className={`${styles.historyLabel} font-mono`}>Our History</p>
            <h1 className="font-display">{concept.title}</h1>
            <p>{concept.intro}</p>
            <p>{concept.continuation}</p>
            <Link className={`${styles.cta} font-display`} href="/impact">
              {concept.cta}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {concept.quote ? (
          <aside className={`${styles.quote} font-display`} aria-label="Story note">
            {concept.quote}
          </aside>
        ) : null}

        {concept.promiseNote ? (
          <BrandoPromiseNote
            className={`${styles.promiseNote} ${handwriting.className}`}
            lines={concept.promiseNote.lines}
          />
        ) : null}
      </section>
    </main>
  );
}

export function FirstSightStoryPage() {
  return <ArchiveConcept concept={concepts[0]} />;
}

export function VowStoryPage() {
  return <ArchiveConcept concept={concepts[1]} />;
}

export function WorkStoryPage() {
  return <ArchiveConcept concept={concepts[2]} />;
}
