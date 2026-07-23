import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./concepts.module.css";

const ledgerEntries = [
  {
    promise: "An ecological model",
    practice: "Steward the whole atoll",
    note: "A reef cannot be protected apart from its lagoon, motu, wildlife, culture, or human use.",
  },
  {
    promise: "A marine preserve",
    practice: "Restore, monitor, adjust",
    note: "Biosecurity and habitat recovery matter only if monitoring shows what is working—and what is not.",
  },
  {
    promise: "A place for research",
    practice: "Make room for hard questions",
    note: "A field station, sustained observation, and evidence strong enough to change the next decision.",
  },
  {
    promise: "A lesson beyond one island",
    practice: "Share methods, not prescriptions",
    note: "Education and partnerships carry the learning outward; each community adapts it to its own place.",
  },
] as const;

export function LedgerConcept() {
  return (
    <section
      id="ledger"
      className="bg-[var(--paper)] px-5 py-24 text-[var(--ink)] sm:px-8 lg:px-12 lg:py-32"
      aria-labelledby="ledger-title"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-4 border-b border-[rgb(7_16_14_/_0.18)] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--lagoon)] sm:text-xs">
              Concept 02 · The Promise Ledger
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[rgb(7_16_14_/_0.62)]">
              Put the aspiration on one side. Put the evidence of practice on the other.
            </p>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[rgb(7_16_14_/_0.48)]">
            Promise <span className="mx-2 text-[var(--lagoon)]">/</span> practice
          </p>
        </div>

        <div className="grid gap-14 py-16 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20 lg:py-24">
          <div className="flex flex-col gap-8">
            <figure className="relative aspect-[1.45/1] overflow-hidden rounded-2xl bg-[rgb(7_16_14_/_0.08)] shadow-[0_24px_70px_rgb(7_16_14_/_0.18)] lg:rotate-[-1.5deg]">
              <Image
                src="/story/history-new-archive-vow.png"
                alt="Illustrative archive composition of Marlon Brando, a camera, and a hand-drawn map of Tetiaroa"
                fill
                sizes="(max-width: 1023px) 100vw, 42vw"
                className="object-cover object-[68%_center]"
              />
            </figure>
            <blockquote>
              <p className="font-display text-[clamp(2.8rem,5vw,5.7rem)] leading-[0.96]">
                “It is my hope that the island will serve as an ecological model…”
              </p>
              <footer className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--lagoon)] sm:text-xs">
                — Marlon Brando
              </footer>
            </blockquote>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--lagoon)] sm:text-xs">
              Our story
            </p>
            <h2
              id="ledger-title"
              className="mt-5 max-w-4xl font-header text-[clamp(4.4rem,8vw,9rem)] leading-[0.8]"
            >
              If the promise is real, it leaves a record.
            </h2>

            <ol className="mt-12 border-t border-[rgb(7_16_14_/_0.18)]">
              {ledgerEntries.map((entry, index) => (
                <li
                  key={entry.promise}
                  className={`${styles.ledgerRow} relative grid gap-4 border-b border-[rgb(7_16_14_/_0.18)] py-7 sm:grid-cols-[2.2rem_0.8fr_1.2fr] sm:items-start sm:gap-6`}
                >
                  <span className="font-header text-3xl text-[rgb(31_107_110_/_0.48)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[rgb(7_16_14_/_0.48)]">
                      The promise
                    </p>
                    <p className="mt-2 font-display text-2xl leading-none sm:text-3xl">{entry.promise}</p>
                  </div>
                  <div className={styles.ledgerAnswer}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--lagoon)]">
                      The practice
                    </p>
                    <p className="mt-2 font-display text-2xl leading-none sm:text-3xl">{entry.practice}</p>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-[rgb(7_16_14_/_0.62)]">{entry.note}</p>
                  </div>
                </li>
              ))}
            </ol>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="mt-10 h-auto rounded-full border-[rgb(7_16_14_/_0.28)] bg-transparent px-5 py-3 text-[var(--ink)] hover:bg-[rgb(7_16_14_/_0.08)] hover:text-[var(--ink)]"
            >
              <Link href="/our-story">
                See the work behind the promise
                <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
