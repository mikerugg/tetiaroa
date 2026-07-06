import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
} from "lucide-react";
import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { homeCopies } from "@/app/home-copy";
import { PrimaryRouteDock } from "@/app/primary-route-dock";
import { SiteFooter } from "@/app/site-footer";
import { TopToolbar } from "@/app/top-toolbar";
import type { ImpactBodyBlock } from "@/lib/impact/types";
import {
  getImpactEntryBySlug,
  getImpactSlugs,
} from "@/lib/sanity/impact";

type ImpactEntryPageProps = {
  params: Promise<{ slug: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tetiaroasociety.org";

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00`));
}

function getAbsoluteUrl(value: string) {
  return value.startsWith("http") ? value : new URL(value, siteUrl).toString();
}

function getString(value: Record<string, unknown>, key: string) {
  const maybeValue = value[key];
  return typeof maybeValue === "string" ? maybeValue : "";
}

const portableTextComponents: PortableTextComponents<ImpactBodyBlock> = {
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
      <p className="text-base leading-8 text-muted-foreground">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="flex list-disc flex-col gap-3 pl-6 text-base leading-8 text-muted-foreground">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="flex list-decimal flex-col gap-3 pl-6 text-base leading-8 text-muted-foreground">
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
        <a className="text-primary underline-offset-4 hover:underline" href={href}>
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
            {title || "Open document"}
            <ArrowUpRightIcon data-icon="inline-end" aria-hidden="true" />
          </a>
        </Button>
      );
    },
    videoEmbed: ({ value }) => {
      const record = value as Record<string, unknown>;
      const url = getString(record, "url");
      const caption = getString(record, "caption");

      if (!url) {
        return null;
      }

      return (
        <figure className="my-10 flex flex-col gap-3">
          <div className="rounded-md border border-border bg-card p-5">
            <Button asChild variant="outline">
              <a href={url}>
                Open video
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

export async function generateStaticParams() {
  const slugs = await getImpactSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ImpactEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getImpactEntryBySlug(slug);

  if (!entry) {
    return {
      title: "Impact Entry / Tetiaroa Society",
    };
  }

  return {
    title: `${entry.seoTitle ?? entry.title} / Tetiaroa Society`,
    description: entry.seoDescription ?? entry.summary,
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

export default async function ImpactEntryPage({ params }: ImpactEntryPageProps) {
  const { slug } = await params;
  const entry = await getImpactEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

  return (
    <>
      <TopToolbar copy={homeCopies.en.toolbar} />
      <PrimaryRouteDock active="impact" />
      <main className="bg-background text-foreground">
        <article>
          <section className="relative isolate min-h-[560px] overflow-hidden border-b border-border pt-14 md:pt-16">
            <Image
              src={entry.heroImage}
              alt=""
              fill
              className="object-cover opacity-55"
              priority
              sizes="100vw"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_16_14/.38)_0%,rgb(7_16_14/.75)_70%,var(--background)_100%),linear-gradient(90deg,var(--background)_0%,rgb(7_16_14/.55)_45%,rgb(7_16_14/.18)_100%)]"
            />
            <div className="relative mx-auto flex min-h-[calc(560px-3.5rem)] max-w-[1540px] flex-col justify-end px-5 py-10 sm:px-8 md:min-h-[calc(560px-4rem)] md:px-9 lg:px-10">
              <Button asChild variant="link" className="mb-8 h-auto w-fit p-0 font-mono">
                <Link href="/impact">
                  <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" />
                  Back to Impact Feed
                </Link>
              </Button>
              <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em]">
                <Badge variant="secondary" className="h-auto font-mono">
                  {entry.category}
                </Badge>
                <Badge variant="outline" className="h-auto font-mono">
                  {entry.entryType}
                </Badge>
                <time className="text-foreground/82" dateTime={entry.latestUpdate}>
                  {formatDate(entry.latestUpdate)}
                </time>
              </div>
              <h1 className="mt-5 max-w-5xl font-display text-5xl leading-none text-foreground sm:text-6xl md:text-7xl">
                {entry.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-foreground/86 sm:text-lg">
                {entry.summary}
              </p>
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
                        Timeline
                      </dt>
                      <dd className="mt-1 text-sm text-foreground">
                        {entry.projectDates ?? formatDate(entry.publishedAt)}
                      </dd>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-[32px_1fr] gap-3">
                    <MapPinIcon aria-hidden="true" />
                    <div>
                      <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        Location
                      </dt>
                      <dd className="mt-1 text-sm text-foreground">
                        {entry.location}
                      </dd>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm text-foreground">{entry.status}</dd>
                  </div>
                  {entry.affiliation ? (
                    <>
                      <Separator />
                      <div>
                        <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          Affiliation
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {entry.affiliation}
                        </dd>
                      </div>
                    </>
                  ) : null}
                </dl>

                <div className="mt-6 flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="h-auto">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </aside>

            <div className="min-w-0">
              <div className="mx-auto flex max-w-4xl flex-col gap-6">
                {entry.body.length ? (
                  <PortableText
                    value={entry.body}
                    components={portableTextComponents}
                  />
                ) : (
                  <p className="text-base leading-8 text-muted-foreground">
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
                    Gallery
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
                    Team
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
      <SiteFooter copy={homeCopies.en.footer} />
    </>
  );
}
