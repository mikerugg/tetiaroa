import { homeCopies, type HomeLocale } from "../home-copy";
import {
  ENGLISH_EMAIL_LIST_PATH,
  FRENCH_EMAIL_LIST_PATH,
} from "../language-links";
import type { TopToolbarCopy } from "../top-toolbar";
import type { EmailListValidationMessages } from "./validation";

export type EmailListLocale = HomeLocale;

export type EmailListFormCopy = {
  title: string;
  description: string;
  emailLabel: string;
  emailPlaceholder: string;
  languageLegend: string;
  languageDescription: string;
  englishLabel: string;
  frenchLabel: string;
  consentLabel: string;
  privacyPolicyHref: string;
  privacyPolicyLabel: string;
  submitLabel: string;
  pendingLabel: string;
  successTitle: string;
  successMessage: string;
  errorTitle: string;
  genericError: string;
  validation: EmailListValidationMessages;
};

export type EmailListRouteCopy = {
  metadataTitle: string;
  metadataDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  footnote: string;
  form: EmailListFormCopy;
};

export function getEmailListToolbarCopy(
  locale: EmailListLocale,
): TopToolbarCopy {
  return {
    ...homeCopies[locale].toolbar,
    languageHref:
      locale === "fr" ? ENGLISH_EMAIL_LIST_PATH : FRENCH_EMAIL_LIST_PATH,
    languageLabel: locale === "fr" ? "EN" : "FR",
    languageHrefLang: locale === "fr" ? "en" : "fr",
    languageLang: locale === "fr" ? "en" : "fr",
    languageAriaLabel: locale === "fr" ? "Read in English" : "Lire en français",
  };
}

export const emailListRouteCopy: Record<
  EmailListLocale,
  EmailListRouteCopy
> = {
  en: {
    metadataTitle: "Email List | Tetiaroa Society",
    metadataDescription:
      "Join the Tetiaroa Society email list in English or French.",
    eyebrow: "From the atoll",
    title: "Stay connected to Teti'aroa.",
    intro:
      "Field notes, new films, research updates, and stories from the people caring for the atoll—sent only when there is something worth sharing beyond the reef.",
    footnote: "Unsubscribe at any time using the link in any email.",
    form: {
      title: "Sign-up for the Tetiaroa Society Email List",
      description: "Please add your email and select your preferred language.",
      emailLabel: "Email address",
      emailPlaceholder: "you@example.com",
      languageLegend: "Email language",
      languageDescription: "Select your preferred language.",
      englishLabel: "English",
      frenchLabel: "Français",
      consentLabel:
        "I agree to receive Tetiaroa Society emails. I can unsubscribe at any time. I have read the",
      privacyPolicyHref: "/privacy",
      privacyPolicyLabel: "Privacy Policy",
      submitLabel: "Join the email list",
      pendingLabel: "Subscribing…",
      successTitle: "You're on the list",
      successMessage:
        "You're subscribed, and your language preference has been saved.",
      errorTitle: "We could not sign you up",
      genericError:
        "We could not complete your signup. Please wait a moment and try again.",
      validation: {
        emailRequired: "Enter your email address.",
        emailInvalid: "Enter a valid email address.",
        emailTooLong: "Keep the email address under 254 characters.",
        consentRequired:
          "You must agree to receive emails from Tetiaroa Society before joining the list.",
        languageRequired: "Choose English or French.",
        languageInvalid: "Choose one of the two available languages.",
      },
    },
  },
  fr: {
    metadataTitle: "Liste de diffusion | Tetiaroa Society",
    metadataDescription:
      "Rejoignez la liste de diffusion de Tetiaroa Society en français ou en anglais.",
    eyebrow: "Nouvelles de l'atoll",
    title: "Gardez le lien avec Teti'aroa.",
    intro:
      "Notes de terrain, nouveaux films, avancées de la recherche et récits de celles et ceux qui prennent soin de l'atoll — envoyés seulement lorsque nous avons quelque chose qui mérite de franchir le récif.",
    footnote:
      "Vous pouvez vous désabonner à tout moment depuis le lien inclus dans chaque e-mail.",
    form: {
      title: "Inscrivez-vous à la liste de diffusion de Tetiaroa Society",
      description:
        "Veuillez saisir votre adresse e-mail et sélectionner votre langue préférée.",
      emailLabel: "Adresse e-mail",
      emailPlaceholder: "vous@example.com",
      languageLegend: "Langue des e-mails",
      languageDescription: "Sélectionnez votre langue préférée.",
      englishLabel: "Anglais",
      frenchLabel: "Français",
      consentLabel:
        "J'accepte de recevoir les e-mails de Tetiaroa Society. Je peux me désabonner à tout moment. J'ai lu la",
      privacyPolicyHref: "/fr/privacy",
      privacyPolicyLabel: "Politique de confidentialité",
      submitLabel: "Rejoindre la liste",
      pendingLabel: "Inscription en cours…",
      successTitle: "Votre inscription est enregistrée",
      successMessage:
        "Votre inscription et votre langue préférée ont été enregistrées. Aucun e-mail de confirmation n'est nécessaire.",
      errorTitle: "Nous n'avons pas pu vous inscrire",
      genericError:
        "L'inscription n'a pas pu être finalisée. Patientez un instant, puis réessayez.",
      validation: {
        emailRequired: "Saisissez votre adresse e-mail.",
        emailInvalid: "Saisissez une adresse e-mail valide.",
        emailTooLong: "Limitez l'adresse e-mail à 254 caractères.",
        consentRequired:
          "Vous devez accepter de recevoir les e-mails de Tetiaroa Society avant de rejoindre la liste.",
        languageRequired: "Choisissez le français ou l'anglais.",
        languageInvalid: "Choisissez l'une des deux langues proposées.",
      },
    },
  },
};
