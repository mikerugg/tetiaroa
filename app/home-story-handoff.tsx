import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomeCopy } from "./home-copy";
import { HomeStoryVideo } from "./home-story-video";

type HomeStoryHandoffProps = {
  copy: HomeCopy["story"];
};

export function HomeStoryHandoff({ copy }: HomeStoryHandoffProps) {
  return (
    <section
      id="our-story"
      className="relative isolate scroll-mt-[var(--site-header-height,3.5rem)]! overflow-hidden border-y-50 border-black bg-black text-foreground lg:border-y-100"
      aria-labelledby="home-story-title"
    >
      <div className="relative aspect-[4/3] lg:absolute lg:inset-0 lg:aspect-auto">
        <HomeStoryVideo />
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black via-black/10 to-black/10 lg:via-black/25"
          aria-hidden="true"
        />
      </div>

      <div className="pointer-events-none relative mx-auto -mt-8 flex max-w-[1600px] flex-col justify-end px-5 pb-10 lg:mt-0 lg:min-h-[calc(var(--viewport-safe-height,100svh)-var(--site-header-height,3.5rem))] lg:px-12 lg:pt-32">
        <div className="pointer-events-auto max-w-5xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary lg:text-xs">
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
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-2xl text-base leading-7 text-foreground/76 lg:text-lg lg:leading-8">
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
    </section>
  );
}
