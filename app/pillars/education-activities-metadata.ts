import type { Metadata } from "next";
import { educationActivitiesCopy, getEducationActivitiesPath } from "./education-activities-content";
import type { PillarLocale } from "./pillar-content";

export function getEducationActivitiesMetadata(locale: PillarLocale): Metadata {
  const copy = educationActivitiesCopy[locale];
  const title = `${copy.title} | Tetiaroa Society`;
  const path = getEducationActivitiesPath(locale);

  return {
    metadataBase: new URL("https://www.tetiaroasociety.org"),
    title,
    description: copy.metadataDescription,
    alternates: {
      canonical: path,
      languages: { en: getEducationActivitiesPath("en"), fr: getEducationActivitiesPath("fr") },
    },
    openGraph: {
      title,
      description: copy.metadataDescription,
      url: path,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      images: [{ url: "/pillars/education-culture/lakeside-students.jpg", alt: copy.heroImageAlt }],
    },
  };
}
