import type { Metadata } from "next";
import { getAtollPath } from "@/lib/atoll/config";
import type { GuideImage, GuideLocale } from "@/lib/atoll/types";

export function atollMetadata({ locale, title, description, path, alternatePath, image }: {
  locale: GuideLocale; title: string; description: string; path: string; alternatePath?: string | null; image?: GuideImage;
}): Metadata {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tetiaroasociety.org";
  const opposite = locale === "fr" ? "en" : "fr";
  const alternate = alternatePath ?? (locale === "fr" ? path.replace(/^\/fr\//, "/") : `/fr${path}`);
  return {
    metadataBase: new URL(site), title: `${title} / Tetiaroa Society`, description,
    alternates: { canonical: path, languages: { [locale]: path, ...(alternatePath !== null ? { [opposite]: alternate } : {}) } },
    openGraph: { title, description, url: new URL(path, site).toString(), type: "website", locale: locale === "fr" ? "fr_FR" : "en_US", alternateLocale: alternatePath !== null ? [locale === "fr" ? "en_US" : "fr_FR"] : undefined, images: image ? [{ url: new URL(image.url, site).toString(), alt: image.alt }] : undefined },
  };
}

export function atollHubPath(locale: GuideLocale) { return getAtollPath(locale); }
