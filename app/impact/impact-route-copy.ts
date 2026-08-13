import { homeCopies, type HomeLocale } from "../home-copy";
import {
  ENGLISH_IMPACT_PATH,
  FRENCH_IMPACT_PATH,
} from "../language-links";
import type { TopToolbarCopy } from "../top-toolbar";

export type ImpactLocale = HomeLocale;

export function getImpactToolbarCopy(
  locale: ImpactLocale,
  alternateSlug?: string,
): TopToolbarCopy {
  const languageHref = alternateSlug
    ? locale === "fr"
      ? `${ENGLISH_IMPACT_PATH}/${alternateSlug}`
      : `${FRENCH_IMPACT_PATH}/${alternateSlug}`
    : locale === "fr"
      ? ENGLISH_IMPACT_PATH
      : FRENCH_IMPACT_PATH;

  return {
    ...homeCopies[locale].toolbar,
    impactHref: locale === "fr" ? FRENCH_IMPACT_PATH : ENGLISH_IMPACT_PATH,
    languageHref,
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
    affiliationsLabel: string;
    articleTitleLabel: string;
    iplacesArticleLabel: string;
    organizationLabel: string;
    authorsLabel: string;
    orcidProfileLabel: string;
    dataciteAffiliationLabel: string;
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
    affiliationsLabel: "Affiliations",
    articleTitleLabel: "Title",
    iplacesArticleLabel: "View article on iPlaces (opens in a new tab)",
    organizationLabel: "Organization",
    authorsLabel: "Authors",
    orcidProfileLabel: "ORCID profile (opens in a new tab)",
    dataciteAffiliationLabel:
      "View affiliation in DataCite Commons (opens in a new tab)",
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
    updatedLabel: "Dernière mise à jour",
    locationLabel: "Lieu",
    affiliationLabel: "Affiliation",
    roleLabel: "Rôle",
    affiliationsLabel: "Affiliations",
    articleTitleLabel: "Titre",
    iplacesArticleLabel: "Voir l’article sur iPlaces (s’ouvre dans un nouvel onglet)",
    organizationLabel: "Organisation",
    authorsLabel: "Auteurs",
    orcidProfileLabel: "Profil ORCID (s’ouvre dans un nouvel onglet)",
    dataciteAffiliationLabel:
      "Voir l’affiliation dans DataCite Commons (s’ouvre dans un nouvel onglet)",
    tagsLabel: "Mots-clés",
    galleryLabel: "Galerie",
    teamLabel: "Équipe",
    openDocumentLabel: "Ouvrir le document",
    openVideoLabel: "Ouvrir la vidéo",
  },
};
