import type { Metadata } from "next";
import { ENGLISH_OUR_STORY_URL } from "@/app/language-links";
import { OurStoryPage } from "./our-story-page";
import { ourStoryCopy } from "./our-story-content";

export const metadata: Metadata = {
  title: ourStoryCopy.metadata.title,
  description: ourStoryCopy.metadata.description,
  alternates: {
    canonical: ENGLISH_OUR_STORY_URL,
  },
  openGraph: {
    type: "article",
    title: ourStoryCopy.metadata.title,
    description: ourStoryCopy.metadata.description,
    url: ENGLISH_OUR_STORY_URL,
    locale: "en_US",
    images: [
      {
        url: "https://www.tetiaroasociety.org/story/history-new-living-handoff.png",
        width: 1983,
        height: 793,
        alt: "Tetiaroa Society's story from Marlon Brando's idea to present-day stewardship",
      },
    ],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: ourStoryCopy.metadata.title,
  description: ourStoryCopy.metadata.description,
  url: ENGLISH_OUR_STORY_URL,
  inLanguage: "en",
  publisher: {
    "@type": "Organization",
    name: "Tetiaroa Society",
    url: "https://www.tetiaroasociety.org/",
  },
  about: [
    "Tetiaroa",
    "Marlon Brando",
    "Tetiaroa Society",
    "Conservation",
    "Polynesian cultural heritage",
    "Island resilience",
  ],
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Tetiaroa Society",
        item: "https://www.tetiaroasociety.org/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Our Story",
        item: ENGLISH_OUR_STORY_URL,
      },
    ],
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <OurStoryPage />
    </>
  );
}
