"use client";

import { useEffect, useState } from "react";
import { Box, Button, Flex, Spinner, Stack, Text } from "@sanity/ui";
import { EyeIcon } from "lucide-react";
import { useClient, type DocumentActionDescription, type DocumentActionProps } from "sanity";
import { GuideBody, GuidePhotograph, GuideResourceView } from "@/app/atoll/guide-media";
import { safeGuideHref } from "@/app/atoll/media-utils";
import { getAtollPath } from "@/lib/atoll/config";
import { guideCategories, type GuideBodyBlock, type GuideCategoryId, type GuideExperience, type GuideImage, type GuideLocale, type GuidePlantFacts, type GuideResource } from "@/lib/atoll/types";
import { sanityApiVersion } from "@/lib/sanity/env";
import { atollCopy } from "@/app/atoll/atoll-copy";
import { guideBodyProjection } from "@/lib/atoll/projections";

type PreviewEntryLocale = { title?: string; summary?: string; image?: GuideImage };
type PreviewEntry = { _id: string; category?: string; slug?: string; scientificName?: string; english?: PreviewEntryLocale; french?: PreviewEntryLocale };
type PreviewStory = { englishTitle?: string; frenchTitle?: string; englishSlug?: string; frenchSlug?: string; englishSummary?: string; frenchSummary?: string; imageUrl?: string };
type PreviewContent = {
  title?: string; summary?: string; introduction?: string; body?: GuideBodyBlock[]; localNames?: string; otherNames?: string; occurrence?: string;
  plantFacts?: GuidePlantFacts; gallery?: GuideImage[]; resources?: GuideResource[]; subgroups?: { id: string; title: string }[];
  habitats?: { id: string; title: string; introduction: string; image?: GuideImage; featuredEntries?: (PreviewEntry | null)[] }[];
  experiences?: Partial<GuideExperience>[];
};
type PreviewRecord = { _type: string; category?: string; slug?: string; english?: PreviewContent; french?: PreviewContent; scientificName?: string; image?: GuideImage; featuredEntries?: (PreviewEntry | null)[]; relatedStories?: (PreviewStory | null)[] };

const standaloneImageProjection = `{..., "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height}`;
const galleryImageProjection = `{..., "url": image.asset->url, "width": image.asset->metadata.dimensions.width, "height": image.asset->metadata.dimensions.height}`;
const entryLocaleProjection = `{title, summary, "image": gallery[0]${galleryImageProjection}}`;
const entryProjection = `{_id, category, "slug": slug.current, scientificName, english${entryLocaleProjection}, french${entryLocaleProjection}}`;
const storyProjection = `{
  "englishTitle": coalesce(english.title, select(coalesce(language, "en") != "fr" => title)),
  "frenchTitle": coalesce(french.title, select(language == "fr" => title)),
  "englishSlug": coalesce(english.slug.current, select(coalesce(language, "en") != "fr" => slug.current)),
  "frenchSlug": coalesce(french.slug.current, select(language == "fr" => slug.current)),
  "englishSummary": coalesce(english.summary, summary), "frenchSummary": coalesce(french.summary, summary),
  "imageUrl": coalesce(english.heroImage.asset->url, french.heroImage.asset->url, heroImage.asset->url, english.gallery[0].image.asset->url, gallery[0].image.asset->url)
}`;
const localeProjection = `{
  ..., "body": body${guideBodyProjection}, "gallery": gallery[]${galleryImageProjection},
  "resources": resources[]{..., "url": coalesce(file.asset->url, url)},
  "habitats": habitats[]{..., "image": image${standaloneImageProjection}, "featuredEntries": featuredEntries[]->${entryProjection}},
  "experiences": experiences[]{..., "image": image${standaloneImageProjection}}
}`;
export const atollPreviewQuery = `*[_id == $id][0]{
  _type, category, "slug": slug.current, scientificName, "image": image${standaloneImageProjection},
  english${localeProjection}, french${localeProjection},
  "featuredEntries": featuredEntries[]->${entryProjection}, "relatedStories": relatedStories[]->${storyProjection}
}`;

export function getAtollPreviewHref(record: Pick<PreviewRecord, "_type" | "category" | "slug">, locale: GuideLocale) {
  if (record._type === "atollHub") return getAtollPath(locale);
  if (!guideCategories.includes(record.category as GuideCategoryId)) return undefined;
  if (record._type === "atollCategory") return getAtollPath(locale, record.category);
  return record._type === "speciesGuide" && record.slug ? getAtollPath(locale, `${record.category}/${record.slug}`) : undefined;
}

function PreviewEntries({ entries, locale }: { entries: (PreviewEntry | null)[]; locale: GuideLocale }) {
  const localized = entries.flatMap((entry) => {
    if (!entry) return [];
    const content = locale === "fr" ? entry.french : entry.english;
    const href = getAtollPreviewHref({ ...entry, _type: "speciesGuide" }, locale);
    return content?.title && href ? [{ id: entry._id, title: content.title, image: content.image, scientificName: entry.scientificName, href }] : [];
  }).filter((entry, index, all) => all.findIndex((other) => other.id === entry.id) === index);
  if (!localized.length) return null;
  return <ul className="grid gap-5 sm:grid-cols-3">{localized.map((entry) => <li key={entry.id} className="flex flex-col gap-2">
    {entry.image?.url && <GuidePhotograph image={entry.image} locale={locale} />}
    <a href={entry.href} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-4">{entry.title}</a>
    {entry.scientificName && <p className="text-sm italic text-muted-foreground">{entry.scientificName}</p>}
  </li>)}</ul>;
}

export function AtollPreviewContent({ record, locale }: { record: PreviewRecord; locale: GuideLocale }) {
  const content = locale === "fr" ? record.french : record.english;
  const copy = atollCopy[locale];
  const href = getAtollPreviewHref(record, locale);
  const relatedStories = (record.relatedStories ?? []).flatMap((story) => {
    if (!story) return [];
    const title = locale === "fr" ? story.frenchTitle : story.englishTitle;
    const slug = locale === "fr" ? story.frenchSlug : story.englishSlug;
    return title && slug ? [{ title, href: `${locale === "fr" ? "/fr" : ""}/impact/${slug}`, summary: locale === "fr" ? story.frenchSummary : story.englishSummary, imageUrl: story.imageUrl }] : [];
  }).filter((story, index, all) => all.findIndex((other) => other.href === story.href) === index);
  return <div lang={locale} className="max-h-[78vh] overflow-auto bg-background px-6 py-10 font-sans text-foreground">
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      {href && <a href={href} target="_blank" rel="noopener noreferrer" className="self-start text-sm text-primary underline underline-offset-4">{locale === "fr" ? "Ouvrir la page publique" : "Open public page"}</a>}
      <h1 className="text-3xl font-semibold tracking-tight">{content?.title ?? (locale === "fr" ? "Traduction à compléter" : "Translation not yet written")}</h1>
      {record.scientificName && <p className="text-base italic">{record.scientificName}</p>}
      {content?.localNames && <p>{content.localNames}</p>}
      {(content?.summary || content?.introduction) && <p className="text-base leading-7">{content.summary ?? content.introduction}</p>}
      {record.image?.url && <GuidePhotograph image={record.image} locale={locale} />}
      {content?.occurrence && <p>{content.occurrence}</p>}
      {content?.otherNames && <p>{content.otherNames}</p>}
      {content?.plantFacts && <dl className="grid grid-cols-2 gap-3">{(["family", "biogeographicalStatus", "lifeForm", "abundance", "ecosystem"] as const).filter((label) => content.plantFacts?.[label]).map((label) => <div key={label}><dt className="text-sm text-muted-foreground">{copy[label]}</dt><dd>{content.plantFacts?.[label]}</dd></div>)}</dl>}
      {!!content?.subgroups?.length && <section><h2 className="mb-3 text-xl font-semibold">{copy.subgroup}</h2><ul className="flex flex-wrap gap-4">{content.subgroups.map((group) => <li key={group.id}>{group.title}</li>)}</ul></section>}
      {content?.body && <GuideBody body={content.body} locale={locale} />}
      {content?.habitats?.map((habitat) => <section key={habitat.id} className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{habitat.title}</h2>
        {habitat.image?.url && <GuidePhotograph image={habitat.image} locale={locale} />}
        {habitat.introduction && <p>{habitat.introduction}</p>}
        {!!habitat.featuredEntries?.length && <PreviewEntries entries={habitat.featuredEntries} locale={locale} />}
      </section>)}
      {!!content?.experiences?.length && <section className="flex flex-col gap-5"><h2 className="text-xl font-semibold">{copy.foundationTitle}</h2>{content.experiences.map((experience, index) => <article key={`${experience.href}-${index}`} className="flex flex-col gap-3">
        {experience.image?.url && <GuidePhotograph image={experience.image} locale={locale} />}
        {experience.title && <h3 className="text-lg font-semibold">{experience.title}</h3>}
        {experience.description && <p>{experience.description}</p>}
        {experience.href && safeGuideHref(experience.href) && <a href={experience.href} target="_blank" rel="noopener noreferrer" className="self-start text-primary underline underline-offset-4">{experience.linkLabel || experience.title || copy.openMedia}</a>}
      </article>)}</section>}
      {!!record.featuredEntries?.length && <section className="flex flex-col gap-4"><h2 className="text-xl font-semibold">{locale === "fr" ? "Fiches à la une" : "Featured profiles"}</h2><PreviewEntries entries={record.featuredEntries} locale={locale} /></section>}
      {content?.gallery?.filter((image) => image?.url).map((image, index) => <GuidePhotograph key={`${image.url}-${index}`} image={image} locale={locale} />)}
      {content?.resources?.filter((resource) => resource?.url).map((resource, index) => <GuideResourceView key={`${resource.url}-${index}`} resource={resource} locale={locale} />)}
      {!!relatedStories.length && <section className="flex flex-col gap-5"><h2 className="text-xl font-semibold">{copy.readingTitle}</h2>{relatedStories.map((story) => <article key={story.href} className="flex flex-col gap-3">
        {story.imageUrl && <GuidePhotograph image={{ url: story.imageUrl, alt: story.title }} locale={locale} />}
        <h3><a href={story.href} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-primary underline underline-offset-4">{story.title}</a></h3>
        {story.summary && <p>{story.summary}</p>}
      </article>)}</section>}
    </div>
  </div>;
}

function AtollPreview({ documentId }: { documentId: string }) {
  const client = useClient({ apiVersion: sanityApiVersion });
  const [locale, setLocale] = useState<GuideLocale>("en");
  const [record, setRecord] = useState<PreviewRecord | null>();
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    client.fetch<PreviewRecord | null>(atollPreviewQuery, { id: documentId }, { perspective: "raw", signal: controller.signal })
      .then((value) => { if (!controller.signal.aborted) setRecord(value); })
      .catch(() => { if (!controller.signal.aborted) setError("The preview could not load. Close it and try again."); });
    return () => controller.abort();
  }, [client, documentId]);
  if (error) return <Box padding={5}><Text>{error}</Text></Box>;
  if (record === undefined) return <Box padding={5}><Spinner /></Box>;
  if (record === null) return <Box padding={5}><Text>The document has not saved yet. Close the preview and try again once it has saved.</Text></Box>;
  return <Stack space={3}>
    <Flex gap={2} padding={3} justify="center">
      <Button text="English" mode={locale === "en" ? "default" : "ghost"} onClick={() => setLocale("en")} />
      <Button text="Français" mode={locale === "fr" ? "default" : "ghost"} onClick={() => setLocale("fr")} />
    </Flex>
    <AtollPreviewContent record={record} locale={locale} />
  </Stack>;
}

export function AtollPreviewAction(props: DocumentActionProps): DocumentActionDescription {
  const [open, setOpen] = useState(false);
  const document = props.version ?? props.draft ?? props.published;
  return { label: "Preview guide", icon: EyeIcon, disabled: !document, group: ["paneActions"], onHandle: () => setOpen(true),
    dialog: open && document ? { type: "dialog", header: "Atoll Guide · content preview", width: "full", onClose: () => setOpen(false), content: <AtollPreview key={`${document._id}-${document._rev}`} documentId={document._id} /> } : false };
}
