import type { StationApplicationMessages } from "./validation";

export type StationApplicationFormCopy = {
  title: string;
  description: string;
  managerNote: string;
  fields: {
    name: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    institution: { label: string; placeholder: string; description: string };
    role: { label: string; placeholder: string };
    projectTitle: { label: string; placeholder: string };
    projectType: { legend: string; description: string };
    dates: { legend: string; description: string };
    arrival: { label: string };
    departure: { label: string };
    partySize: { label: string; placeholder: string };
    summary: { label: string; placeholder: string; description: string };
    acknowledgement: { legend: string; label: string; description: string };
  };
  submitLabel: string;
  pendingLabel: string;
  successTitle: string;
  successMessage: string;
  errorTitle: string;
  genericError: string;
  validation: StationApplicationMessages;
};

export const stationApplicationCopyEn: StationApplicationFormCopy = {
  title: "Start your application",
  description:
    "This reaches the station manager, who will tell you which permits your project needs and whether your dates work. It is the first step, not the whole application — the formal one is filed in RAMS.",
  managerNote:
    "Expect a reply within a few working days. The atoll is on Tahiti time (UTC−10).",
  fields: {
    name: { label: "Your name", placeholder: "First and last name" },
    email: { label: "Email", placeholder: "you@university.edu" },
    institution: {
      label: "Institution or organisation",
      placeholder: "University, agency, or organisation",
      description: "Where the project is based. Write “Independent” if it isn't.",
    },
    role: { label: "Your role", placeholder: "Select your role" },
    projectTitle: {
      label: "Project title",
      placeholder: "A working title is fine",
    },
    projectType: {
      legend: "Project type",
      description: "Projects may be scientific, educational, or cultural.",
    },
    dates: {
      legend: "Dates you have in mind",
      description:
        "Optional, and not binding. Leave blank if the field season isn't set yet.",
    },
    arrival: { label: "Arrival" },
    departure: { label: "Departure" },
    partySize: {
      label: "How many people",
      placeholder: "Select a party size",
    },
    summary: {
      label: "What you want to do",
      placeholder:
        "What are you asking, what will you need on site, and who is funding it?",
      description:
        "A short paragraph is enough. Mention lab, boat, or dive needs, and any Scientific Advisory Board member already sponsoring the work.",
    },
    acknowledgement: {
      legend: "Before you send",
      label:
        "I understand the full process takes three to six months, and that projects need Scientific Advisory Board sponsorship and full funding to be approved.",
      description:
        "Nothing is approved in anticipation of future funding.",
    },
  },
  submitLabel: "Send to the station manager",
  pendingLabel: "Sending…",
  successTitle: "Your enquiry is on its way",
  successMessage:
    "The station manager has it. You'll hear back with guidance on permits and dates — then you can file the formal application in RAMS.",
  errorTitle: "That didn't send",
  genericError:
    "Something went wrong on our end. Please try again, or write to us from the contact page.",
  validation: {
    nameRequired: "Please add your name.",
    nameTooLong: "That name is too long.",
    emailRequired: "Please add an email address.",
    emailInvalid: "That doesn't look like an email address.",
    emailTooLong: "That email address is too long.",
    institutionRequired: "Please add your institution or organisation.",
    institutionTooLong: "That is too long.",
    roleRequired: "Please select your role.",
    roleInvalid: "Please select a role from the list.",
    projectTitleRequired: "Please add a project title.",
    projectTitleTooLong: "That title is too long.",
    projectTypeRequired: "Please choose a project type.",
    projectTypeInvalid: "Please choose a project type from the list.",
    dateInvalid: "Please use a valid date.",
    departureBeforeArrival: "Departure can't be before arrival.",
    partySizeRequired: "Please tell us how many people are coming.",
    partySizeInvalid: "Please select a party size from the list.",
    summaryRequired: "Please describe what you want to do.",
    summaryTooShort: "A sentence or two more, please.",
    summaryTooLong: "That is longer than we can accept here.",
    acknowledgementRequired: "Please confirm you've read this.",
  },
};

export const stationApplicationCopyFr: StationApplicationFormCopy = {
  title: "Commencer votre candidature",
  description:
    "Ce message arrive au responsable de la station, qui vous dira de quels permis votre projet a besoin et si vos dates sont possibles. C'est la première étape, pas le dossier complet : celui-ci se dépose dans RAMS.",
  managerNote:
    "Comptez quelques jours ouvrés pour la réponse. L'atoll est à l'heure de Tahiti (UTC−10).",
  fields: {
    name: { label: "Votre nom", placeholder: "Prénom et nom" },
    email: { label: "E-mail", placeholder: "vous@universite.fr" },
    institution: {
      label: "Institution ou organisme",
      placeholder: "Université, agence ou organisme",
      description:
        "Là où le projet est rattaché. Indiquez « Indépendant » si ce n'est pas le cas.",
    },
    role: { label: "Votre rôle", placeholder: "Sélectionnez votre rôle" },
    projectTitle: {
      label: "Titre du projet",
      placeholder: "Un titre provisoire suffit",
    },
    projectType: {
      legend: "Type de projet",
      description:
        "Les projets peuvent être scientifiques, éducatifs ou culturels.",
    },
    dates: {
      legend: "Dates envisagées",
      description:
        "Facultatif et non contractuel. Laissez vide si la saison de terrain n'est pas fixée.",
    },
    arrival: { label: "Arrivée" },
    departure: { label: "Départ" },
    partySize: {
      label: "Combien de personnes",
      placeholder: "Sélectionnez un effectif",
    },
    summary: {
      label: "Ce que vous souhaitez faire",
      placeholder:
        "Quelle est votre question, de quoi aurez-vous besoin sur place, et qui finance ?",
      description:
        "Un court paragraphe suffit. Précisez vos besoins en laboratoire, bateau ou plongée, ainsi que tout membre du Conseil scientifique parrainant déjà le projet.",
    },
    acknowledgement: {
      legend: "Avant d'envoyer",
      label:
        "Je comprends que la procédure complète prend trois à six mois, et qu'un projet doit être parrainé par le Conseil scientifique et intégralement financé pour être approuvé.",
      description:
        "Rien n'est approuvé dans l'attente d'un financement futur.",
    },
  },
  submitLabel: "Envoyer au responsable de la station",
  pendingLabel: "Envoi en cours…",
  successTitle: "Votre demande est partie",
  successMessage:
    "Le responsable de la station l'a reçue. Vous recevrez des indications sur les permis et les dates, puis vous pourrez déposer le dossier officiel dans RAMS.",
  errorTitle: "L'envoi a échoué",
  genericError:
    "Un problème est survenu de notre côté. Réessayez, ou écrivez-nous depuis la page contact.",
  validation: {
    nameRequired: "Merci d'indiquer votre nom.",
    nameTooLong: "Ce nom est trop long.",
    emailRequired: "Merci d'indiquer une adresse e-mail.",
    emailInvalid: "Cette adresse e-mail ne semble pas valide.",
    emailTooLong: "Cette adresse e-mail est trop longue.",
    institutionRequired: "Merci d'indiquer votre institution ou organisme.",
    institutionTooLong: "C'est trop long.",
    roleRequired: "Merci de sélectionner votre rôle.",
    roleInvalid: "Merci de choisir un rôle dans la liste.",
    projectTitleRequired: "Merci d'indiquer un titre de projet.",
    projectTitleTooLong: "Ce titre est trop long.",
    projectTypeRequired: "Merci de choisir un type de projet.",
    projectTypeInvalid: "Merci de choisir un type de projet dans la liste.",
    dateInvalid: "Merci d'indiquer une date valide.",
    departureBeforeArrival:
      "Le départ ne peut pas précéder l'arrivée.",
    partySizeRequired: "Merci d'indiquer le nombre de personnes.",
    partySizeInvalid: "Merci de choisir un effectif dans la liste.",
    summaryRequired: "Merci de décrire ce que vous souhaitez faire.",
    summaryTooShort: "Encore une phrase ou deux, s'il vous plaît.",
    summaryTooLong: "C'est plus long que ce que nous pouvons accepter ici.",
    acknowledgementRequired: "Merci de confirmer que vous avez lu ceci.",
  },
};

export const stationApplicationCopies = {
  en: stationApplicationCopyEn,
  fr: stationApplicationCopyFr,
};

/** Default export kept for the English page and the server action fallback. */
export const stationApplicationCopy = stationApplicationCopyEn;

/**
 * Option values live in validation.ts and must stay stable across locales,
 * so only the visible labels are translated here.
 */
export const stationApplicationOptionLabels = {
  en: {
    role: {
      "principal-investigator": "Principal investigator",
      "postdoctoral-researcher": "Postdoctoral researcher",
      "graduate-student": "Graduate student",
      "undergraduate-student": "Undergraduate student",
      "course-instructor": "Field course instructor",
      other: "Other",
    },
    projectType: {
      research: "Research",
      education: "Field course",
      cultural: "Cultural",
    },
    partySize: {
      "1-2": "1–2 people",
      "3-5": "3–5 people",
      "6-10": "6–10 people",
      "11-18": "11–18 people",
    },
  },
  fr: {
    role: {
      "principal-investigator": "Responsable scientifique",
      "postdoctoral-researcher": "Chercheur postdoctoral",
      "graduate-student": "Doctorant ou master",
      "undergraduate-student": "Étudiant en licence",
      "course-instructor": "Encadrant de stage de terrain",
      other: "Autre",
    },
    projectType: {
      research: "Recherche",
      education: "Stage de terrain",
      cultural: "Culturel",
    },
    partySize: {
      "1-2": "1–2 personnes",
      "3-5": "3–5 personnes",
      "6-10": "6–10 personnes",
      "11-18": "11–18 personnes",
    },
  },
} as const;
