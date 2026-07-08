import { homeCopies, type HomeLocale } from "../home-copy";
import {
  ENGLISH_DONATE_PATH,
  FRENCH_DONATE_PATH,
} from "../language-links";
import type { TopToolbarCopy } from "../top-toolbar";

export type DonateLocale = HomeLocale;

export type DonateSupportCopy = {
  title: string;
  lead: string;
  mattersTitle: string;
  matters: string[];
  waysTitle: string;
  ways: string[];
  togetherTitle: string;
  togetherBody: string;
  taxLines: string[];
};

export type DonateMoreWaysCopy = {
  title: string;
  subtitle: string;
  checkTitle: string;
  checkBody: string;
  checkAddress: string[];
  wireTitle: string;
  wireBody: string;
};

export type DonateFinancialYearCopy = {
  year: string;
  dateRange: string;
  annualReportHref: string;
  form990Href?: string;
};

export type DonateFinancialCopy = {
  body: string[];
  annualReportLabel: string;
  form990Label: string;
  unavailableLabel: string;
  years: DonateFinancialYearCopy[];
};

export type DonateExperienceCopy = {
  embedTitleAttribute: string;
  support: DonateSupportCopy;
  moreWays: DonateMoreWaysCopy;
  financial: DonateFinancialCopy;
};

export type DonateRouteCopy = {
  metadataTitle: string;
  metadataDescription: string;
  title: string;
  experience: DonateExperienceCopy;
};

export function getDonateToolbarCopy(locale: DonateLocale): TopToolbarCopy {
  const donateHref = locale === "fr" ? FRENCH_DONATE_PATH : ENGLISH_DONATE_PATH;

  return {
    ...homeCopies[locale].toolbar,
    donateHref,
    languageHref: locale === "fr" ? ENGLISH_DONATE_PATH : FRENCH_DONATE_PATH,
    languageLabel: locale === "fr" ? "EN" : "FR",
    languageHrefLang: locale === "fr" ? "en" : "fr",
    languageLang: locale === "fr" ? "en" : "fr",
    languageAriaLabel: locale === "fr" ? "Read in English" : "Lire en français",
  };
}

export const donateRouteCopy: Record<DonateLocale, DonateRouteCopy> = {
  en: {
    metadataTitle: "Donate | Tetiaroa Society",
    metadataDescription:
      "Our goal at Tetiaroa Society is simple: We want to ensure that Tetiaroa is protected and used as a model of sustainability for all to see.",
    title: "Become a Guardian of Tetiaroa: Every Dollar Makes a Difference",
    experience: {
      embedTitleAttribute: "Tetiaroa Society secure donation form",
      support: {
        title:
          "Your support has the power to change the future — for Tetiaroa and for the planet.",
        lead:
          "By making a tax-deductible donation to the Tetiaroa Society, you are directly funding critical conservation efforts, scientific research, and education programs for local schools. Your generosity helps us advance sustainability efforts on Tetiaroa, setting a global example for island and earth stewardship.",
        mattersTitle: "Why Your Contribution Matters:",
        matters: [
          "83% of our operating budget is invested directly in our programs for conservation, education, and scientific research.",
          "Your donation supports protecting ecosystems, educating the next generation of leaders, advancing climate and ocean science, and creating a model for sustainability.",
        ],
        waysTitle: "Ways to Support:",
        ways: [
          "Make a one-time, tax-deductible donation",
          "Become a monthly supporter and provide ongoing impact",
          "Fund a ranger, research project, or education scholarship",
          "Host a fundraiser in your community.",
        ],
        togetherTitle: "Together, We're Making a Difference",
        togetherBody:
          "We deeply appreciate your commitment to protecting our planet's future. Your contribution is more than a donation — it’s an investment in a healthier world. We look forward to sharing the progress you're helping make possible!",
        taxLines: [
          "Tetiaroa Society is a 501(c)(3) nonprofit organization.",
          "Tax ID # 45-1080688",
          "Tetiaroa Society FP Nº Tahiti B54770",
        ],
      },
      moreWays: {
        title: "More ways to Give",
        subtitle: "Let us know what suits you",
        checkTitle: "Donate by check",
        checkBody: "Please make checks out to Tetiaroa Society and mail to:",
        checkAddress: [
          "Tetiaroa Society",
          "c/o Peterson Russell Kelly Livengood PLLC",
          "10900 NE 4th Street, Suite 1850",
          "Bellevue, WA 98004",
        ],
        wireTitle: "Donate by wire transfer",
        wireBody:
          "Should you have an interest in wiring your donation to Tetiaroa Society, please contact us to obtain the wire transfer information needed by your bank.",
      },
      financial: {
        body: [
          "Tetiaroa Society supports donors who seek transparency in the nonprofit organizations they support. Please review Tetiaroa Society’s IRS 990 Forms and annual impact reports below.",
          "Tetiaroa Society is a 501(c)3 – Tax ID #23-7245152. Donations are 100% tax-deductible as allowed by law.",
        ],
        annualReportLabel: "Annual Report",
        form990Label: "Form 990",
        unavailableLabel: "Form 990 pending",
        years: [
          {
            year: "Year 2025",
            dateRange: "1 January, 2025 – 31 December, 2025",
            annualReportHref:
              "https://www.tetiaroasociety.org/documents/impact-report-2025-en",
          },
          {
            year: "Year 2024",
            dateRange: "1 January, 2024 – 31 December, 2024",
            annualReportHref:
              "https://www.tetiaroasociety.org/documents/impact-report-2024",
            form990Href: "https://www.tetiaroasociety.org/documents/ts-2024-990",
          },
          {
            year: "Year 2023",
            dateRange: "1 January, 2023 – 31 December, 2023",
            annualReportHref:
              "https://www.tetiaroasociety.org/documents/impact-report-2023",
            form990Href: "https://www.tetiaroasociety.org/documents/ts-2023-990",
          },
          {
            year: "Year 2022",
            dateRange: "1 January, 2022 – 31 December, 2022",
            annualReportHref:
              "https://www.tetiaroasociety.org/documents/impact-report-2022",
            form990Href: "https://www.tetiaroasociety.org/documents/ts-2022-990",
          },
        ],
      },
    },
  },
  fr: {
    metadataTitle: "Faire un don | Tetiaroa Society",
    metadataDescription:
      "Notre objectif au sein de la Tetiaroa Society est simple : Nous voulons nous assurer que Tetiaroa est protegee et utilisee comme modele de developpement durable pour tous.",
    title: "Devenez un Gardien de Tetiaroa : Chaque Don Fait la Différence",
    experience: {
      embedTitleAttribute: "Formulaire de don securise de Tetiaroa Society",
      support: {
        title:
          "Votre soutien a le pouvoir de changer l'avenir — pour Tetiaroa et pour la planète.",
        lead:
          "En faisant un don déductible des impôts à Tetiaroa Society, vous financez directement des efforts de conservation essentiels, de la recherche scientifique et des programmes éducatifs pour les écoles locales. Votre générosité nous aide à avancer dans nos efforts pour la durabilité sur Tetiaroa, en établissant un modèle mondial de gestion durable des îles et de la planète.",
        mattersTitle: "Pourquoi Votre Contribution Est Cruciale :",
        matters: [
          "83% de notre budget opérationnel est investi directement dans nos programmes de conservation, d'éducation et de recherche scientifique.",
          "Votre don soutient la protection des écosystèmes, l'éducation de la prochaine génération de leaders, l'avancement des sciences climatiques et océaniques, ainsi que la création d'un modèle de durabilité.",
        ],
        waysTitle: "Comment Soutenir :",
        ways: [
          "Faites un don unique, déductible des impôts",
          "Devenez un donateur mensuel pour un impact continu.",
          "Financez un garde, un projet de recherche ou une bourse d'éducation.",
          "Organisez une collecte de fonds dans votre communauté.",
        ],
        togetherTitle: "Ensemble, Nous Faisons La Différence",
        togetherBody:
          "Nous apprécions profondément votre engagement à protéger l'avenir de notre planète. Votre contribution est bien plus qu'un simple don — c'est un investissement dans un monde plus sain. Nous avons hâte de partager avec vous les progrès que vous contribuez à rendre possibles !",
        taxLines: [
          "Tetiaroa Society est une organisation à but non lucratif exonérée d'impôts sous la section 501(c)(3) du Code des impôts.",
          "Numéro d'ID fiscal : 45-1080688",
          "Tetiaroa Society FP Nº Tahiti B54770",
        ],
      },
      moreWays: {
        title: "Autres moyens de faire un don",
        subtitle: "Faites-nous savoir ce qui vous convient",
        checkTitle: "Faites un don par chèque",
        checkBody:
          "Veuillez libeller votre chèque à l'ordre de Tetiaroa Society et l'envoyer à l'adresse suivante :",
        checkAddress: [
          "Tetiaroa Society",
          "c/o Peterson Russell Kelly Livengood PLLC",
          "10900 NE 4th Street, Suite 1850",
          "Bellevue, WA 98004 États-Unis",
        ],
        wireTitle: "Faites un don par virement bancaire",
        wireBody:
          "Si vous souhaitez effectuer un virement bancaire à la Tetiaroa Society, veuillez contacter Tj Tate afin d'obtenir les informations nécessaires à votre banque.",
      },
      financial: {
        body: [
          "Tetiaroa Society supports donors who seek transparency in the nonprofit organizations they support. Please review Tetiaroa Society’s IRS 990 Forms and annual impact reports below.",
          "Tetiaroa Society is a 501(c)3 – Tax ID #23-7245152. Donations are 100% tax-deductible as allowed by law.",
        ],
        annualReportLabel: "Annual Report",
        form990Label: "Form 990",
        unavailableLabel: "Form 990 pending",
        years: [
          {
            year: "Year 2025",
            dateRange: "1 January, 2025 – 31 December, 2025",
            annualReportHref:
              "https://www.tetiaroasociety.org/documents/impact-report-2025-en",
          },
          {
            year: "Year 2024",
            dateRange: "1 January, 2024 – 31 December, 2024",
            annualReportHref:
              "https://www.tetiaroasociety.org/documents/impact-report-2024",
            form990Href: "https://www.tetiaroasociety.org/documents/ts-2024-990",
          },
          {
            year: "Year 2023",
            dateRange: "1 January, 2023 – 31 December, 2023",
            annualReportHref:
              "https://www.tetiaroasociety.org/documents/impact-report-2023",
            form990Href: "https://www.tetiaroasociety.org/documents/ts-2023-990",
          },
          {
            year: "Year 2022",
            dateRange: "1 January, 2022 – 31 December, 2022",
            annualReportHref:
              "https://www.tetiaroasociety.org/documents/impact-report-2022",
            form990Href: "https://www.tetiaroasociety.org/documents/ts-2022-990",
          },
        ],
      },
    },
  },
};
