import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { categoryLabels, getAtollPath, habitatLabels } from "@/lib/atoll/config";
import type { GuideLocale, GuidePlantFacts, GuideProfile } from "@/lib/atoll/types";
import { getGuideLegacyRedirect, getGuideProfile } from "@/lib/sanity/atoll";
import { cn } from "@/lib/utils";
import { atollCopy } from "./atoll-copy";
import { AtollBreadcrumbs, AtollShell } from "./atoll-shell";
import { BackToGuideResults } from "./guide-browse-navigation";
import { GuideRelatedReading } from "./guide-cards";
import { GuideBody, GuideImageCredit, GuidePhotograph, GuideResourceView } from "./guide-media";
import { atollMetadata } from "./metadata";
import { groupGuideBody } from "./profile-sections";

async function resolveProfile(locale: GuideLocale, category: string, slug: string) {
  const entry = await getGuideProfile(locale, category, slug);
  if (!entry) {
    const path = getAtollPath(locale, `${category}/${slug}`);
    const redirect = await getGuideLegacyRedirect(path);
    if (redirect && redirect !== path) permanentRedirect(redirect);
    notFound();
  }
  return entry;
}

export async function guideProfileMetadata(locale: GuideLocale, category: string, slug: string) {
  const entry = await resolveProfile(locale, category, slug);
  return atollMetadata({ locale, title: `${entry.title} · ${categoryLabels[locale][entry.category]}`, description: entry.summary, path: entry.href, alternatePath: entry.alternateHref ?? null, image: entry.image });
}

function ProfileFacts({ entry }: { entry: GuideProfile }) {
  const copy = atollCopy[entry.locale];
  const facts = (["family", "biogeographicalStatus", "lifeForm", "abundance", "ecosystem"] as const)
    .flatMap((key) => entry.plantFacts?.[key] ? [[key, entry.plantFacts[key]] as const] : []);
  if (!entry.localNames && !entry.otherNames && !entry.occurrence && !facts.length && !entry.habitats.length) return null;
  return <div className="mt-7 flex min-w-0 flex-col gap-4">
    <dl className="flex flex-col gap-4">
      {entry.localNames && <div><dt className="mb-1 text-xs text-muted-foreground">{copy.localNames}</dt><dd className="text-sm leading-6 text-foreground">{entry.localNames}</dd></div>}
      {entry.occurrence && <div><dt className="mb-1 text-xs text-muted-foreground">{copy.occurrence}</dt><dd className="text-sm leading-6 text-foreground">{entry.occurrence}</dd></div>}
      {entry.habitats.length > 0 && <div><dt className="mb-2 text-xs text-muted-foreground">{copy.habitat}</dt><dd className="flex flex-wrap gap-2">{entry.habitats.map((habitat) => <Badge key={habitat} variant="secondary" asChild><Link href={`${getAtollPath(entry.locale, "guide")}?habitat=${habitat}`}>{habitatLabels[entry.locale][habitat]}</Link></Badge>)}</dd></div>}
    </dl>
    {(entry.otherNames || facts.length > 0) && <Accordion type="single" collapsible>
      <AccordionItem value="profile-facts">
        <AccordionTrigger headingLevel={2}>{facts.length ? copy.plantFacts : copy.otherNames}</AccordionTrigger>
        <AccordionContent forceMount>
          <dl className="flex flex-col gap-4">
            {entry.otherNames && <div><dt className="mb-1 text-xs text-muted-foreground">{copy.otherNames}</dt><dd className="whitespace-pre-line text-sm leading-6 text-foreground">{entry.otherNames}</dd></div>}
            {facts.map(([key, value]) => <div key={key}><dt className="mb-1 text-xs text-muted-foreground">{copy[key as keyof GuidePlantFacts] ?? key}</dt><dd className="text-sm leading-6 text-foreground">{value}</dd></div>)}
          </dl>
        </AccordionContent>
      </AccordionItem>
    </Accordion>}
  </div>;
}

function ProfileDetails({ entry }: { entry: GuideProfile }) {
  const copy = atollCopy[entry.locale];
  const { introduction, sections } = groupGuideBody(entry.body);
  const media = entry.resources.filter((resource) => resource.kind === "audio" || resource.kind === "video");
  const sources = entry.resources.filter((resource) => resource.kind !== "audio" && resource.kind !== "video");
  const gallery = entry.gallery.filter((image) => image.url !== entry.image?.url);
  if (!entry.body.length && !media.length && !sources.length && !gallery.length) return null;
  return <section aria-labelledby="guide-profile-details" className="mx-auto mt-12 w-full max-w-3xl sm:mt-16">
    <h2 id="guide-profile-details" className="mb-5 text-xl font-semibold tracking-tight text-foreground">{copy.profileDetails}</h2>
    {introduction.length > 0 && <div className="mb-6"><GuideBody body={introduction} locale={entry.locale} /></div>}
    <Accordion type="multiple" defaultValue={sections[0] ? [sections[0].id] : []}>
      {sections.map((section) => <AccordionItem key={section.id} value={section.id}>
        <AccordionTrigger>{section.title}</AccordionTrigger>
        <AccordionContent forceMount><GuideBody body={section.blocks} locale={entry.locale} /></AccordionContent>
      </AccordionItem>)}
      {gallery.length > 0 && <AccordionItem value="photographs">
        <AccordionTrigger><span>{copy.gallery} <span className="text-muted-foreground">({gallery.length})</span></span></AccordionTrigger>
        <AccordionContent forceMount><div className="grid gap-6 sm:grid-cols-2">{gallery.map((image, index) => <GuidePhotograph key={`${image.url}-${index}`} image={image} locale={entry.locale} />)}</div></AccordionContent>
      </AccordionItem>}
      {media.length > 0 && <AccordionItem value="media">
        <AccordionTrigger>{copy.profileMedia}</AccordionTrigger>
        <AccordionContent forceMount><div className="flex flex-col gap-6">{media.map((resource, index) => <GuideResourceView key={`${resource.url}-${index}`} resource={resource} locale={entry.locale} />)}</div></AccordionContent>
      </AccordionItem>}
      {sources.length > 0 && <AccordionItem value="resources">
        <AccordionTrigger>{copy.resources}</AccordionTrigger>
        <AccordionContent forceMount><div className="flex flex-col gap-4">{sources.map((resource, index) => <GuideResourceView key={`${resource.url}-${index}`} resource={resource} locale={entry.locale} />)}</div></AccordionContent>
      </AccordionItem>}
    </Accordion>
  </section>;
}

export async function GuideProfilePage({ locale, category, slug }: { locale: GuideLocale; category: string; slug: string }) {
  const entry = await resolveProfile(locale, category, slug);
  const copy = atollCopy[locale];
  const fallbackHref = `${getAtollPath(locale, "guide")}?category=${entry.category}`;
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tetiaroasociety.org";
  const structuredData = { "@context": "https://schema.org", "@type": "Article", headline: entry.title, description: entry.summary, inLanguage: locale, url: new URL(entry.href, site).toString(), image: entry.image?.url, publisher: { "@type": "Organization", name: "Tetiaroa Society", url: site }, about: entry.scientificName ? { "@type": "Taxon", name: entry.scientificName, alternateName: entry.title } : undefined };
  return <AtollShell locale={locale} alternateHref={entry.alternateHref ?? getAtollPath(locale === "en" ? "fr" : "en", entry.category)}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <article className="mx-auto max-w-7xl px-5 pt-8 pb-12 sm:px-8 sm:pt-10 lg:px-12 lg:pb-16">
      <AtollBreadcrumbs locale={locale} items={[{ title: copy.guide, href: getAtollPath(locale, "guide") }, { title: categoryLabels[locale][entry.category], href: getAtollPath(locale, entry.category) }, { title: entry.title }]} />
      <div className="mb-7"><BackToGuideResults locale={locale} fallbackHref={fallbackHref} label={copy.backToResults} /></div>
      <header className={cn("grid items-start gap-x-8 gap-y-5 lg:gap-x-12", entry.image ? "lg:grid-cols-[1.08fr_1fr] lg:grid-rows-[auto_1fr]" : "max-w-3xl")}>
        <div className={cn("min-w-0 lg:pt-1", entry.image && "lg:col-start-2")}>
          <Link href={getAtollPath(locale, entry.category)} className="text-sm font-medium text-primary underline-offset-4 hover:underline">{categoryLabels[locale][entry.category]}</Link>
          <h1 className="mt-3 font-header text-[2.75rem] leading-[0.95] tracking-[-0.02em] text-foreground sm:text-[3.5rem] xl:text-[4rem]">{entry.title}</h1>
          {entry.scientificName && <p className="mt-2 text-base italic text-muted-foreground">{entry.scientificName}</p>}
        </div>
        {entry.image && <figure className="min-w-0 lg:col-start-1 lg:row-start-1 lg:row-span-2"><div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-muted"><Image src={entry.image.url} alt={entry.image.alt || entry.title} fill priority sizes="(max-width: 1023px) 100vw, 52vw" className="object-contain" /></div><GuideImageCredit image={entry.image} locale={locale} /></figure>}
        <div className={cn("min-w-0", entry.image && "lg:col-start-2")}>
          {entry.summary && <p className="max-w-xl text-base leading-7 text-foreground">{entry.summary}</p>}
          <ProfileFacts entry={entry} />
        </div>
      </header>
      <ProfileDetails entry={entry} />
      <Separator className="mt-12 mb-6" />
      <nav aria-label={copy.guide} className="flex flex-wrap items-center justify-between gap-3">
        <BackToGuideResults locale={locale} fallbackHref={fallbackHref} label={copy.backToResults} />
        <Button asChild variant="link"><Link href={getAtollPath(locale, "guide")}>{copy.browseAll}<ArrowRightIcon data-icon="inline-end" /></Link></Button>
      </nav>
    </article>
    <GuideRelatedReading stories={entry.relatedStories} locale={locale} />
  </AtollShell>;
}
