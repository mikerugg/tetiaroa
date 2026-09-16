import Image from "next/image";
import { ArrowUpRightIcon, FileTextIcon } from "lucide-react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { GuideBodyBlock, GuideImage, GuideLocale, GuideResource } from "@/lib/atoll/types";
import { cn } from "@/lib/utils";
import { atollCopy } from "./atoll-copy";
import { getGuideVideoSource, safeGuideHref } from "./media-utils";

export { getGuideVideoSource } from "./media-utils";

export function GuideImageCredit({ image, locale }: { image: GuideImage; locale: GuideLocale }) {
  if (!image.caption && !image.credit && !image.license) return null;
  const copy = atollCopy[locale];
  const credit = image.credit && /^(?:photo(?:graph)?\s*[:©]|[©Ⓒ])/i.test(image.credit.trim()) ? image.credit : image.credit ? `${copy.photo}: ${image.credit}` : "";
  return <figcaption className="mt-2 text-xs leading-5 text-muted-foreground">{[image.caption, credit, image.license ? `${copy.license}: ${image.license}` : ""].filter(Boolean).join(" · ")}</figcaption>;
}

export function GuidePhotograph({ image, locale, className, priority = false }: { image: GuideImage; locale: GuideLocale; className?: string; priority?: boolean }) {
  return <figure className={cn("min-w-0", className)}>
    <Image src={image.url} alt={image.alt} width={image.width ?? 1200} height={image.height ?? 850} priority={priority} sizes="(max-width: 767px) 100vw, (max-width: 1200px) 66vw, 850px" className="h-auto max-h-[34rem] w-full rounded-sm bg-muted object-contain" />
    <GuideImageCredit image={image} locale={locale} />
  </figure>;
}

export function GuideResourceView({ resource, locale }: { resource: GuideResource; locale: GuideLocale }) {
  const copy = atollCopy[locale];
  const href = safeGuideHref(resource.url);
  if (!href) return null;
  if (resource.kind === "audio") return <figure className="flex min-w-0 flex-col gap-3 rounded-sm bg-muted p-4 sm:p-5">
    <figcaption className="text-sm text-foreground">{resource.title}</figcaption>
    <audio controls preload="none" aria-label={resource.title} src={href} className="w-full">{copy.listen}: <a href={href}>{resource.title}</a></audio>
    {resource.credit && <p className="text-xs text-muted-foreground">{resource.credit}</p>}
  </figure>;
  if (resource.kind === "video") {
    const video = getGuideVideoSource(href);
    if (video) return <figure className="flex flex-col gap-3">
      {video.kind === "iframe" ? <iframe src={video.url} title={resource.title} loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="aspect-video w-full rounded-sm bg-muted" /> : <video controls preload="none" aria-label={resource.title} src={video.url} className="aspect-video w-full rounded-sm bg-muted" />}
      <figcaption className="text-xs text-muted-foreground">{resource.title}{resource.credit ? ` · ${resource.credit}` : ""}</figcaption>
      {resource.pageUrl && safeGuideHref(resource.pageUrl) && <Button asChild variant="link" className="self-start px-0"><a href={resource.pageUrl} target="_blank" rel="noopener noreferrer">{copy.watch}<ArrowUpRightIcon data-icon="inline-end" /></a></Button>}
    </figure>;
  }
  return <div className="flex flex-col items-start gap-1">
    <Button asChild variant="link" className="h-auto max-w-full justify-start px-0 py-1 whitespace-normal text-left">
      <a href={href} target="_blank" rel="noopener noreferrer">{resource.kind === "document" && <FileTextIcon data-icon="inline-start" />}{resource.title}<ArrowUpRightIcon data-icon="inline-end" /></a>
    </Button>
    {resource.credit && <p className="text-xs text-muted-foreground">{resource.credit}</p>}
  </div>;
}

function stringValue(record: Record<string, unknown>, key: string) { return typeof record[key] === "string" ? record[key] as string : ""; }

function bodyComponents(locale: GuideLocale): PortableTextComponents<GuideBodyBlock> {
  const audio = ({ value }: { value: Record<string, unknown> }) => <GuideResourceView locale={locale} resource={{ kind: "audio", url: stringValue(value, "url"), title: stringValue(value, "title") || stringValue(value, "caption") || atollCopy[locale].listen, credit: stringValue(value, "credit") }} />;
  const document = ({ value }: { value: Record<string, unknown> }) => <GuideResourceView locale={locale} resource={{ kind: "document", url: stringValue(value, "url"), title: stringValue(value, "title") || stringValue(value, "label") || atollCopy[locale].download }} />;
  return {
    block: {
      h1: ({ children }) => <h2 className="mt-6 text-xl font-semibold tracking-tight text-foreground">{children}</h2>,
      h2: ({ children }) => <h2 className="mt-6 text-xl font-semibold tracking-tight text-foreground">{children}</h2>,
      h3: ({ children }) => <h3 className="mt-4 text-lg font-semibold text-foreground">{children}</h3>,
      h4: ({ children }) => <h4 className="mt-3 text-base font-semibold text-foreground">{children}</h4>,
      normal: ({ children }) => <p className="text-base leading-7 text-foreground">{children}</p>,
      blockquote: ({ children }) => <blockquote className="my-3 border-l-2 border-primary pl-5 text-lg leading-7 text-foreground">{children}</blockquote>,
    },
    list: {
      bullet: ({ children }) => <ul className="flex list-disc flex-col gap-2 pl-5 text-base leading-7">{children}</ul>,
      number: ({ children }) => <ol className="flex list-decimal flex-col gap-2 pl-5 text-base leading-7">{children}</ol>,
    },
    marks: {
      link: ({ value, children }) => {
        const href = safeGuideHref(typeof value?.href === "string" ? value.href : "");
        return href ? <a href={href} className="text-primary underline underline-offset-4 hover:text-foreground">{children}</a> : <>{children}</>;
      },
    },
    types: {
      callout: ({ value }) => <Alert role="note">{stringValue(value, "title") && <AlertTitle>{stringValue(value, "title")}</AlertTitle>}<AlertDescription>{stringValue(value, "text")}</AlertDescription></Alert>,
      statBlock: ({ value }) => <dl className="rounded-xl bg-muted p-5"><dt className="text-sm text-muted-foreground">{stringValue(value, "label")}</dt><dd className="mt-2 text-xl font-semibold text-foreground">{stringValue(value, "value")}</dd></dl>,
      image: ({ value }) => {
        const record = value as Record<string, unknown>;
        const url = stringValue(record, "url");
        if (!url) return null;
        return <GuidePhotograph locale={locale} image={{ url, alt: stringValue(record, "alt"), caption: stringValue(record, "caption"), credit: stringValue(record, "credit"), license: stringValue(record, "license"), width: typeof record.width === "number" ? record.width : undefined, height: typeof record.height === "number" ? record.height : undefined }} className="my-6" />;
      },
      videoEmbed: ({ value }) => <GuideResourceView locale={locale} resource={{ kind: "video", url: stringValue(value, "url"), title: stringValue(value, "caption") || atollCopy[locale].watch, credit: stringValue(value, "credit") }} />,
      audioEmbed: audio,
      audioPlayer: audio,
      audio,
      fileLink: document,
      documentLink: document,
    },
  };
}

export function GuideBody({ body, locale }: { body: GuideBodyBlock[]; locale: GuideLocale }) {
  return <div className="flex min-w-0 flex-col gap-5 break-words"><PortableText value={body} components={bodyComponents(locale)} /></div>;
}
