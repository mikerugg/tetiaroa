import Image from "next/image";
import Link from "next/link";

import styles from "./council-concepts.module.css";

type ConceptSlug =
  | "after-camera-left"
  | "changed-by-the-atoll"
  | "promise-in-the-work";

type CouncilConcept = {
  slug: ConceptSlug;
  variantClass: "afterCamera" | "changedAtoll" | "promiseWork";
  navLabel: string;
  image: string;
  alt: string;
  title: string;
  lead: string;
  body: string;
  cta: string;
  motif: string;
};

export const councilConcepts: CouncilConcept[] = [
  {
    slug: "after-camera-left",
    variantClass: "afterCamera",
    navLabel: "After the Camera",
    image: "/story/history-council-after-camera-left.png",
    alt: "A cinematic film strip showing Marlon Brando, Tetiaroa, and present-day fieldwork.",
    title: "The cameras left. The promise stayed.",
    lead:
      "Marlon Brando came to French Polynesia as one of the most recognizable actors in the world. Tetiaroa first appeared at the edge of a production, then became the place that would not leave him.",
    body:
      "The atoll was not scenery. Reef, lagoon, motu, birds, and turtles made a living world that could be admired carelessly or protected with discipline. Tetiaroa Society carries that promise forward through research, conservation, education, and stewardship.",
    cta: "Follow the promise",
    motif: "Projector / contact sheet / living frame",
  },
  {
    slug: "changed-by-the-atoll",
    variantClass: "changedAtoll",
    navLabel: "Changed by the Atoll",
    image: "/story/history-council-changed-by-atoll.png",
    alt: "A deed and atoll map transforming into coral reef and lagoon beside a contemplative Brando-like figure.",
    title: "Beauty was not enough.",
    lead:
      "Brando acquired Tetiaroa in 1967, but the meaningful turn was not possession. The island changed his idea of what it meant to hold a place in your life.",
    body:
      "He saw that admiration could still leave a living world vulnerable. Protection had to become the answer. Today the Society keeps that answer active through science, habitat care, education, and decisions made for the atoll's future.",
    cta: "See the mission",
    motif: "Deed becoming reef / ownership becoming care",
  },
  {
    slug: "promise-in-the-work",
    variantClass: "promiseWork",
    navLabel: "Promise in the Work",
    image: "/story/history-council-promise-work.png",
    alt: "A dusk Tetiaroa field station with Brando projected at left and researchers, children, and a turtle at right.",
    title: "A promise is only real in the work.",
    lead:
      "On Tetiaroa, Brando's lasting legacy is not celebrity. It is the question he left behind: what does it mean to love a place enough to protect it after you are gone?",
    body:
      "Tetiaroa Society answers in field notebooks, turtle monitoring, reef study, classrooms, and long-term stewardship. What began as one person's vow now belongs to everyone working for Tetiaroa's future.",
    cta: "Meet the work",
    motif: "Lantern field station / projected memory / active stewardship",
  },
];

const links = councilConcepts.map(({ slug, navLabel }) => ({
  href: `/history-council-concepts/${slug}`,
  label: navLabel,
  slug,
}));

function getConcept(slug: ConceptSlug) {
  const concept = councilConcepts.find((item) => item.slug === slug);

  if (!concept) {
    throw new Error(`Unknown council concept: ${slug}`);
  }

  return concept;
}

function CouncilNav({ current }: { current: ConceptSlug }) {
  return (
    <nav className={styles.nav} aria-label="Council-approved history concepts">
      <Link className={`${styles.brand} font-mono`} href="/">
        Tetiaroa Society
      </Link>
      <div className={styles.navLinks}>
        {links.map((link) => (
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

export function CouncilHistorySection({ slug }: { slug: ConceptSlug }) {
  const concept = getConcept(slug);

  return (
    <main className={`${styles.page} ${styles[concept.variantClass]}`}>
      <CouncilNav current={concept.slug} />
      <section className={styles.section} aria-label="Council history concept">
        <Image
          className={styles.image}
          src={concept.image}
          alt={concept.alt}
          fill
          sizes="100vw"
          priority
        />
        <div className={styles.veil} aria-hidden="true" />
        <div className={styles.grain} aria-hidden="true" />
        <div className={styles.motionLayer} aria-hidden="true" />

        <div className={styles.copy}>
          <p className={`${styles.label} font-mono`}>Our History</p>
          <h1 className="font-display">{concept.title}</h1>
          <p>{concept.lead}</p>
          <p>{concept.body}</p>
          <Link className={`${styles.cta} font-display`} href="/impact">
            {concept.cta}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <p className={`${styles.motif} font-mono`}>{concept.motif}</p>
      </section>
    </main>
  );
}
