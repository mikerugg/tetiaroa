import { homeCopies, type HomeLocale } from "../home-copy";
import {
  ENGLISH_DONATE_PATH,
  FRENCH_DONATE_PATH,
} from "../language-links";
import type { TopToolbarCopy } from "../top-toolbar";

export type DonateLocale = HomeLocale;

export type DonateStatementCopy = {
  eyebrow: string;
  /** Sits beneath the route-level `title`, which carries the supporter ask. */
  paragraph: string;
  /** Anchors to the widget. Rendered below xl only, where the widget stacks. */
  ctaLabel: string;
};

export type DonateMoreWaysCopy = {
  title: string;
  checkTitle: string;
  checkBody: string;
  checkAddress: string[];
  assetsTitle: string;
  assetsBody: string;
  contactName: string;
  contactTitle: string;
  contactEmail: string;
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
  statement: DonateStatementCopy;
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
    title: "Become a supporter of Tetiaroa Society",
    experience: {
      embedTitleAttribute: "Tetiaroa Society secure donation form",
      statement: {
        eyebrow: "Donate",
        paragraph:
          "You are funding an experiment in whether an island can outlast this century — by protecting the reefs, the turtles, the culture, and the kids who will watch over these atolls long after us. What works on Teti'aroa is designed to travel to every island and coastal community facing the same changing environment.",
        ctaLabel: "Become a supporter",
      },
      moreWays: {
        title: "Other Ways to Donate",
        checkTitle: "Donate by Check",
        checkBody: "Please make checks out to Tetiaroa Society and mail to:",
        checkAddress: [
          "Tetiaroa Society",
          "c/o Peterson Russell Kelly Livengood PLLC",
          "10900 NE 4th Street, Suite 1850",
          "Bellevue, WA 98004",
        ],
        assetsTitle: "Donate Gifts of Assets",
        assetsBody:
          "To include Tetiaroa Society in your estate plans or to make a donation through a gift of stock, Donor Advised Fund, wire transfer, or cryptocurrency, please contact:",
        contactName: "Tj Tate",
        contactTitle: "CEO",
        contactEmail: "ttate@tetiaroasociety.org",
      },
      financial: {
        body: [
          "Tetiaroa Society supports donors who seek transparency in the nonprofit organizations they support. Please review Tetiaroa Society’s IRS 990 Forms and annual impact reports below.",
          "Tetiaroa Society is a U.S.-based 501(c)(3) nonprofit organization (Tax ID # 45-1080688). The organization also holds French Polynesian nonprofit registration under Nº B54770. Donations are 100% tax-deductible as allowed by U.S. law.",
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
    title: "Devenez un soutien de Tetiaroa Society",
    experience: {
      embedTitleAttribute: "Formulaire de don securise de Tetiaroa Society",
      // FR statement copy is a translation of the approved English and should be
      // reviewed by a native speaker before it is considered final.
      statement: {
        eyebrow: "Faire un don",
        paragraph:
          "Vous financez une expérience : celle de savoir si une île peut traverser ce siècle — les récifs, les tortues, la culture, et les enfants qui protégeront ces atolls bien après nous. Ce qui fonctionne à Tetiaroa est conçu pour servir à toutes les îles et communautés côtières confrontées au même environnement en mutation.",
        ctaLabel: "Devenir un soutien",
      },
      moreWays: {
        title: "Autres façons de faire un don",
        checkTitle: "Faire un don par chèque",
        checkBody:
          "Veuillez libeller votre chèque à l'ordre de Tetiaroa Society et l'envoyer à l'adresse suivante :",
        checkAddress: [
          "Tetiaroa Society",
          "c/o Peterson Russell Kelly Livengood PLLC",
          "10900 NE 4th Street, Suite 1850",
          "Bellevue, WA 98004 États-Unis",
        ],
        assetsTitle: "Dons d'actifs",
        assetsBody:
          "Pour inclure Tetiaroa Society dans votre planification successorale ou pour faire un don sous forme d'actions, de fonds orienté par le donateur (Donor Advised Fund), de virement bancaire ou de cryptomonnaie, veuillez contacter :",
        contactName: "Tj Tate",
        contactTitle: "CEO",
        contactEmail: "ttate@tetiaroasociety.org",
      },
      financial: {
        body: [
          "Tetiaroa Society soutient les donateurs qui recherchent la transparence chez les organisations à but non lucratif qu’ils soutiennent. Veuillez consulter ci-dessous les formulaires IRS 990 et les rapports d’impact annuels de Tetiaroa Society.",
          "Tetiaroa Society est une organisation à but non lucratif 501(c)(3) basée aux États-Unis (numéro d’identification fiscale 45-1080688). L’organisation détient également une immatriculation d’association en Polynésie française sous le Nº B54770. Les dons sont déductibles des impôts à 100 % dans les limites prévues par la loi américaine.",
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
