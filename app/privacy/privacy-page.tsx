import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import { homeCopies, type HomeLocale } from "../home-copy";
import {
  ENGLISH_PRIVACY_PATH,
  FRENCH_PRIVACY_PATH,
} from "../language-links";
import { SiteFooter } from "../site-footer";
import { TopToolbar, type TopToolbarCopy } from "../top-toolbar";
import type { ImpactBodyBlock } from "@/lib/impact/types";
import { getImpactEntryBySlug } from "@/lib/sanity/impact";

type PrivacyLocale = HomeLocale;

const privacyConfig: Record<
  PrivacyLocale,
  { slug: string }
> = {
  en: { slug: "privacy-policy" },
  fr: { slug: "politique-de-confidentialite" },
};

const portableTextComponents: PortableTextComponents<ImpactBodyBlock> = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-12 font-display text-4xl leading-tight text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 font-display text-2xl leading-tight text-foreground">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l border-border pl-5 text-base leading-8 text-muted-foreground">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="text-base leading-8 text-muted-foreground">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="flex list-disc flex-col gap-2 pl-6 text-base leading-8 text-muted-foreground">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="flex list-decimal flex-col gap-2 pl-6 text-base leading-8 text-muted-foreground">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href =
        value && typeof value === "object" && "href" in value
          ? String(value.href ?? "")
          : "";

      if (!href) {
        return <>{children}</>;
      }

      return (
        <a className="text-primary underline underline-offset-4" href={href}>
          {children}
        </a>
      );
    },
  },
};

function getPrivacyToolbarCopy(locale: PrivacyLocale): TopToolbarCopy {
  return {
    ...homeCopies[locale].toolbar,
    languageHref: locale === "fr" ? ENGLISH_PRIVACY_PATH : FRENCH_PRIVACY_PATH,
    languageLabel: locale === "fr" ? "EN" : "FR",
    languageHrefLang: locale === "fr" ? "en" : "fr",
    languageLang: locale === "fr" ? "en" : "fr",
    languageAriaLabel: locale === "fr" ? "Read in English" : "Lire en français",
  };
}

async function getPrivacyEntry(locale: PrivacyLocale) {
  const config = privacyConfig[locale];
  return getImpactEntryBySlug(config.slug, locale);
}

export async function PrivacyPage({ locale }: { locale: PrivacyLocale }) {
  const entry = await getPrivacyEntry(locale);

  if (!entry?.title) {
    notFound();
  }

  const body = entry.body ?? [];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <TopToolbar copy={getPrivacyToolbarCopy(locale)} />

      <article className="px-5 pb-20 pt-28 md:px-8 md:pb-24 md:pt-32 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <header className="flex flex-col gap-5 border-b border-border pb-10">
            <h1 className="font-display text-5xl leading-tight sm:text-6xl md:text-7xl">
              {entry.title}
            </h1>
            {entry.summary ? (
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                {entry.summary}
              </p>
            ) : null}
          </header>

          <div className="flex flex-col gap-6 pt-10">
            {body.length ? (
              <PortableText value={body} components={portableTextComponents} />
            ) : (
              <p className="text-base leading-8 text-muted-foreground">
                {entry.summary}
              </p>
            )}
          </div>

          <p className="mt-12 border-t border-border pt-8 text-sm text-muted-foreground">
            <Link
              className="text-primary underline underline-offset-4"
              href={locale === "fr" ? "/fr/contact" : "/contact"}
            >
              {locale === "fr" ? "Nous contacter" : "Contact us"}
            </Link>
          </p>
        </div>
      </article>

      <SiteFooter copy={homeCopies[locale].footer} />
    </main>
  );
}
