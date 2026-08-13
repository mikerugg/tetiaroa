"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { Box, Button, Card, Flex, Spinner, Stack, Text } from "@sanity/ui";
import { EyeIcon } from "lucide-react";
import {
  type DocumentActionDescription,
  type DocumentActionProps,
  useClient,
} from "sanity";
import { ImpactHtmlPackage } from "@/app/impact/impact-html-package";
import type { ImpactBodyBlock } from "@/lib/impact/types";
import { sanityApiVersion } from "@/lib/sanity/env";
import { impactEntryPreviewByIdQuery } from "@/lib/sanity/queries";

type PreviewImpactEntry = {
  _id: string;
  title?: string | null;
  language?: string | null;
  entryType?: string | null;
  summary?: string | null;
  category?: string | null;
  heroImage?: string | null;
  heroImageAlt?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  location?: string | null;
  affiliations?: Array<{ name?: string | null }> | null;
  tags?: string[] | null;
  body?: ImpactBodyBlock[] | null;
  htmlPackage?: {
    html?: string | null;
    removed?: boolean | null;
  } | null;
  gallery?: Array<{
    image?: string | null;
    alt?: string | null;
    caption?: string | null;
  }> | null;
};

type ImpactEntryPreviewProps = {
  availableLanguages: Array<"en" | "fr">;
  documentId: string;
  title: string;
};

function getString(value: unknown, key: string) {
  if (!value || typeof value !== "object") {
    return "";
  }

  const field = (value as Record<string, unknown>)[key];
  return typeof field === "string" ? field : "";
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
      const href = getString(value, "href");

      return href ? (
        <a
          className="text-primary underline underline-offset-4"
          href={href}
          rel="noreferrer"
          target="_blank"
        >
          {children}
        </a>
      ) : (
        <>{children}</>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const url = getString(value, "url");

      if (!url) {
        return null;
      }

      const alt = getString(value, "alt");
      const caption = getString(value, "caption");

      return (
        <figure className="my-10 flex flex-col gap-3">
          <Image
            src={url}
            alt={alt}
            width={1200}
            height={800}
            className="h-auto w-full rounded-md bg-muted object-contain"
          />
          {caption ? (
            <figcaption className="text-center font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    callout: ({ value }) => (
      <aside className="my-8 rounded-md border border-border bg-card p-5">
        {getString(value, "title") ? (
          <h3 className="font-display text-2xl text-foreground">
            {getString(value, "title")}
          </h3>
        ) : null}
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          {getString(value, "text")}
        </p>
      </aside>
    ),
    statBlock: ({ value }) => (
      <aside className="my-8 rounded-md border border-border bg-card p-5">
        <div className="font-display text-5xl text-foreground">
          {getString(value, "value")}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {getString(value, "label")}
        </p>
      </aside>
    ),
    documentLink: ({ value }) => {
      const url = getString(value, "url");
      const label = getString(value, "label") || "Open document";

      return url ? (
        <a
          className="my-6 inline-flex rounded-md border border-border px-4 py-3 text-sm text-foreground"
          href={url}
          rel="noreferrer"
          target="_blank"
        >
          {label}
        </a>
      ) : null;
    },
  },
};

function formatDate(value: string | null | undefined, language: string | null | undefined) {
  if (!value) {
    return "Date not set";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(language === "fr" ? "fr" : "en", {
    dateStyle: "long",
  }).format(date);
}

function PreviewCanvas({ entry }: { entry: PreviewImpactEntry }) {
  const richHtml =
    entry.htmlPackage?.html && !entry.htmlPackage.removed
      ? entry.htmlPackage.html
      : undefined;
  const body = entry.body ?? [];
  const displayDate = entry.updatedAt ?? entry.publishedAt;

  return (
    <article className="min-h-full bg-background text-foreground">
      <section className="border-b border-border px-6 py-10 sm:px-10 lg:px-14">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,560px)] lg:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              <span className="rounded-full border border-border px-3 py-1">
                {entry.category ?? "Uncategorized"}
              </span>
              <span className="rounded-full border border-border px-3 py-1">
                {entry.entryType ?? "Entry"}
              </span>
              <span className="px-2 py-1">
                {formatDate(displayDate, entry.language)}
              </span>
            </div>
            <h1 className="mt-5 font-display text-5xl leading-none sm:text-6xl">
              {entry.title ?? "Untitled entry"}
            </h1>
            {entry.summary ? (
              <p className="mt-5 max-w-3xl text-base leading-8 text-foreground/80">
                {entry.summary}
              </p>
            ) : null}
          </div>

          <figure className="overflow-hidden rounded-md border border-border bg-muted shadow-2xl">
            {entry.heroImage ? (
              <Image
                src={entry.heroImage}
                alt={entry.heroImageAlt ?? entry.title ?? ""}
                width={1200}
                height={900}
                className="aspect-[4/3] h-auto w-full object-contain"
                priority
              />
            ) : (
              <div className="grid aspect-[4/3] place-items-center px-6 text-center text-sm text-muted-foreground">
                Add a hero image to complete this preview.
              </div>
            )}
          </figure>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-14">
        <aside className="h-fit rounded-md border border-border bg-card/80 p-5 lg:sticky lg:top-0">
          <dl className="flex flex-col gap-5 text-sm">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {entry.language === "fr" ? "Publication" : "Published"}
              </dt>
              <dd className="mt-1">{formatDate(entry.publishedAt, entry.language)}</dd>
            </div>
            {entry.location ? (
              <div className="border-t border-border pt-5">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {entry.language === "fr" ? "Lieu" : "Location"}
                </dt>
                <dd className="mt-1">{entry.location}</dd>
              </div>
            ) : null}
            {entry.affiliations?.length ? (
              <div className="border-t border-border pt-5">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Affiliations
                </dt>
                <dd className="mt-1">
                  <ul className="flex flex-col gap-1">
                    {entry.affiliations.map((affiliation, index) =>
                      affiliation.name ? (
                        <li key={`${affiliation.name}:${index}`}>
                          {affiliation.name}
                        </li>
                      ) : null,
                    )}
                  </ul>
                </dd>
              </div>
            ) : null}
            {entry.tags?.length ? (
              <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                {entry.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border px-2 py-1 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </dl>
        </aside>

        <div className="min-w-0">
          {richHtml ? (
            <ImpactHtmlPackage
              html={richHtml}
              title={`${entry.title ?? "Entry"} — preview`}
            />
          ) : body.length ? (
            <div className="mx-auto flex max-w-4xl flex-col gap-6">
              <PortableText value={body} components={portableTextComponents} />
            </div>
          ) : (
            <p className="mx-auto max-w-4xl text-base leading-8 text-ink-light">
              {entry.summary || "Add body content to complete this preview."}
            </p>
          )}

          {entry.gallery?.length ? (
            <section className="mt-14">
              <h2 className="font-display text-4xl">
                {entry.language === "fr" ? "Galerie" : "Gallery"}
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {entry.gallery.map((item, index) =>
                  item.image ? (
                    <figure key={`${item.image}:${index}`} className="flex flex-col gap-2">
                      <Image
                        src={item.image}
                        alt={item.alt ?? ""}
                        width={900}
                        height={700}
                        className="h-auto w-full rounded-md object-cover"
                      />
                      {item.caption ? (
                        <figcaption className="text-sm text-muted-foreground">
                          {item.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  ) : null,
                )}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </article>
  );
}

function ImpactEntryPreview({
  availableLanguages,
  documentId,
  title,
}: ImpactEntryPreviewProps) {
  const client = useClient({ apiVersion: sanityApiVersion });
  const [language, setLanguage] = useState<"en" | "fr">(
    availableLanguages[0] ?? "en",
  );
  const [result, setResult] = useState<{
    documentId: string;
    language: "en" | "fr";
    entry: PreviewImpactEntry | null;
    error: string;
  }>();

  useEffect(() => {
    const controller = new AbortController();

    void client
      .fetch<PreviewImpactEntry | null>(
        impactEntryPreviewByIdQuery,
        { id: documentId, language },
        { perspective: "raw", signal: controller.signal },
      )
      .then((entry) => {
        setResult({ documentId, language, entry, error: "" });
      })
      .catch((caughtError: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setResult({
          documentId,
          language,
          entry: null,
          error:
            caughtError instanceof Error
              ? caughtError.message
              : "The entry preview could not be loaded.",
        });
      });

    return () => controller.abort();
  }, [client, documentId, language]);

  const isCurrentResult =
    result?.documentId === documentId && result.language === language;
  const entry = isCurrentResult ? result.entry : undefined;
  const error = isCurrentResult ? result.error : "";

  if (error) {
    return (
      <Box padding={4}>
        <Card border padding={4} radius={2} tone="critical">
          <Text size={1}>{error}</Text>
        </Card>
      </Box>
    );
  }

  if (entry === undefined) {
    return (
      <Flex align="center" justify="center" padding={5}>
        <Stack space={3}>
          <Flex justify="center">
            <Spinner muted />
          </Flex>
          <Text muted size={1}>Rendering {title}…</Text>
        </Stack>
      </Flex>
    );
  }

  if (!entry) {
    return (
      <Box padding={4}>
        <Card border padding={4} radius={2} tone="caution">
          <Text size={1}>This version is no longer available to preview.</Text>
        </Card>
      </Box>
    );
  }

  return (
    <Stack space={1}>
      {availableLanguages.length > 1 ? (
        <Card borderBottom padding={3}>
          <Flex gap={2} justify="center">
            <Button
              text="English"
              mode={language === "en" ? "default" : "ghost"}
              tone="primary"
              onClick={() => setLanguage("en")}
            />
            <Button
              text="Français"
              mode={language === "fr" ? "default" : "ghost"}
              tone="primary"
              onClick={() => setLanguage("fr")}
            />
          </Flex>
        </Card>
      ) : null}
      <Box style={{ height: "min(82vh, 1080px)", overflow: "auto" }}>
        <PreviewCanvas entry={entry} />
      </Box>
    </Stack>
  );
}

export function ImpactEntryPreviewAction(
  props: DocumentActionProps,
): DocumentActionDescription {
  const [isOpen, setIsOpen] = useState(false);
  const document = props.version ?? props.draft ?? props.published;
  const english =
    document?.english && typeof document.english === "object"
      ? (document.english as Record<string, unknown>)
      : undefined;
  const french =
    document?.french && typeof document.french === "object"
      ? (document.french as Record<string, unknown>)
      : undefined;
  const legacyTitle =
    document && typeof document.title === "string" ? document.title : undefined;
  const title =
    (typeof english?.title === "string" ? english.title : undefined) ??
    (typeof french?.title === "string" ? french.title : undefined) ??
    legacyTitle ??
    "Impact entry";
  const availableLanguages: Array<"en" | "fr"> = english || french
    ? [
        ...(typeof english?.title === "string" ? (["en"] as const) : []),
        ...(typeof french?.title === "string" ? (["fr"] as const) : []),
      ]
    : [document?.language === "fr" ? "fr" : "en"];

  return {
    label: "Preview entry",
    icon: EyeIcon,
    disabled: !document,
    group: ["paneActions" as const],
    onHandle: () => setIsOpen(true),
    dialog: isOpen && document
      ? {
          type: "dialog" as const,
          header: `Preview: ${title}`,
          width: "full" as const,
          onClose: () => setIsOpen(false),
          content: (
            <ImpactEntryPreview
              key={document._id}
              availableLanguages={availableLanguages}
              documentId={document._id}
              title={title}
            />
          ),
        }
      : false,
  };
}
