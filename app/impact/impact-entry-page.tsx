import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
  PlayCircleIcon,
} from "lucide-react";
import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { homeCopies } from "@/app/home-copy";
import {
  ENGLISH_IMPACT_PATH,
  FRENCH_IMPACT_PATH,
} from "@/app/language-links";
import { PrimaryRouteDock } from "@/app/primary-route-dock";
import { SiteFooter } from "@/app/site-footer";
import { TopToolbar } from "@/app/top-toolbar";
import type {
  ImpactBodyBlock,
  ImpactContentEntry,
  ImpactLanguage,
} from "@/lib/impact/types";
import { getImpactEntryBySlug } from "@/lib/sanity/impact";
import {
  getImpactToolbarCopy,
  impactRouteCopy,
  type ImpactLocale,
} from "./impact-route-copy";

type ImpactEntryPageContentProps = {
  slug: string;
  locale: ImpactLocale;
};

const dateFormatters: Record<ImpactLanguage, Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }),
  fr: new Intl.DateTimeFormat("fr", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }),
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tetiaroasociety.org";

function formatDate(value: string, locale: ImpactLanguage) {
  return dateFormatters[locale].format(new Date(`${value}T00:00:00`));
}

function getHeroDateLabel(
  entry: ImpactContentEntry,
  copy: (typeof impactRouteCopy)[ImpactLocale],
  locale: ImpactLocale,
) {
  const label =
    entry.latestUpdate === entry.publishedAt && hasRealPublishedDate(entry)
      ? copy.publishedLabel
      : copy.updatedLabel;

  return `${label} ${formatDate(entry.latestUpdate, locale)}`;
}

function hasRealPublishedDate(entry: ImpactContentEntry) {
  return entry.publishedAt !== "1970-01-01";
}

function getSidebarDate(
  entry: ImpactContentEntry,
  copy: (typeof impactRouteCopy)[ImpactLocale],
  locale: ImpactLocale,
) {
  if (hasRealPublishedDate(entry)) {
    return {
      label: copy.publishedLabel,
      value: formatDate(entry.publishedAt, locale),
      dateTime: entry.publishedAt,
    };
  }

  return {
    label: copy.updatedLabel,
    value: formatDate(entry.latestUpdate, locale),
    dateTime: entry.latestUpdate,
  };
}

function getAbsoluteUrl(value: string) {
  return value.startsWith("http") ? value : new URL(value, siteUrl).toString();
}

function getString(value: Record<string, unknown>, key: string) {
  const maybeValue = value[key];
  return typeof maybeValue === "string" ? maybeValue : "";
}

type VideoEmbed =
  | {
      kind: "iframe";
      src: string;
      title: string;
      key: string;
    }
  | {
      kind: "file";
      src: string;
      mimeType: string;
      title: string;
      key: string;
    };

function getYouTubeVideoId(url: URL) {
  if (url.hostname === "youtu.be") {
    return url.pathname.split("/").filter(Boolean)[0] ?? "";
  }

  if (!/(^|\.)youtube\.com$/.test(url.hostname)) {
    return "";
  }

  if (url.pathname.startsWith("/embed/") || url.pathname.startsWith("/shorts/")) {
    return url.pathname.split("/").filter(Boolean)[1] ?? "";
  }

  return url.searchParams.get("v") ?? "";
}

function getVimeoVideoId(url: URL) {
  if (url.hostname === "player.vimeo.com" && url.pathname.startsWith("/video/")) {
    return url.pathname.split("/").filter(Boolean)[1] ?? "";
  }

  if (!/(^|\.)vimeo\.com$/.test(url.hostname)) {
    return "";
  }

  return url.pathname.split("/").filter(Boolean).find((part) => /^\d+$/.test(part)) ?? "";
}

function getDirectVideoMimeType(pathname: string) {
  const extension = pathname.toLowerCase().split(".").pop();

  switch (extension) {
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "ogg":
    case "ogv":
      return "video/ogg";
    default:
      return "";
  }
}

function getVideoEmbed(url: string, fallbackTitle: string): VideoEmbed | null {
  try {
    const parsedUrl = new URL(url, siteUrl);
    const youtubeId = getYouTubeVideoId(parsedUrl);

    if (youtubeId) {
      return {
        kind: "iframe",
        src: `https://www.youtube-nocookie.com/embed/${youtubeId}`,
        title: fallbackTitle,
        key: `youtube:${youtubeId}`,
      };
    }

    const vimeoId = getVimeoVideoId(parsedUrl);

    if (vimeoId) {
      return {
        kind: "iframe",
        src: `https://player.vimeo.com/video/${vimeoId}`,
        title: fallbackTitle,
        key: `vimeo:${vimeoId}`,
      };
    }

    const mimeType = getDirectVideoMimeType(parsedUrl.pathname);

    if (mimeType) {
      return {
        kind: "file",
        src: parsedUrl.toString(),
        mimeType,
        title: fallbackTitle,
        key: `file:${parsedUrl.toString()}`,
      };
    }
  } catch {
    return null;
  }

  return null;
}

function isLegacyVideoCaption(caption: string) {
  return /^watch\s*(?:->|→)?$/i.test(caption.trim());
}

function normalizeImpactBody(body: ImpactBodyBlock[]) {
  const normalizedBody: ImpactBodyBlock[] = [];
  let previousVideoKey = "";

  for (const block of body) {
    if (block._type !== "videoEmbed") {
      previousVideoKey = "";
      normalizedBody.push(block);
      continue;
    }

    const record = block as Record<string, unknown>;
    const url = getString(record, "url");
    const caption = getString(record, "caption");
    const video = getVideoEmbed(url, caption || "Tetiaroa Society video");
    const videoKey = video?.key ?? url.trim();

    if (videoKey && videoKey === previousVideoKey) {
      continue;
    }

    previousVideoKey = videoKey;
    normalizedBody.push(block);
  }

  return normalizedBody;
}

function normalizeComparableText(value: string) {
  return value
    .toLowerCase()
    .replace(/[\W_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getBlockText(block: ImpactBodyBlock) {
  if (block._type !== "block" || !Array.isArray(block.children)) {
    return "";
  }

  return block.children
    .map((child) =>
      child && typeof child === "object" && "text" in child
        ? String(child.text ?? "")
        : "",
    )
    .join("")
    .trim();
}

function getOpeningBodyText(body: ImpactBodyBlock[]) {
  for (const block of body) {
    const text = getBlockText(block);

    if (text) {
      return text;
    }
  }

  return "";
}

function repeatsOpeningBody(summary: string, body: ImpactBodyBlock[]) {
  const normalizedSummary = normalizeComparableText(summary);
  const normalizedOpening = normalizeComparableText(getOpeningBodyText(body));

  if (!normalizedSummary || !normalizedOpening) {
    return false;
  }

  const comparisonLength = Math.min(normalizedSummary.length, 140);
  const summaryStart = normalizedSummary.slice(0, comparisonLength);

  return (
    summaryStart.length > 60 &&
    (normalizedOpening.startsWith(summaryStart) ||
      normalizedSummary.startsWith(normalizedOpening.slice(0, comparisonLength)))
  );
}

function cleanHeroSummary(summary: string) {
  const text = summary.trim();
  const sentenceMatches = text
    .match(/[^.!?]+[.!?]+(?=\s|$)/g)
    ?.map((sentence) => sentence.trim());

  if (!sentenceMatches || sentenceMatches.length < 2) {
    return text;
  }

  const lastSentence = sentenceMatches.at(-1)?.trim() ?? "";
  const lastWords = normalizeComparableText(lastSentence).split(" ");
  const lastWord = lastWords.at(-1) ?? "";
  const danglingEndWords = new Set([
    "a",
    "an",
    "and",
    "as",
    "at",
    "by",
    "for",
    "from",
    "in",
    "of",
    "or",
    "the",
    "to",
    "with",
  ]);

  if (!lastWord || danglingEndWords.has(lastWord) || lastWord.length <= 2) {
    return sentenceMatches.slice(0, -1).join(" ").trim();
  }

  return text;
}

function getHeroSupportText(
  entry: ImpactContentEntry,
  body: ImpactBodyBlock[],
) {
  if (entry.entryType === "Profile" || entry.entryType === "Partner") {
    return entry.affiliation ?? "";
  }

  if (entry.entryType === "Report" || entry.entryType === "Newsletter") {
    return "";
  }

  if (!entry.summary || repeatsOpeningBody(entry.summary, body)) {
    return "";
  }

  return cleanHeroSummary(entry.summary);
}

function getAffiliationLabel(
  entry: ImpactContentEntry,
  copy: (typeof impactRouteCopy)[ImpactLocale],
) {
  switch (entry.entryType) {
    case "Profile":
      return copy.roleLabel;
    case "Project":
      return copy.researchPartnerLabel;
    case "Partner":
      return copy.organizationLabel;
    default:
      return copy.affiliationLabel;
  }
}

function getPortableTextComponents(
  copy: (typeof impactRouteCopy)[ImpactLocale],
): PortableTextComponents<ImpactBodyBlock> {
  return {
    block: {
      h2: ({ children }) => (
        <h2 className="mt-12 font-display text-4xl leading-tight text-foreground">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="mt-8 font-display text-3xl leading-tight text-foreground">
          {children}
        </h3>
      ),
      blockquote: ({ children }) => (
        <blockquote className="my-8 border-l border-border pl-5 font-display text-2xl leading-9 text-foreground">
          {children}
        </blockquote>
      ),
      normal: ({ children }) => (
        <p className="text-base leading-8 text-ink-light">{children}</p>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="flex list-disc flex-col gap-3 pl-6 text-base leading-8 text-ink-light">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="flex list-decimal flex-col gap-3 pl-6 text-base leading-8 text-ink-light">
          {children}
        </ol>
      ),
    },
    marks: {
      link: ({ children, value }) => {
        const href =
          value && typeof value === "object"
            ? getString(value as Record<string, unknown>, "href")
            : "";

        if (!href) {
          return <>{children}</>;
        }

        return (
          <a
            className="text-primary underline-offset-4 hover:underline"
            href={href}
          >
            {children}
          </a>
        );
      },
    },
    types: {
      image: ({ value }) => {
        const record = value as Record<string, unknown>;
        const url = getString(record, "url");
        const alt = getString(record, "alt");
        const caption = getString(record, "caption");

        if (!url) {
          return null;
        }

        return (
          <figure className="my-10 flex flex-col gap-3">
            <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-muted">
              <Image
                src={url}
                alt={alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) calc(100vw - 40px), 960px"
              />
            </div>
            {caption ? (
              <figcaption className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {caption}
              </figcaption>
            ) : null}
          </figure>
        );
      },
      callout: ({ value }) => {
        const record = value as Record<string, unknown>;
        const title = getString(record, "title");
        const text = getString(record, "text");

        return (
          <aside className="my-8 rounded-md border border-border bg-card p-5">
            {title ? (
              <h3 className="font-display text-2xl leading-tight text-foreground">
                {title}
              </h3>
            ) : null}
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p>
          </aside>
        );
      },
      statBlock: ({ value }) => {
        const record = value as Record<string, unknown>;
        const valueText = getString(record, "value");
        const label = getString(record, "label");

        return (
          <div className="my-8 rounded-md border border-border bg-card p-5">
            <div className="font-display text-5xl leading-none text-foreground">
              {valueText}
            </div>
            <div className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {label}
            </div>
          </div>
        );
      },
      documentLink: ({ value }) => {
        const record = value as Record<string, unknown>;
        const title = getString(record, "title");
        const url = getString(record, "url");

        if (!url) {
          return null;
        }

        return (
          <Button asChild variant="outline" className="my-4 w-fit">
            <a href={url}>
              {title || copy.openDocumentLabel}
              <ArrowUpRightIcon data-icon="inline-end" aria-hidden="true" />
            </a>
          </Button>
        );
      },
      videoEmbed: ({ value }) => {
        const record = value as Record<string, unknown>;
        const url = getString(record, "url");
        const rawCaption = getString(record, "caption");
        const caption = rawCaption && !isLegacyVideoCaption(rawCaption) ? rawCaption : "";
        const video = getVideoEmbed(url, caption || copy.openVideoLabel);

        if (!url) {
          return null;
        }

        if (video?.kind === "iframe") {
          return (
            <figure className="my-10 flex flex-col gap-3">
              <div className="overflow-hidden rounded-md border border-border bg-muted">
                <iframe
                  className="aspect-video w-full"
                  src={video.src}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              {caption ? (
                <figcaption className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {caption}
                </figcaption>
              ) : null}
            </figure>
          );
        }

        if (video?.kind === "file") {
          return (
            <figure className="my-10 flex flex-col gap-3">
              <video
                className="aspect-video w-full rounded-md border border-border bg-muted"
                controls
                preload="metadata"
              >
                <source src={video.src} type={video.mimeType} />
              </video>
              {caption ? (
                <figcaption className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {caption}
                </figcaption>
              ) : null}
            </figure>
          );
        }

        return (
          <figure className="my-10 flex flex-col gap-3">
            <div className="rounded-md border border-border bg-muted p-5">
              <Button asChild variant="outline">
                <a href={url}>
                  <PlayCircleIcon data-icon="inline-start" aria-hidden="true" />
                  {copy.openVideoLabel}
                  <ArrowUpRightIcon data-icon="inline-end" aria-hidden="true" />
                </a>
              </Button>
            </div>
            {caption ? (
              <figcaption className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {caption}
              </figcaption>
            ) : null}
          </figure>
        );
      },
    },
  };
}

export async function generateImpactEntryMetadata(
  slug: string,
  locale: ImpactLocale,
): Promise<Metadata> {
  const copy = impactRouteCopy[locale];
  const entry = await getImpactEntryBySlug(slug, locale);
  const path =
    locale === "fr" ? `${FRENCH_IMPACT_PATH}/${slug}` : `${ENGLISH_IMPACT_PATH}/${slug}`;

  if (!entry) {
    return {
      title: copy.entryFallbackTitle,
      alternates: { canonical: getAbsoluteUrl(path) },
    };
  }

  return {
    title: `${entry.seoTitle ?? entry.title} / Tetiaroa Society`,
    description: entry.seoDescription ?? entry.summary,
    alternates: { canonical: getAbsoluteUrl(path) },
    openGraph: {
      title: entry.seoTitle ?? entry.title,
      description: entry.seoDescription ?? entry.summary,
      images: [
        {
          url: getAbsoluteUrl(entry.heroImage),
          alt: entry.heroImageAlt,
        },
      ],
    },
  };
}

export async function ImpactEntryPageContent({
  slug,
  locale,
}: ImpactEntryPageContentProps) {
  const copy = impactRouteCopy[locale];
  const entry = await getImpactEntryBySlug(slug, locale);

  if (!entry) {
    notFound();
  }

  const backHref = locale === "fr" ? FRENCH_IMPACT_PATH : ENGLISH_IMPACT_PATH;
  const portableTextComponents = getPortableTextComponents(copy);
  const body = normalizeImpactBody(entry.body);
  const heroSupportText = getHeroSupportText(entry, body);
  const heroDateLabel = getHeroDateLabel(entry, copy, locale);
  const sidebarDate = getSidebarDate(entry, copy, locale);
  const affiliationLabel = getAffiliationLabel(entry, copy);
  const showLocation = entry.entryType !== "Profile";

  return (
    <>
      <TopToolbar copy={getImpactToolbarCopy(locale)} />
      <PrimaryRouteDock active="impact" locale={locale} />
      <main className="bg-background text-foreground">
        <article>
          <section className="relative isolate overflow-hidden border-b border-border pt-14 md:pt-16">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,var(--background)_0%,rgb(7_16_14/.96)_72%,var(--background)_100%)]"
            />
            <div className="relative mx-auto grid max-w-[1540px] gap-8 px-5 pt-10 pb-6 sm:px-8 md:px-9 lg:grid-cols-[minmax(0,1fr)_minmax(360px,620px)] lg:items-start lg:px-10">
              <div className="flex min-w-0 flex-col">
                <Button
                  asChild
                  variant="link"
                  className="mb-8 h-auto w-fit p-0 font-mono"
                >
                  <Link href={backHref}>
                    <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" />
                    {copy.backLabel}
                  </Link>
                </Button>
                <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em]">
                  <Badge variant="secondary" className="h-auto font-mono">
                    {entry.category}
                  </Badge>
                  <Badge variant="outline" className="h-auto font-mono">
                    {entry.entryType}
                  </Badge>
                  <time
                    className="text-foreground/82"
                    dateTime={entry.latestUpdate}
                  >
                    {heroDateLabel}
                  </time>
                </div>
                <h1 className="mt-5 max-w-5xl font-display text-5xl leading-none text-foreground sm:text-6xl md:text-7xl">
                  {entry.title}
                </h1>
                {heroSupportText ? (
                  <p className="mt-5 max-w-3xl text-base leading-8 text-foreground/86 sm:text-lg">
                    {heroSupportText}
                  </p>
                ) : null}
              </div>
              <figure className="relative overflow-hidden rounded-md border border-border bg-muted shadow-2xl lg:mr-10 xl:mr-14 2xl:mr-20">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={entry.heroImage}
                    alt={entry.heroImageAlt}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 1024px) calc(100vw - 40px), 620px"
                  />
                </div>
              </figure>
            </div>
          </section>

          <section className="mx-auto grid max-w-[1540px] gap-8 px-5 py-8 sm:px-8 md:px-9 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-10">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-md border border-border bg-card/80 p-5 shadow-2xl backdrop-blur-md">
                <dl className="flex flex-col gap-5">
                  <div className="grid grid-cols-[32px_1fr] gap-3">
                    <CalendarDaysIcon aria-hidden="true" />
                    <div>
                      <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        {sidebarDate.label}
                      </dt>
                      <dd className="mt-1 text-sm text-foreground">
                        <time dateTime={sidebarDate.dateTime}>
                          {sidebarDate.value}
                        </time>
                      </dd>
                    </div>
                  </div>
                  {showLocation ? (
                    <>
                      <Separator />
                      <div className="grid grid-cols-[32px_1fr] gap-3">
                        <MapPinIcon aria-hidden="true" />
                        <div>
                          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                            {copy.locationLabel}
                          </dt>
                          <dd className="mt-1 text-sm text-foreground">
                            {entry.location}
                          </dd>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {entry.affiliation ? (
                    <>
                      <Separator />
                      <div>
                        <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          {affiliationLabel}
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {entry.affiliation}
                        </dd>
                      </div>
                    </>
                  ) : null}
                  {entry.tags.length ? (
                    <>
                      <Separator />
                      <div>
                        <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          {copy.tagsLabel}
                        </dt>
                        <dd className="mt-2 flex flex-wrap gap-2">
                          {entry.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="h-auto"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </dd>
                      </div>
                    </>
                  ) : null}
                </dl>
              </div>
            </aside>

            <div className="min-w-0">
              <div className="mx-auto flex max-w-4xl flex-col gap-6">
                {body.length ? (
                  <PortableText
                    value={body}
                    components={portableTextComponents}
                  />
                ) : (
                  <p className="text-base leading-8 text-ink-light">
                    {entry.summary}
                  </p>
                )}
              </div>

              {entry.gallery?.length ? (
                <section className="mt-14" aria-labelledby="gallery-heading">
                  <h2
                    id="gallery-heading"
                    className="font-display text-4xl leading-tight"
                  >
                    {copy.galleryLabel}
                  </h2>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {entry.gallery.map((item) => (
                      <figure
                        key={`${item.image}-${item.caption ?? item.alt}`}
                        className="flex flex-col gap-3"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-muted">
                          <Image
                            src={item.image}
                            alt={item.alt}
                            fill
                            className="object-contain p-4"
                            sizes="(max-width: 768px) calc(100vw - 40px), 30vw"
                          />
                        </div>
                        {item.caption ? (
                          <figcaption className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                            {item.caption}
                          </figcaption>
                        ) : null}
                      </figure>
                    ))}
                  </div>
                </section>
              ) : null}

              {entry.team?.length ? (
                <section className="mt-14" aria-labelledby="team-heading">
                  <h2
                    id="team-heading"
                    className="font-display text-4xl leading-tight"
                  >
                    {copy.teamLabel}
                  </h2>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {entry.team.map((person) => (
                      <Badge key={person} variant="secondary" className="h-auto">
                        {person}
                      </Badge>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          </section>
        </article>
      </main>
      <SiteFooter copy={homeCopies[locale].footer} />
    </>
  );
}
