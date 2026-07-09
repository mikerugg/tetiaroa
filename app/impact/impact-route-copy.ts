import { homeCopies, type HomeLocale } from "../home-copy";
import {
  ENGLISH_IMPACT_PATH,
  FRENCH_IMPACT_PATH,
} from "../language-links";
import type { TopToolbarCopy } from "../top-toolbar";

export type ImpactLocale = HomeLocale;

export function getImpactToolbarCopy(locale: ImpactLocale): TopToolbarCopy {
  return {
    ...homeCopies[locale].toolbar,
    impactHref: locale === "fr" ? FRENCH_IMPACT_PATH : ENGLISH_IMPACT_PATH,
    languageHref: locale === "fr" ? ENGLISH_IMPACT_PATH : FRENCH_IMPACT_PATH,
    languageLabel: locale === "fr" ? "EN" : "FR",
    languageHrefLang: locale === "fr" ? "en" : "fr",
    languageLang: locale === "fr" ? "en" : "fr",
    languageAriaLabel: locale === "fr" ? "Read in English" : "Lire en français",
  };
}

export const impactRouteCopy: Record<
  ImpactLocale,
  {
    title: string;
    description: string;
    entryFallbackTitle: string;
    backLabel: string;
    teamBackLabel: string;
    publishedLabel: string;
    updatedLabel: string;
    locationLabel: string;
    affiliationLabel: string;
    roleLabel: string;
    researchPartnerLabel: string;
    organizationLabel: string;
    tagsLabel: string;
    galleryLabel: string;
    teamLabel: string;
    openDocumentLabel: string;
    openVideoLabel: string;
  }
> = {
  en: {
    title: "Impact Feed / Tetiaroa Society",
    description:
      "Field notes and project updates from Tetiaroa Society's conservation, research, education, and restoration work.",
    entryFallbackTitle: "Impact Entry / Tetiaroa Society",
    backLabel: "Back to Impact Feed",
    teamBackLabel: "Back to Team page",
    publishedLabel: "Published",
    updatedLabel: "Updated",
    locationLabel: "Location",
    affiliationLabel: "Affiliation",
    roleLabel: "Role",
    researchPartnerLabel: "Research Partner",
    organizationLabel: "Organization",
    tagsLabel: "Tags",
    galleryLabel: "Gallery",
    teamLabel: "Team",
    openDocumentLabel: "Open document",
    openVideoLabel: "Open video",
  },
  fr: {
    title: "Fil d'impact / Tetiaroa Society",
    description:
      "Notes de terrain, projets et actualités de Tetiaroa Society autour de la conservation, de la recherche, de l'éducation et de la restauration.",
    entryFallbackTitle: "Entrée d'impact / Tetiaroa Society",
    backLabel: "Retour au fil d'impact",
    teamBackLabel: "Retour à la page Équipe",
    publishedLabel: "Publié",
    updatedLabel: "Mis à jour",
    locationLabel: "Lieu",
    affiliationLabel: "Affiliation",
    roleLabel: "Rôle",
    researchPartnerLabel: "Partenaire de recherche",
    organizationLabel: "Organisation",
    tagsLabel: "Mots-clés",
    galleryLabel: "Galerie",
    teamLabel: "Équipe",
    openDocumentLabel: "Ouvrir le document",
    openVideoLabel: "Ouvrir la vidéo",
  },
};
