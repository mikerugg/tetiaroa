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
  ENGLISH_TEAM_PATH,
  FRENCH_IMPACT_PATH,
  FRENCH_TEAM_PATH,
} from "@/app/language-links";
import { SiteFooter } from "@/app/site-footer";
import { TopToolbar } from "@/app/top-toolbar";
import type {
  ImpactAffiliation,
  ImpactBodyBlock,
  ImpactContentEntry,
  ImpactLanguage,
} from "@/lib/impact/types";
import { getDoiIdentifier } from "@/lib/impact/doi";
import { cn } from "@/lib/utils";
import { getImpactEntryBySlug } from "@/lib/sanity/impact";
import {
  getImpactToolbarCopy,
  impactRouteCopy,
  type ImpactLocale,
} from "./impact-route-copy";
import { ImpactHtmlPackage } from "./impact-html-package";

type ImpactEntryPageContentProps = {
  slug: string;
  locale: ImpactLocale;
  entrySource?: ImpactEntrySource;
};

export type ImpactEntrySource = "team";

type ImpactEntryInfoCardProps = {
  entry: ImpactContentEntry;
  copy: (typeof impactRouteCopy)[ImpactLocale];
  affiliationLabel: string;
  showLocation: boolean;
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

export function getImpactEntrySource(
  searchParams: Record<string, string | string[] | undefined>,
): ImpactEntrySource | undefined {
  const from = searchParams.from;
  const source = Array.isArray(from) ? from[0] : from;

  return source === "team" ? source : undefined;
}

function formatDate(value: string, locale: ImpactLanguage) {
  return dateFormatters[locale].format(new Date(`${value}T00:00:00`));
}

function getHeroDateLabel(
  entry: ImpactContentEntry,
  copy: (typeof impactRouteCopy)[ImpactLocale],
  locale: ImpactLocale,
) {
  const label =
    !hasDistinctLatestUpdate(entry) && hasRealPublishedDate(entry)
      ? copy.publishedLabel
      : copy.updatedLabel;

  return `${label} ${formatDate(entry.latestUpdate, locale)}`;
}

function hasRealPublishedDate(entry: ImpactContentEntry) {
  return entry.publishedAt !== "1970-01-01";
}

function hasDistinctLatestUpdate(entry: ImpactContentEntry) {
  return entry.latestUpdate !== entry.publishedAt;
}

function getAffiliations(entry: ImpactContentEntry): ImpactAffiliation[] {
  const structuredAffiliations = new Map(
    (entry.affiliations ?? []).map((affiliation) => [
      affiliation.name.toLocaleLowerCase(),
      affiliation,
    ]),
  );
  const affiliationNames = (entry.affiliation ?? "")
    .split(/[;\n]+/)
    .map((affiliation) => affiliation.trim())
    .filter(Boolean);

  if (!affiliationNames.length) {
    return [...structuredAffiliations.values()];
  }

  return affiliationNames.map((name) => ({
    name,
    dataciteUrl: structuredAffiliations.get(name.toLocaleLowerCase())
      ?.dataciteUrl,
  }));
}

function ImpactEntryInfoCard({
  entry,
  copy,
  affiliationLabel,
  showLocation,
}: ImpactEntryInfoCardProps) {
  const affiliations = getAffiliations(entry);
  const hasAffiliations = affiliations.length > 0;
  const articleTitle = entry.iplacesTitle ?? entry.title;

  return (
    <div className="min-w-0 rounded-md border border-border bg-card/80 p-5 shadow-2xl backdrop-blur-md">
      <dl className="flex min-w-0 flex-col gap-5">
        <div className="min-w-0">
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {copy.articleTitleLabel}
          </dt>
          <dd className="mt-2 min-w-0 break-words text-sm text-foreground">
            {entry.iplacesUrl ? (
              <a
                href={entry.iplacesUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${articleTitle} — ${copy.iplacesArticleLabel}`}
                className="inline-flex max-w-full items-center gap-1 text-primary underline-offset-4 hover:underline"
              >
                <span className="min-w-0 break-words">{articleTitle}</span>
                <ArrowUpRightIcon
                  className="size-3 shrink-0"
                  aria-hidden="true"
                />
              </a>
            ) : (
              articleTitle
            )}
          </dd>
        </div>
        {entry.authors?.length ? (
          <>
            <Separator />
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {copy.authorsLabel}
              </dt>
              <dd className="mt-2 text-sm text-foreground">
                <ul className="flex flex-col gap-1">
                  {entry.authors.map((author, index) => (
                    <li
                      key={`${author.name}:${author.orcidUrl ?? index}`}
                      className="min-w-0 break-words"
                    >
                      {author.orcidUrl ? (
                        <a
                          href={author.orcidUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={`${author.name} — ${copy.orcidProfileLabel}`}
                          className="inline-flex max-w-full items-center gap-1 text-primary underline-offset-4 hover:underline"
                        >
                          <span className="min-w-0 break-words">
                            {author.name}
                          </span>
                          <ArrowUpRightIcon
                            className="size-3 shrink-0"
                            aria-hidden="true"
                          />
                        </a>
                      ) : (
                        author.name
                      )}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </>
        ) : null}
        {hasAffiliations ? (
          <>
            <Separator />
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {affiliationLabel}
              </dt>
              <dd className="mt-2 text-sm text-foreground">
                <ul className="flex flex-col gap-1">
                  {affiliations.map((affiliation, index) => (
                    <li
                      key={`${affiliation.name}:${index}`}
                      className="min-w-0 break-words"
                    >
                      {affiliation.dataciteUrl ? (
                        <a
                          href={affiliation.dataciteUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={`${affiliation.name} — ${copy.dataciteAffiliationLabel}`}
                          className="inline-flex max-w-full items-center gap-1 text-primary underline-offset-4 hover:underline"
                        >
                          <span className="min-w-0 break-words">
                            {affiliation.name}
                          </span>
                          <ArrowUpRightIcon
                            className="size-3 shrink-0"
                            aria-hidden="true"
                          />
                        </a>
                      ) : (
                        affiliation.name
                      )}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </>
        ) : null}
        {hasDistinctLatestUpdate(entry) ? (
          <>
            <Separator />
            <div className="grid grid-cols-[32px_minmax(0,1fr)] gap-3">
              <CalendarDaysIcon aria-hidden="true" />
              <div className="min-w-0">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {copy.updatedLabel}
                </dt>
                <dd className="mt-1 text-sm text-foreground">
                  <time dateTime={entry.latestUpdate}>
                    {formatDate(entry.latestUpdate, entry.language)}
                  </time>
                </dd>
              </div>
            </div>
          </>
        ) : null}
        {hasRealPublishedDate(entry) ? (
          <>
            <Separator />
            <div className="grid grid-cols-[32px_minmax(0,1fr)] gap-3">
              <CalendarDaysIcon aria-hidden="true" />
              <div className="min-w-0">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {copy.publishedLabel}
                </dt>
                <dd className="mt-1 text-sm text-foreground">
                  <time dateTime={entry.publishedAt}>
                    {formatDate(entry.publishedAt, entry.language)}
                  </time>
                </dd>
              </div>
            </div>
          </>
        ) : null}
        {entry.doiUrl ? (
          <>
            <Separator />
            <div className="min-w-0">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                DOI
              </dt>
              <dd className="mt-1 min-w-0 text-sm">
                <a
                  href={entry.doiUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex max-w-full items-center gap-1 text-primary underline-offset-4 hover:underline"
                >
                  <span className="min-w-0 break-all">
                    {getDoiIdentifier(entry.doiUrl)}
                  </span>
                  <ArrowUpRightIcon
                    className="size-4 shrink-0"
                    aria-hidden="true"
                  />
                </a>
              </dd>
            </div>
          </>
        ) : null}
        {showLocation ? (
          <>
            <Separator />
            <div className="grid grid-cols-[32px_minmax(0,1fr)] gap-3">
              <MapPinIcon aria-hidden="true" />
              <div className="min-w-0">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {copy.locationLabel}
                </dt>
                <dd className="mt-1 break-words text-sm text-foreground">
                  {entry.location}
                </dd>
              </div>
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
                    className="h-auto max-w-full justify-start whitespace-normal break-words text-left"
                  >
                    <span className="min-w-0 break-words">{tag}</span>
                  </Badge>
                ))}
              </dd>
            </div>
          </>
        ) : null}
      </dl>
    </div>
  );
}

function getAbsoluteUrl(value: string) {
  return value.startsWith("http") ? value : new URL(value, siteUrl).toString();
}

function getString(value: Record<string, unknown>, key: string) {
  const maybeValue = value[key];
  return typeof maybeValue === "string" ? maybeValue : "";
}

function getNumber(value: Record<string, unknown>, key: string) {
  const maybeValue = value[key];

  if (typeof maybeValue === "number" && Number.isFinite(maybeValue)) {
    return maybeValue > 0 ? Math.round(maybeValue) : undefined;
  }

  if (typeof maybeValue === "string") {
    const parsedValue = Number(maybeValue);

    return Number.isFinite(parsedValue) && parsedValue > 0
      ? Math.round(parsedValue)
      : undefined;
  }

  return undefined;
}

function getImageDimensions(value: Record<string, unknown>, url: string) {
  const width = getNumber(value, "width");
  const height = getNumber(value, "height");

  if (width && height) {
    return { width, height };
  }

  const sanityAssetMatch = url.match(
    /-(\d+)x(\d+)\.[a-z0-9]+(?:[?#].*)?$/i,
  );

  if (!sanityAssetMatch) {
    return { width: 1200, height: 750 };
  }

  return {
    width: Number(sanityAssetMatch[1]),
    height: Number(sanityAssetMatch[2]),
  };
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
      return copy.affiliationsLabel;
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

        const dimensions = getImageDimensions(record, url);

        return (
          <figure className="my-10 flex flex-col items-center gap-3">
            <Image
              src={url}
              alt={alt}
              width={dimensions.width}
              height={dimensions.height}
              className="h-auto max-w-full rounded-md bg-muted object-contain"
              sizes="(max-width: 768px) calc(100vw - 40px), 896px"
            />
            {caption ? (
              <figcaption className="text-center font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
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
            <figure className="my-10 flex flex-col items-center gap-3">
              <div className="w-full max-w-3xl overflow-hidden rounded-md border border-border bg-muted">
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
                <figcaption className="text-center font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {caption}
                </figcaption>
              ) : null}
            </figure>
          );
        }

        if (video?.kind === "file") {
          return (
            <figure className="my-10 flex flex-col items-center gap-3">
              <video
                className="aspect-video w-full max-w-3xl rounded-md border border-border bg-muted"
                controls
                preload="metadata"
              >
                <source src={video.src} type={video.mimeType} />
              </video>
              {caption ? (
                <figcaption className="text-center font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {caption}
                </figcaption>
              ) : null}
            </figure>
          );
        }

        return (
          <figure className="my-10 flex flex-col items-center gap-3">
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
              <figcaption className="text-center font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
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

  const alternatePath = entry.alternateSlug
    ? locale === "fr"
      ? `${ENGLISH_IMPACT_PATH}/${entry.alternateSlug}`
      : `${FRENCH_IMPACT_PATH}/${entry.alternateSlug}`
    : undefined;
  const languageAlternates = alternatePath
    ? locale === "fr"
      ? { en: getAbsoluteUrl(alternatePath), fr: getAbsoluteUrl(path) }
      : { en: getAbsoluteUrl(path), fr: getAbsoluteUrl(alternatePath) }
    : undefined;

  return {
    title: `${entry.seoTitle ?? entry.title} / Tetiaroa Society`,
    description: entry.seoDescription ?? entry.summary,
    authors: entry.authors?.map((author) => ({
      name: author.name,
      ...(author.orcidUrl ? { url: author.orcidUrl } : {}),
    })),
    alternates: {
      canonical: getAbsoluteUrl(path),
      ...(languageAlternates ? { languages: languageAlternates } : {}),
    },
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
  entrySource,
}: ImpactEntryPageContentProps) {
  const copy = impactRouteCopy[locale];
  const entry = await getImpactEntryBySlug(slug, locale);

  if (!entry) {
    notFound();
  }

  const impactBackHref =
    locale === "fr" ? FRENCH_IMPACT_PATH : ENGLISH_IMPACT_PATH;
  const teamBackHref = locale === "fr" ? FRENCH_TEAM_PATH : ENGLISH_TEAM_PATH;
  const shouldBackLinkToTeam =
    entrySource === "team" && entry.entryType === "Profile";
  const backLink = {
    href: shouldBackLinkToTeam ? teamBackHref : impactBackHref,
    label: shouldBackLinkToTeam ? copy.teamBackLabel : copy.backLabel,
  };
  const portableTextComponents = getPortableTextComponents(copy);
  const body = normalizeImpactBody(entry.body);
  const heroSupportText = getHeroSupportText(entry, body);
  const heroDateLabel = getHeroDateLabel(entry, copy, locale);
  const affiliationLabel = getAffiliationLabel(entry, copy);
  const showLocation = entry.entryType !== "Profile";

  return (
    <>
      <TopToolbar copy={getImpactToolbarCopy(locale, entry.alternateSlug)} />
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
                  <Link href={backLink.href}>
                    <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" />
                    {backLink.label}
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
            <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
              <ImpactEntryInfoCard
                entry={entry}
                copy={copy}
                affiliationLabel={affiliationLabel}
                showLocation={showLocation}
              />
            </aside>

            <div className="min-w-0">
              <div
                className={cn(
                  "flex flex-col gap-6",
                  entry.htmlPackage ? "w-full" : "mx-auto max-w-4xl",
                )}
              >
                {entry.htmlPackage ? (
                  <ImpactHtmlPackage
                    html={entry.htmlPackage.html}
                    title={`${entry.title} — ${
                      locale === "fr" ? "contenu enrichi" : "rich content"
                    }`}
                  />
                ) : body.length ? (
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

              <aside className="mt-8 lg:hidden">
                <ImpactEntryInfoCard
                  entry={entry}
                  copy={copy}
                  affiliationLabel={affiliationLabel}
                  showLocation={showLocation}
                />
              </aside>

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
