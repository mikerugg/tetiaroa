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
      <div className="relative aspect-[4/3] lg:absolute lg:inset-x-0 lg:top-0 lg:bottom-[100px] lg:aspect-auto">
        <div className="absolute inset-x-0 inset-y-[10%]">
          <HomeStoryVideo />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black via-black/10 to-black/10 lg:via-black/25"
          aria-hidden="true"
        />
      </div>

      <div className="pointer-events-none relative mx-auto -mt-8 flex max-w-[1600px] flex-col justify-end px-5 pb-10 pt-[100px] lg:mt-0 lg:min-h-[calc(var(--viewport-safe-height,100svh)-var(--site-header-height,3.5rem)+100px)] lg:pl-12 lg:pr-40 lg:pt-32">
        <div className="pointer-events-auto w-full -translate-y-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary lg:text-xs">
            {copy.sectionLabel}
          </p>
          <h2
            id="home-story-title"
            className="mt-3 max-w-5xl font-header text-[clamp(3.6rem,8.2vw,8.5rem)] leading-[0.76] tracking-[-0.02em]"
          >
            {copy.title}
          </h2>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
            <p className="min-w-0 font-display text-[clamp(1.44rem,3.28vw,3.4rem)] font-normal italic leading-[1.05] tracking-[-0.02em] text-primary">
              {copy.titleAccent}
            </p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-auto min-h-12 w-full max-w-80 shrink-0 gap-3 whitespace-normal rounded-full px-5 py-3 has-data-[icon=inline-end]:pr-5 lg:w-80"
            >
              <Link href={copy.ctaHref}>
                <span className="text-left">{copy.cta}</span>
                <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
