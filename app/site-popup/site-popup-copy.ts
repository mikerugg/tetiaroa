import type { HomeLocale } from "../home-copy";
import {
  ENGLISH_DONATE_PATH,
  FRENCH_DONATE_PATH,
} from "../language-links";

export type SitePopupImageCopy = {
  src: string;
  alt: string;
  /** Passed to `object-position`, so the crop keeps its subject on both axes. */
  position?: string;
};

export type SitePopupNewsletterCopy = {
  eyebrow: string;
  title: string;
  description: string;
  /** Three short lines at most. They set expectations before the ask. */
  promises: string[];
  image: SitePopupImageCopy;
  emailLabel: string;
  emailPlaceholder: string;
  languageLegend: string;
  englishLabel: string;
  frenchLabel: string;
  consentLabel: string;
  privacyLabel: string;
  privacyHref: string;
  submitLabel: string;
  pendingLabel: string;
  dismissLabel: string;
  footnote: string;
  successTitle: string;
  successBody: string;
  successCloseLabel: string;
  closeLabel: string;
};

export type SitePopupAnnouncementCopy = {
  eyebrow: string;
  title: string;
  description: string;
  /** Short, scannable terms of the offer: the multiplier and the deadline. */
  stat: string;
  image: SitePopupImageCopy;
  ctaLabel: string;
  ctaHref: string;
  dismissLabel: string;
  footnote: string;
  closeLabel: string;
};

export type SitePopupCopy = {
  newsletter: SitePopupNewsletterCopy;
  announcement: SitePopupAnnouncementCopy;
};

const hatchlings: SitePopupImageCopy = {
  src: "/homepage-hero-placeholder.png",
  alt: "Green sea turtle hatchlings crossing the sand toward the water",
  position: "80% 34%",
};

const lagoonSunrise: SitePopupImageCopy = {
  src: "/story/history-new-lagoon-witness.webp",
  alt: "A figure standing in the lagoon at first light, facing a palm-covered motu",
  position: "62% 50%",
};

export const sitePopupCopies: Record<HomeLocale, SitePopupCopy> = {
  en: {
    newsletter: {
      eyebrow: "From the atoll",
      title: "Notes from Teti'aroa",
      description:
        "Join our email list to stay up to date on the latest news, research, events, and films from the Tetiaroa Society.",
      promises: [
        "Newsletters from the Atoll",
        "Our latest films and findings",
        "Exciting partnerships and events",
      ],
      image: hatchlings,
      emailLabel: "Email address",
      emailPlaceholder: "you@example.com",
      languageLegend: "Email language",
      englishLabel: "English",
      frenchLabel: "Français",
      consentLabel: "Email me updates. I have read the",
      privacyLabel: "Privacy Policy",
      privacyHref: "/privacy",
      submitLabel: "Join the list",
      pendingLabel: "Joining…",
      dismissLabel: "Not now",
      footnote: "One-click unsubscribe in every email.",
      successTitle: "You are on the list",
      successBody:
        "The next time the team files something from the atoll, it comes to you.",
      successCloseLabel: "Back to the atoll",
      closeLabel: "Close the email list invitation",
    },
    // Placeholder campaign terms. Replace the amount, multiplier, and deadline
    // before switching `variant` to "announcement" in site-popup-config.ts.
    announcement: {
      eyebrow: "Matching gift",
      title: "Your gift counts twice",
      description:
        "Through December 31, a group of donors is matching every gift to Teti'aroa's research and restoration work, up to $50,000.",
      stat: "2x match · ends Dec 31",
      image: lagoonSunrise,
      ctaLabel: "Double my gift",
      ctaHref: ENGLISH_DONATE_PATH,
      dismissLabel: "Not now",
      footnote:
        "Tetiaroa Society is a U.S. 501(c)(3) nonprofit (Tax ID 45-1080688). Donations are tax-deductible as allowed by U.S. law.",
      closeLabel: "Close the matching gift notice",
    },
  },
  fr: {
    newsletter: {
      eyebrow: "Nouvelles de l'atoll",
      title: "Notes de Teti'aroa",
      description:
        "Inscrivez-vous à notre liste de diffusion pour suivre les actualités, la recherche, les événements et les films de la Tetiaroa Society.",
      promises: [
        "Les lettres d'information de l'atoll",
        "Nos derniers films et résultats",
        "Nos partenariats et nos événements",
      ],
      image: hatchlings,
      emailLabel: "Adresse e-mail",
      emailPlaceholder: "vous@example.com",
      languageLegend: "Langue des e-mails",
      englishLabel: "Anglais",
      frenchLabel: "Français",
      consentLabel: "Envoyez-moi vos nouvelles. J'ai lu la",
      privacyLabel: "Politique de confidentialité",
      privacyHref: "/fr/privacy",
      submitLabel: "Rejoindre la liste",
      pendingLabel: "Inscription…",
      dismissLabel: "Pas maintenant",
      footnote: "Désabonnement en un clic dans chaque e-mail.",
      successTitle: "Votre inscription est enregistrée",
      successBody:
        "Dès que l'équipe enverra des nouvelles de l'atoll, vous les recevrez.",
      successCloseLabel: "Retour à l'atoll",
      closeLabel: "Fermer l'invitation à la liste de diffusion",
    },
    announcement: {
      eyebrow: "Don doublé",
      title: "Votre don compte double",
      description:
        "Jusqu'au 31 décembre, un groupe de donateurs double chaque don destiné à la recherche et à la restauration de Teti'aroa, jusqu'à 50 000 $.",
      stat: "Don doublé · jusqu'au 31 déc.",
      image: lagoonSunrise,
      ctaLabel: "Doubler mon don",
      ctaHref: FRENCH_DONATE_PATH,
      dismissLabel: "Pas maintenant",
      footnote:
        "Tetiaroa Society est une organisation à but non lucratif 501(c)(3) basée aux États-Unis (numéro d'identification fiscale 45-1080688). Les dons sont déductibles des impôts dans les limites prévues par la loi américaine.",
      closeLabel: "Fermer l'annonce",
    },
  },
};
