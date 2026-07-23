import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomeCopy } from "./home-copy";
import { HomeStoryHandoffScroll } from "./home-story-handoff-scroll";
import styles from "./home-story-handoff.module.css";

type HomeStoryHandoffProps = {
  copy: HomeCopy["story"];
};

export function HomeStoryHandoff({ copy }: HomeStoryHandoffProps) {
  return (
    <HomeStoryHandoffScroll>
      <div className={`${styles.past} absolute inset-0`} aria-hidden="true">
        <Image
          src="/story/history-new-lagoon-witness.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[66%_center]"
        />
      </div>
      <div className={`${styles.present} absolute inset-0`} aria-hidden="true">
        <Image
          src="/story/history-living-archive.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[58%_center]"
        />
      </div>
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_16_14_/_0.12)_0%,rgb(7_16_14_/_0.2)_44%,rgb(7_16_14_/_0.95)_100%)]"
        aria-hidden="true"
      />
      <div
        className={`${styles.seam} absolute inset-y-0 w-px bg-primary/75 shadow-[0_0_30px_var(--primary)]`}
        aria-hidden="true"
      />
      <p className="sr-only">{copy.transitionDescription}</p>

      <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-between px-5 pb-8 pt-20 sm:px-8 sm:pb-10 sm:pt-24 lg:px-12">
        <div className="flex justify-end">
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55 md:block">
            {copy.timelineStart}{" "}
            <span className="mx-2 text-primary" aria-hidden="true">
              →
            </span>{" "}
            {copy.timelineEnd}
          </p>
        </div>

        <div className="max-w-5xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary sm:text-xs">
            {copy.sectionLabel}
          </p>
          <h2
            id="home-story-title"
            className="mt-3 font-header text-[clamp(3.6rem,8.2vw,8.5rem)] leading-[0.76] tracking-[-0.02em]"
          >
            {copy.title}
            <span className="block font-display text-[0.4em] font-normal italic leading-[1.05] text-primary">
              {copy.titleAccent}
            </span>
          </h2>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-2xl text-base leading-7 text-foreground/76 sm:text-lg sm:leading-8">
              {copy.body}
            </p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-auto w-fit rounded-full bg-background/35 px-5 py-3 backdrop-blur-sm"
            >
              <Link href={copy.ctaHref}>
                {copy.cta}
                <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </HomeStoryHandoffScroll>
  );
}
