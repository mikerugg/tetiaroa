import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, LeafIcon } from "lucide-react";
import type { GuideCard, GuideLocale, GuideRelatedStory } from "@/lib/atoll/types";
import { atollCopy } from "./atoll-copy";
import { GuideEntryLink } from "./guide-browse-navigation";

export function GuideEntryCard({ entry, eager = false }: { entry: GuideCard; eager?: boolean }) {
  return <article className="min-w-0">
    <GuideEntryLink href={entry.href} locale={entry.locale} className="group flex h-full flex-col gap-3.5 rounded-sm outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-muted">
        {entry.image ? <Image src={entry.image.url} alt={entry.image.alt || entry.title} fill loading={eager ? "eager" : "lazy"} sizes="(max-width: 767px) 50vw, (max-width: 1023px) 50vw, 33vw" className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]" /> : <div className="flex h-full items-center justify-center text-muted-foreground"><LeafIcon className="size-8" aria-hidden="true" /><span className="sr-only">{atollCopy[entry.locale].imageUnavailable}</span></div>}
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <h3 className="text-lg leading-snug font-medium text-foreground transition-colors group-hover:text-primary sm:text-xl">{entry.title}</h3>
        {entry.scientificName && <p className="text-xs leading-5 italic text-muted-foreground sm:text-sm">{entry.scientificName}</p>}
        {entry.localNames && <p className="truncate text-xs leading-5 text-muted-foreground">{entry.localNames}</p>}
      </div>
    </GuideEntryLink>
  </article>;
}

export function GuideRelatedReading({ stories, locale }: { stories: GuideRelatedStory[]; locale: GuideLocale }) {
  if (!stories.length) return null;
  const copy = atollCopy[locale];
  return <section className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-12" aria-labelledby="atoll-reading-title">
    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">{copy.readingEyebrow}</p>
    <h2 id="atoll-reading-title" className="mt-3 font-display text-3xl leading-tight text-foreground sm:text-4xl">{copy.readingTitle}</h2>
    <div className="mt-7 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
      {stories.map((story) => <article key={story.href} className="min-w-0">
        <Link href={story.href} className="group flex flex-col gap-4 outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">
          {story.image && <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-muted"><Image src={story.image.url} alt={story.image.alt} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]" /></div>}
          <h3 className="text-xl leading-snug font-medium text-foreground group-hover:text-primary">{story.title}</h3>
          {story.summary && <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{story.summary}</p>}
          <span className="flex items-center gap-2 text-sm text-primary">{copy.readStory}<ArrowRightIcon aria-hidden="true" className="size-4" /></span>
        </Link>
      </article>)}
    </div>
  </section>;
}
