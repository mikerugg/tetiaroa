import Image from "next/image";
import type { AtollHub, GuideCategory, GuideImage, GuideLocale } from "@/lib/atoll/types";
import { atollCopy } from "./atoll-copy";
import { GuideRelatedReading } from "./guide-cards";
import type { GuideDirectoryContext } from "./guide-directory";
import { GuideImageCredit, GuideResourceView } from "./guide-media";

function GuideContextIntroduction({ title, introduction, image, locale }: {
  title: string; introduction: string; image?: GuideImage; locale: GuideLocale;
}) {
  return <section className="flex flex-col gap-5 sm:flex-row sm:gap-8">
    {image && <figure className="w-full shrink-0 sm:w-56">
      <div className="relative aspect-[3/2] overflow-hidden rounded-sm bg-muted"><Image src={image.url} alt={image.alt} fill sizes="(max-width: 639px) 100vw, 224px" className="object-cover" /></div>
      <GuideImageCredit image={image} locale={locale} />
    </figure>}
    <div className="max-w-2xl">
      <h2 className="font-display text-2xl leading-tight sm:text-3xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-muted-foreground">{introduction}</p>
    </div>
  </section>;
}

/** Server-render the supporting material; the directory selects these slots as its filters change. */
export function createGuideDirectoryContext(categories: GuideCategory[], hub: AtollHub, locale: GuideLocale): GuideDirectoryContext {
  return {
    categories: Object.fromEntries(categories.map((category) => [category.id, {
      introduction: <GuideContextIntroduction key={`${category.id}-introduction`} title={category.title} introduction={category.introduction} image={category.image} locale={locale} />,
      resources: category.resources.length > 0 ? <section key={`${category.id}-resources`}>
        <h2 className="mb-5 text-xl font-semibold">{atollCopy[locale].resources}</h2>
        <div className="flex flex-col gap-5">{category.resources.map((resource) => <GuideResourceView key={resource.url} resource={resource} locale={locale} />)}</div>
      </section> : null,
      reading: <GuideRelatedReading key={`${category.id}-reading`} stories={category.relatedStories} locale={locale} />,
    }])),
    habitats: Object.fromEntries(hub.habitats.map((habitat) => [habitat.id, <GuideContextIntroduction key={habitat.id} title={habitat.title} introduction={habitat.introduction} image={habitat.image} locale={locale} />])),
    reading: <GuideRelatedReading key="guide-reading" stories={hub.relatedStories} locale={locale} />,
  };
}
