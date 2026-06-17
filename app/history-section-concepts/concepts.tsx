import Image from "next/image";
import Link from "next/link";

import styles from "./concepts.module.css";

type ConceptSlug = "lagoon-witness" | "archive-vow" | "living-handoff";

type HistoryConcept = {
  slug: ConceptSlug;
  variantClass: "lagoonWitness" | "archiveVow" | "livingHandoff";
  navLabel: string;
  title: string;
  image: string;
  alt: string;
  lead: string;
  body: string;
  artifact?: string;
};

export const historyConcepts: HistoryConcept[] = [
  {
    slug: "lagoon-witness",
    variantClass: "lagoonWitness",
    navLabel: "Lagoon Witness",
    title: "Tetiaroa found him.",
    image: "/story/history-new-lagoon-witness.png",
    alt: "Marlon Brando-like actor facing a quiet Tetiaroa atoll across a dawn lagoon.",
    lead:
      "Before Tetiaroa Society, there was a moment of recognition. Marlon Brando came to French Polynesia as one of the most watched actors in the world; Tetiaroa answered with reef, birds, lagoon, and silence.",
    body:
      "He later acquired the atoll in 1967, but the lasting story was not ownership. It was the obligation he felt to protect a living place. The Society carries that obligation forward through science, conservation, education, and stewardship.",
  },
  {
    slug: "archive-vow",
    variantClass: "archiveVow",
    navLabel: "Archive Vow",
    title: "Not paradise. A trust.",
    image: "/story/history-new-archive-vow.png",
    alt: "Archival table with a Brando-like portrait, vintage camera, atoll map, and conservation papers.",
    lead:
      "The easy version is a celebrity island story. The deeper version is a promise. Brando saw that Tetiaroa's beauty could invite admiration without protection, and admiration would not be enough.",
    body:
      "His relationship with the atoll became a responsibility to its reef, motu, wildlife, and cultural memory. Tetiaroa Society turns that promise into careful research, habitat protection, and young people learning why the atoll must endure.",
    artifact: "A place this alive has to be cared for as a future, not kept as a souvenir.",
  },
  {
    slug: "living-handoff",
    variantClass: "livingHandoff",
    navLabel: "Living Handoff",
    title: "The promise became fieldwork.",
    image: "/story/history-new-living-handoff.png",
    alt: "Marlon Brando-like archival image blending into Tetiaroa fieldwork with researchers, a child, and a turtle.",
    lead:
      "Brando's legacy matters because it did not stop with him. The mission now belongs to the people who keep returning to the reef, the lagoon, the classrooms, and the field notes.",
    body:
      "Tetiaroa Society carries his protection promise into daily practice: monitoring wildlife, studying the lagoon, restoring habitats, and teaching new stewards to love the atoll with the discipline protection requires.",
  },
];

const conceptLinks = historyConcepts.map(({ slug, navLabel }) => ({
  href: `/history-section-concepts/${slug}`,
  label: navLabel,
  slug,
}));

function getConcept(slug: ConceptSlug) {
  const concept = historyConcepts.find((item) => item.slug === slug);

  if (!concept) {
    throw new Error(`Unknown history concept: ${slug}`);
  }

  return concept;
}

function ConceptNav({ current }: { current: ConceptSlug }) {
  return (
    <nav className={styles.nav} aria-label="New history section concepts">
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

export function HistoryConceptSection({ slug }: { slug: ConceptSlug }) {
  const concept = getConcept(slug);

  return (
    <main className={`${styles.page} ${styles[concept.variantClass]}`}>
      <ConceptNav current={concept.slug} />
      <section className={styles.section} aria-label="Marlon Brando history concept">
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

        <div className={styles.copy}>
          <p className={`${styles.label} font-mono`}>Our History</p>
          <h1 className="font-display">{concept.title}</h1>
          <p>{concept.lead}</p>
          <p>{concept.body}</p>
          <Link className={`${styles.cta} font-display`} href="/impact">
            Discover the story
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {concept.artifact ? (
          <aside className={`${styles.artifact} font-display`}>
            {concept.artifact}
          </aside>
        ) : null}
      </section>
    </main>
  );
}
