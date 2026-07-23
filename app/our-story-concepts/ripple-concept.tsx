import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./concepts.module.css";

const ripplePoints = [
  {
    number: "01",
    label: "The inheritance",
    href: "/our-story#inheritance",
  },
  {
    number: "02",
    label: "The proposition",
    href: "/our-story#idea",
  },
  {
    number: "03",
    label: "The work",
    href: "/our-story#practice",
  },
  {
    number: "04",
    label: "The outward lesson",
    href: "/our-story#horizon",
  },
] as const;

export function RippleConcept() {
  return (
    <section
      id="ripple"
      className="relative isolate min-h-[100svh] overflow-hidden bg-background px-5 py-24 text-foreground sm:px-8 lg:px-12 lg:py-32"
      aria-labelledby="ripple-title"
    >
      <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_70%_42%,rgb(143_201_201_/_0.12),transparent_34%)]" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[calc(100svh-12rem)] max-w-[1600px] flex-col">
        <div className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary sm:text-xs">
              Concept 03 · The Ripple
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Tetiaroa stays at the center. The learning moves outward.
            </p>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            One atoll <span className="mx-2 text-primary">→</span> knowledge in motion
          </p>
        </div>

        <div className="grid flex-1 gap-12 py-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16">
          <div className="flex flex-col gap-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary sm:text-xs">
              Our story
            </p>
            <h2
              id="ripple-title"
              className="max-w-4xl font-header text-[clamp(5rem,9vw,10rem)] leading-[0.78]"
            >
              Begin with the island.
              <span className="block font-display text-[0.43em] font-normal italic leading-[1.12] text-primary">
                Carry the learning outward.
              </span>
            </h2>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Tetiaroa is not the backdrop to Brando’s proposition. It is the place that tests it—in what recovers, what endures, what is learned, and what other communities can adapt for home.
            </p>
            <Button asChild variant="impact" size="lg" className="h-auto w-fit rounded-full px-5 py-3">
              <Link href="/our-story">
                Follow the story outward
                <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="flex flex-col gap-8">
            <div className="relative mx-auto aspect-square w-full max-w-[42rem]">
              <div className="absolute inset-[7%] rounded-full border border-primary/25" aria-hidden="true" />
              <div className="absolute inset-[18%] rounded-full border border-primary/25" aria-hidden="true" />
              <div className="absolute inset-[29%] rounded-full border border-primary/30" aria-hidden="true" />
              <div className="absolute inset-[40%] rounded-full border border-primary/40" aria-hidden="true" />
              <div className="absolute inset-[7%]" aria-hidden="true">
                {[0, 1, 2, 3].map((ring) => (
                  <span
                    key={ring}
                    className={`${styles.rippleRing} absolute rounded-full border border-primary/35`}
                    style={{ inset: `${ring * 10}%` }}
                  />
                ))}
              </div>
              <div className="absolute inset-[34%] overflow-hidden rounded-full border border-primary/55 bg-muted shadow-[0_0_70px_rgb(143_201_201_/_0.2)]">
                <Image
                  src="/geology/tetiaroa-map.webp"
                  alt="Aerial map of Tetiaroa atoll at the center of expanding rings"
                  fill
                  sizes="(max-width: 767px) 32vw, 16vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-background/18" aria-hidden="true" />
              </div>
              <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/78 px-4 py-2 font-header text-2xl text-primary backdrop-blur-sm sm:text-4xl">
                Tetiaroa
              </p>
              <p className="absolute left-1/2 top-[4%] -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/62 sm:text-[10px]">
                culture + knowledge
              </p>
              <p className="absolute bottom-[4%] left-1/2 w-full -translate-x-1/2 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/62 sm:text-[10px]">
                learning adapted elsewhere
              </p>
            </div>

            <nav aria-label="Explore the four chapters of our story" className="grid gap-2 sm:grid-cols-2">
              {ripplePoints.map((point) => (
                <Link
                  key={point.number}
                  href={point.href}
                  className={`${styles.orbitPoint} flex min-h-14 items-center gap-3 rounded-full border border-border bg-card px-4 py-3 text-sm hover:border-primary/55 hover:bg-primary/10 focus-visible:border-primary`}
                >
                  <span className="font-header text-2xl text-primary/55">{point.number}</span>
                  <span className="font-display text-xl">{point.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
