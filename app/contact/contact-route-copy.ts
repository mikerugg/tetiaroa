import { homeCopies, type HomeLocale } from "../home-copy";
import {
  ENGLISH_CONTACT_PATH,
  FRENCH_CONTACT_PATH,
} from "../language-links";
import type { TopToolbarCopy } from "../top-toolbar";
import type { ContactValidationMessages } from "./validation";

export type ContactLocale = HomeLocale;

export type ContactFieldCopy = {
  label: string;
  placeholder: string;
};

export type ContactFormCopy = {
  title: string;
  description: string;
  fields: {
    name: ContactFieldCopy;
    email: ContactFieldCopy;
    subject: ContactFieldCopy;
    message: ContactFieldCopy;
  };
  validation: ContactValidationMessages;
  submitLabel: string;
  pendingLabel: string;
  successTitle: string;
  successMessage: string;
  errorTitle: string;
  genericError: string;
};

export type ContactRouteCopy = {
  metadataTitle: string;
  metadataDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  form: ContactFormCopy;
};

export function getContactToolbarCopy(locale: ContactLocale): TopToolbarCopy {
  return {
    ...homeCopies[locale].toolbar,
    languageHref: locale === "fr" ? ENGLISH_CONTACT_PATH : FRENCH_CONTACT_PATH,
    languageLabel: locale === "fr" ? "EN" : "FR",
    languageHrefLang: locale === "fr" ? "en" : "fr",
    languageLang: locale === "fr" ? "en" : "fr",
    languageAriaLabel: locale === "fr" ? "Read in English" : "Lire en français",
  };
}

export const contactRouteCopy: Record<ContactLocale, ContactRouteCopy> = {
  en: {
    metadataTitle: "Contact | Tetiaroa Society",
    metadataDescription:
      "Contact Tetiaroa Society about the atoll, field conservation, education, research, partnerships, donations, press, or visits.",
    eyebrow: "Contact",
    title: "Teti'aroa is cared for by people. Write to them here.",
    intro:
      "Behind every program is someone on the atoll or in the office keeping track of turtles, classes, fieldwork, partners, gifts, visits, and the emails that arrive between all of it. Send us a note.",
    form: {
      title: "Write to the Society",
      description:
        "Send us a message.",
      fields: {
        name: {
          label: "Name",
          placeholder: "Your name",
        },
        email: {
          label: "Email",
          placeholder: "you@example.com",
        },
        subject: {
          label: "Subject",
          placeholder: "What is this about?",
        },
        message: {
          label: "Message",
          placeholder: "Tell us what you need.",
        },
      },
      validation: {
        nameRequired: "Tell us your name to start.",
        nameTooLong: "Keep your name under 100 characters.",
        emailRequired: "Tell us where to reply.",
        emailInvalid: "That email address needs one more look.",
        emailTooLong: "Keep your email address under 254 characters.",
        subjectRequired: "Give this a subject so we can route it.",
        subjectTooLong: "Keep the subject under 200 characters.",
        messageRequired: "Write the message before sending.",
        messageTooShort: "Give us at least 10 characters to work with.",
        messageTooLong: "Keep your message under 10,000 characters.",
      },
      submitLabel: "Send message",
      pendingLabel: "Sending",
      successTitle: "Your note has been sent to the Society",
      successMessage:
        "Thank you.",
      errorTitle: "Your note did not send",
      genericError:
        "Something stalled before your message left the page. Please try again in a moment.",
    },
  },
  fr: {
    metadataTitle: "Contact | Tetiaroa Society",
    metadataDescription:
      "Écrivez à Tetiaroa Society au sujet de l'atoll, de la conservation de terrain, de l'éducation, de la recherche, des partenariats, des dons, de la presse ou des visites.",
    eyebrow: "Contact",
    title: "Teti'aroa est protégée par des personnes. Écrivez-leur ici.",
    intro:
      "Derrière chaque programme, il y a quelqu'un sur l'atoll ou au bureau qui suit les tortues, les classes, le terrain, les partenaires, les dons, les visites et les questions qui arrivent entre tout cela. Écrivez-nous. Nous lirons votre message avec attention, puis nous le mettrons entre les bonnes mains.",
    form: {
      title: "Écrire à la Society",
      description:
        "Votre message arrive dans la boîte de la Society ; une personne de l'équipe l'oriente ensuite.",
      fields: {
        name: {
          label: "Nom",
          placeholder: "Votre nom",
        },
        email: {
          label: "Email",
          placeholder: "vous@example.com",
        },
        subject: {
          label: "Sujet",
          placeholder: "De quoi s'agit-il ?",
        },
        message: {
          label: "Message",
          placeholder: "Dites-nous ce dont vous avez besoin.",
        },
      },
      validation: {
        nameRequired: "Dites-nous votre nom pour commencer.",
        nameTooLong: "Limitez votre nom à 100 caractères.",
        emailRequired: "Dites-nous où répondre.",
        emailInvalid: "Cette adresse email mérite une dernière vérification.",
        emailTooLong: "Limitez votre adresse email à 254 caractères.",
        subjectRequired: "Ajoutez un sujet pour que nous puissions l'orienter.",
        subjectTooLong: "Limitez le sujet à 200 caractères.",
        messageRequired: "Écrivez le message avant de l'envoyer.",
        messageTooShort: "Donnez-nous au moins 10 caractères pour commencer.",
        messageTooLong: "Limitez votre message à 10 000 caractères.",
      },
      submitLabel: "Envoyer",
      pendingLabel: "Envoi",
      successTitle: "Votre message est arrivé",
      successMessage:
        "Merci. Il est maintenant dans la boîte de la Society, prêt pour la personne la plus proche du sujet.",
      errorTitle: "Votre message n'est pas parti",
      genericError:
        "Quelque chose a bloqué l'envoi avant que le message quitte la page. Réessayez dans un instant.",
    },
  },
};
