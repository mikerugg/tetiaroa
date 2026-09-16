import type { PortableTextBlock } from "@portabletext/react";

export const guideCategories = ["birds", "plants", "fish", "turtles", "marine-mammals", "invertebrates"] as const;
export const guideHabitats = ["motu-shore", "lagoon-reef", "open-ocean"] as const;
export type GuideCategoryId = (typeof guideCategories)[number];
export type GuideHabitatId = (typeof guideHabitats)[number];
export type GuideLocale = "en" | "fr";
export type GuideBodyBlock = PortableTextBlock | ({ _type: string; _key?: string } & Record<string, unknown>);

export type GuideImage = {
  url: string;
  alt: string;
  caption?: string;
  credit?: string;
  license?: string;
  width?: number;
  height?: number;
};
export type GuideResource = { title: string; url: string; pageUrl?: string; kind?: "source" | "document" | "audio" | "video"; credit?: string };
export type GuideRelatedStory = { title: string; href: string; summary?: string; image?: GuideImage };
export type GuidePlantFacts = {
  family?: string;
  biogeographicalStatus?: string;
  lifeForm?: string;
  abundance?: string;
  ecosystem?: string;
};

/** A localized, lightweight entry; safe to send to the directory client. */
export type GuideCard = {
  id: string;
  locale: GuideLocale;
  slug: string;
  category: GuideCategoryId;
  subgroup?: string;
  habitats: GuideHabitatId[];
  title: string;
  scientificName: string;
  localNames?: string;
  summary: string;
  image?: GuideImage;
  searchNames: string[];
  href: string;
  alternateHref?: string;
};
export type GuideProfile = GuideCard & {
  body: GuideBodyBlock[];
  otherNames?: string;
  occurrence?: string;
  plantFacts?: GuidePlantFacts;
  gallery: GuideImage[];
  resources: GuideResource[];
  relatedStories: GuideRelatedStory[];
  updatedAt?: string;
};
export type GuideCategory = {
  id: GuideCategoryId;
  title: string;
  introduction: string;
  image?: GuideImage;
  count: number;
  subgroups: { id: string; title: string }[];
  resources: GuideResource[];
  relatedStories: GuideRelatedStory[];
};
export type GuideHabitat = { id: GuideHabitatId; title: string; introduction: string; image?: GuideImage; featuredEntries?: GuideCard[] };
export type GuideExperience = { title: string; description: string; href: string; linkLabel: string; image?: GuideImage };
export type AtollHub = {
  title: string;
  introduction: string;
  image?: GuideImage;
  habitats: GuideHabitat[];
  experiences?: GuideExperience[];
  featuredEntries: GuideCard[];
  relatedStories: GuideRelatedStory[];
};
export type GuideSitemapEntry = { path: string; alternatePath?: string; locale: GuideLocale; updatedAt?: string };
