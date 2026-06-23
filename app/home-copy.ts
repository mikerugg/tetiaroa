import type { DepthStop } from "./depth-scene";
import type { LanternDonateLabels, LanternTier } from "./lantern-donate";
import type { SiteFooterCopy } from "./site-footer";
import type { TopToolbarCopy } from "./top-toolbar";
import type { VrViewerLabels } from "./vr-viewer";
import {
  ENGLISH_HOME_PATH,
  ENGLISH_TEAM_PATH,
  FRENCH_HOME_PATH,
  FRENCH_HOME_URL,
  FRENCH_TEAM_PATH,
} from "./language-links";

export type HomeLocale = "en" | "fr";

type ScanReadout = {
  label: string;
  at: number;
};

type KidProgram = {
  badge: string;
  title: string;
  copy: string;
  image: string;
  alt: string;
};

type HomeCopy = {
  locale: HomeLocale;
  toolbar: TopToolbarCopy;
  footer: SiteFooterCopy;
  depthAriaLabel: string;
  depthStops: DepthStop[];
  hero: {
    coordinatesPlace: string;
    titleLine1: string;
    titleLine2: string;
    watchCta: string;
  };
  dive: {
    eyebrow: string;
    title: string;
    copy: string;
    cue: string;
  };
  honu: {
    kickerLine1: string;
    kickerLine2: string;
    title: string;
    copy: string;
    chips: [string, string];
    renderAlt: string;
    renderCaption: string;
    cta: string;
    viewer: VrViewerLabels;
  };
  turtles: {
    kicker: string;
    title: string;
    copy: string;
    stat: string;
    caption: string;
  };
  sharks: {
    kicker: string;
    title: string;
    copy: string;
    stat: string;
    caption: string;
  };
  twin: {
    kicker: string;
    title: string;
    copy: string;
    stat: string;
    imageAlt: string;
    readouts: ScanReadout[];
  };
  kids: {
    eyebrow: string;
    titleLead: string;
    titleEmphasis: string;
    copy: string;
    programs: KidProgram[];
    bannerCaption: string;
  };
  night: {
    eyebrow: string;
    titleLines: [string, string];
    beatLines: string[];
    closeLead: string;
    closeStrong: string;
  };
  lantern: {
    tiers: LanternTier[];
    labels: LanternDonateLabels;
  };
};

const sharedKidImages = {
  snorkel:
    "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=900&q=80&auto=format&fit=crop",
  turtle:
    "https://images.unsplash.com/photo-1591025207163-942350e47db2?w=900&q=80&auto=format&fit=crop",
  classroom:
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=900&q=80&auto=format&fit=crop",
};

export const homeCopies: Record<HomeLocale, HomeCopy> = {
  en: {
    locale: "en",
    toolbar: {
      ariaLabel: "Primary",
      homeHref: ENGLISH_HOME_PATH,
      teamHref: ENGLISH_TEAM_PATH,
      teamLabel: "Our Team",
      logoLabel: "Our Logo",
      languageHref: FRENCH_HOME_PATH,
      languageLabel: "FR",
      languageHrefLang: "fr",
      languageLang: "fr",
      languageAriaLabel: "Lire en français",
      donateHref: `${ENGLISH_HOME_PATH}#donation-levels`,
      donateLabel: "Donate",
    },
    footer: {
      homeHref: ENGLISH_HOME_PATH,
      description:
        "Teti'aroa is not a backdrop. We protect the atoll through field science, island stewardship, and education rooted in place.",
      columns: [
        {
          title: "Explore",
          links: [
            { href: ENGLISH_HOME_PATH, label: "Home" },
            { href: ENGLISH_TEAM_PATH, label: "Our Team" },
            { href: "/our-logo", label: "Logo meaning" },
            { href: "/impact", label: "Impact Feed" },
          ],
        },
        {
          title: "Fieldwork",
          links: [
            { href: "/#honu-xr", label: "Honu XR" },
            { href: "/#turtles", label: "Sea turtle sanctuary" },
            { href: "/#sharks", label: "Lemon shark nursery" },
            { href: "/#twin", label: "Digital twin" },
          ],
        },
        {
          title: "Connect",
          links: [
            { href: "/turtle-tales", label: "Turtle Tales" },
            { href: "/field-station", label: "Field Station" },
            { href: "https://www.tetiaroasociety.org/", label: "Official site" },
            { href: "https://www.tetiaroasociety.org/donate", label: "Donate" },
          ],
        },
      ],
      ctaEyebrow: "Back the fieldwork",
      ctaCopy:
        "Your gift becomes turtle patrols, reef monitoring, student lessons, and the unglamorous daily care an atoll needs.",
      ctaHref: "https://www.tetiaroasociety.org/donate",
      ctaLabel: "Fund the work",
      legal: "Tetiaroa Society / EIN 45-1080688",
      place: "Society Islands / French Polynesia",
    },
    depthAriaLabel: "Dive depth navigation",
    depthStops: [
      {
        id: "hero",
        depth: 0,
        label: "Surface",
        color: "#2ea8b5",
        transmission: "0 m — thanks for diving with us",
      },
      {
        id: "dive",
        depth: 0,
        label: "The dive",
        color: "#1e96a6",
        transmission: "ballast trimmed — ready when you are",
      },
      {
        id: "honu-xr",
        depth: 104,
        label: "Honu XR",
        color: "#02060e",
        transmission: "−104 m — this is my dive. welcome aboard",
      },
      {
        id: "turtles",
        depth: 5,
        label: "Turtles",
        color: "#0e7e8a",
        transmission: "−5 m — nursery on the port side",
      },
      {
        id: "sharks",
        depth: 20,
        label: "Sharks",
        color: "#0b4e66",
        transmission: "−20 m — easy… juveniles on the reef edge",
      },
      {
        id: "twin",
        depth: 40,
        label: "Data",
        color: "#071f33",
        transmission: "−40 m — scanning. the twin is in sync",
      },
      {
        id: "kids",
        depth: 2,
        label: "Tamari'i",
        color: "#8fd8cf",
        transmission: "surfacing — warm water ahead",
      },
      {
        id: "lanterns",
        depth: 0,
        label: "Connected",
        color: "#04101e",
        transmission: "night ops — the chain starts on this beach",
      },
    ],
    hero: {
      coordinatesPlace: "Society Islands / French Polynesia",
      titleLine1: "Save the island.",
      titleLine2: "Save the world.",
      watchCta: "Watch the film / 2:14",
    },
    dive: {
      eyebrow: "Te Hohonu — the deep",
      title: "Dive deeper.",
      copy: "One atoll. A hundred metres of story. Scroll to dive.",
      cue: "dive",
    },
    honu: {
      kickerLine1: "Project 01 — Honu XR",
      kickerLine2: "the deep-water submersible",
      title: "Meet Honu. Built to bring the ocean to everyone.",
      copy:
        "Built by Tetiaroa Society with DOER Marine and Google, Honu — Tahitian for sea turtle — carries scientists and budding oceanographers to reefs and species too deep for a diver to reach. Descents will be filmed by state-of-the-art 360° XR cameras: Now any classroom on Earth can put on a headset and go on a VR field trip to Tetiaroa.",
      chips: [
        "built with doer marine + google",
        "xr field trips for every classroom",
      ],
      renderAlt:
        "Render of the Honu submersible — acrylic dome, robotic arms, DOER Marine livery",
      renderCaption: "honu · design render · doer marine",
      cta: "Watch in fullscreen / VR",
      viewer: {
        recording: "rec — capturing dive 15",
        depth: "−104 m · 8k 360°",
        dragHint: "drag to look",
      },
    },
    turtles: {
      kicker: "Project 02 — sea turtle sanctuary",
      title: "The nursery in the shallows.",
      copy:
        "Every November, green sea turtles emerge out on the same sand where they hatched. Last season the patrol counted 214 nests — each one mapped, shaded, and kept safe until the hatchlings made it to the sea.",
      stat: "214 nests / 2025 season",
      caption: "honu · green sea turtle · −5 m",
    },
    sharks: {
      kicker: "Project 03 — lemon shark nursery",
      title: "Where the lagoon raises predators.",
      copy:
        "Juvenile lemon sharks spend their first years inside the reef's protection. The sanctuary keeps the nursery intact — and with it, the food web that holds the whole atoll together.",
      stat: "3 km of protected reef edge",
      caption: "ma'o · lemon shark · −20 m",
    },
    twin: {
      kicker: "Project 04 — digital twin + biocode",
      title: "Foundational Data.",
      copy:
        "Every reef head, every current, every one of 167 species — scanned, sequenced, and rebuilt as a living digital twin. When the real Tetiaroa changes, the twin sees it first.",
      stat: "167 species in the biocode",
      imageAlt: "Branching coral being mapped",
      readouts: [
        { label: "reef health — indexed", at: 0.3 },
        { label: "species DNA — cataloged", at: 0.52 },
        { label: "ecosystem signals — synced", at: 0.74 },
      ],
    },
    kids: {
      eyebrow: "Education that connects",
      titleLead: "Tamari'i",
      titleEmphasis: "little chiefs of the lagoon.",
      copy:
        "Tamari'i means children — and these are science classes you can swim in. Tetiaroa's classrooms have no walls and the field trips have fins.",
      programs: [
        {
          badge: "Ages 6+",
          title: "Snorkel school",
          copy:
            "First fins, first reef. Lagoon safety and species spotting before the homework starts.",
          image: sharedKidImages.snorkel,
          alt: "Bright coral in shallow water",
        },
        {
          badge: "Nesting season",
          title: "Junior night patrol",
          copy:
            "Kids walk a real nesting beach with the turtle team — torches off, eyes up.",
          image: sharedKidImages.turtle,
          alt: "Sea turtle near the surface at night",
        },
        {
          badge: "Every term",
          title: "Ora Hoa classroom",
          copy:
            "Ora Hoa — 'friends of life' — brings Polynesian students and Polynesian science to the Ecostation all year long.",
          image: sharedKidImages.classroom,
          alt: "Students learning outdoors",
        },
      ],
      bannerCaption: "release day at the sanctuary — the part nobody skips",
    },
    night: {
      eyebrow: "We need you",
      titleLines: ["What hatches here", "doesn't stay here."],
      beatLines: [
        "On Teti'aroa, a nest begins to hatch — our staff guide 96 baby turtles to the water.",
        "Footage and data from the night patrol stream to our servers and across the world.",
        "In a classroom on the other side of the world, a child puts on a headset and discovers a passion for the ocean.",
        "One of those kids starts a local beach clean-up, another studies marine biology.",
        "25 years later, one of those sea turtle hatchlings returns to the same beach to lay her own eggs.",
        "... and those kids, now grown, teach their own children about our place in this world.",
      ],
      closeLead: "These stories begin with you.",
      closeStrong: "Light the way.",
    },
    lantern: {
      tiers: [
        {
          amount: "$25",
          period: "/mo",
          name: "Friend",
          description:
            "Keeps a patrol equipped on the beach — tags, batteries, red torches.",
        },
        {
          amount: "$100",
          period: "/mo",
          name: "Steward",
          description: "One full turtle-patrol night during nesting season.",
        },
        {
          amount: "$500",
          period: "/mo",
          name: "Patron",
          description:
            "A month of the science that travels — Ecostation fieldwork and the digital twin in sync.",
        },
        {
          amount: "$—",
          period: "/mo",
          name: "Your own",
          description: "Pick an amount, or fund a program directly.",
          custom: true,
        },
      ],
      labels: {
        ariaLabel: "Select your donation level",
        emptySelection: "Pick a lantern to light",
        customAmountRequired: "Enter an amount to light it",
        lightPrefix: "Light the path",
        customAmountLabel: "your amount",
        backToTop: "Back to the top",
        currencySymbol: "$",
      },
    },
  },
  fr: {
    locale: "fr",
    toolbar: {
      ariaLabel: "Navigation principale",
      homeHref: FRENCH_HOME_PATH,
      teamHref: FRENCH_TEAM_PATH,
      teamLabel: "L'équipe",
      logoLabel: "Le logo",
      languageHref: ENGLISH_HOME_PATH,
      languageLabel: "EN",
      languageHrefLang: "en",
      languageLang: "en",
      languageAriaLabel: "Read in English",
      donateHref: `${FRENCH_HOME_PATH}#donation-levels`,
      donateLabel: "Donner",
    },
    footer: {
      homeHref: FRENCH_HOME_PATH,
      description:
        "Teti'aroa n'est pas un décor. Nous protégeons l'atoll par la science de terrain, le soin quotidien de l'île et une éducation ancrée dans ce lieu.",
      columns: [
        {
          title: "Explorer",
          links: [
            { href: FRENCH_HOME_PATH, label: "Accueil" },
            { href: FRENCH_TEAM_PATH, label: "Notre équipe" },
            { href: "/our-logo", label: "Sens du logo" },
            { href: "/impact", label: "Fil d'impact" },
          ],
        },
        {
          title: "Terrain",
          links: [
            { href: `${FRENCH_HOME_PATH}#honu-xr`, label: "Honu XR" },
            {
              href: `${FRENCH_HOME_PATH}#turtles`,
              label: "Sanctuaire des tortues",
            },
            {
              href: `${FRENCH_HOME_PATH}#sharks`,
              label: "Nurserie des requins citrons",
            },
            { href: `${FRENCH_HOME_PATH}#twin`, label: "Jumeau numérique" },
          ],
        },
        {
          title: "Relier",
          links: [
            { href: "/turtle-tales", label: "Turtle Tales" },
            { href: "/field-station", label: "Field Station" },
            { href: FRENCH_HOME_URL, label: "Site officiel" },
            { href: "https://www.tetiaroasociety.org/donate", label: "Donner" },
          ],
        },
      ],
      ctaEyebrow: "Soutenir le terrain",
      ctaCopy:
        "Votre don devient des patrouilles tortues, du suivi récifal, des leçons pour les élèves et le soin discret dont un atoll a besoin chaque jour.",
      ctaHref: "https://www.tetiaroasociety.org/donate",
      ctaLabel: "Financer le travail",
      legal: "Tetiaroa Society / EIN 45-1080688",
      place: "Îles de la Société / Polynésie française",
    },
    depthAriaLabel: "Navigation par profondeur de plongée",
    depthStops: [
      {
        id: "hero",
        depth: 0,
        label: "Surface",
        color: "#2ea8b5",
        transmission: "0 m — merci d'avoir plongé avec nous",
      },
      {
        id: "dive",
        depth: 0,
        label: "La plongée",
        color: "#1e96a6",
        transmission: "ballast réglé — prêt quand vous l'êtes",
      },
      {
        id: "honu-xr",
        depth: 104,
        label: "Honu XR",
        color: "#02060e",
        transmission: "−104 m — voici ma plongée. bienvenue à bord",
      },
      {
        id: "turtles",
        depth: 5,
        label: "Tortues",
        color: "#0e7e8a",
        transmission: "−5 m — nurserie sur bâbord",
      },
      {
        id: "sharks",
        depth: 20,
        label: "Requins",
        color: "#0b4e66",
        transmission: "−20 m — doucement… les jeunes sont au bord du récif",
      },
      {
        id: "twin",
        depth: 40,
        label: "Données",
        color: "#071f33",
        transmission: "−40 m — scan en cours. le jumeau est synchronisé",
      },
      {
        id: "kids",
        depth: 2,
        label: "Tamari'i",
        color: "#8fd8cf",
        transmission: "remontée — eau chaude devant",
      },
      {
        id: "lanterns",
        depth: 0,
        label: "Reliés",
        color: "#04101e",
        transmission: "opérations de nuit — la chaîne commence sur cette plage",
      },
    ],
    hero: {
      coordinatesPlace: "Îles de la Société / Polynésie française",
      titleLine1: "Sauver l'île.",
      titleLine2: "Sauver le monde.",
      watchCta: "Regarder le film / 2:14",
    },
    dive: {
      eyebrow: "Te Hohonu — les profondeurs",
      title: "Plongez plus loin.",
      copy: "Un atoll. Cent mètres d'histoire. Faites défiler pour plonger.",
      cue: "plonger",
    },
    honu: {
      kickerLine1: "Projet 01 — Honu XR",
      kickerLine2: "le submersible des grands fonds",
      title: "Voici Honu. Conçu pour ouvrir l'océan à tous.",
      copy:
        "Construit par Tetiaroa Society avec DOER Marine et Google, Honu — tortue marine en tahitien — emmène scientifiques et jeunes océanographes vers des récifs et des espèces trop profonds pour les plongeurs. Les descentes seront filmées avec des caméras XR 360° de pointe : ainsi, n'importe quelle classe dans le monde pourra enfiler un casque et partir en sortie de terrain virtuelle à Tetiaroa.",
      chips: [
        "conçu avec doer marine + google",
        "sorties XR pour toutes les classes",
      ],
      renderAlt:
        "Rendu du submersible Honu — dôme acrylique, bras robotiques, livrée DOER Marine",
      renderCaption: "honu · rendu de design · doer marine",
      cta: "Regarder en plein écran / VR",
      viewer: {
        recording: "rec — plongée 15 en cours",
        depth: "−104 m · 8k 360°",
        dragHint: "faites glisser pour regarder",
      },
    },
    turtles: {
      kicker: "Projet 02 — sanctuaire des tortues marines",
      title: "La nurserie des eaux peu profondes.",
      copy:
        "Chaque novembre, les tortues vertes reviennent sur le sable même où elles sont nées. La saison dernière, la patrouille a compté 214 nids — chacun cartographié, ombragé et protégé jusqu'à l'arrivée des nouveau-nés à la mer.",
      stat: "214 nids / saison 2025",
      caption: "honu · tortue verte · −5 m",
    },
    sharks: {
      kicker: "Projet 03 — nurserie des requins citrons",
      title: "Là où le lagon élève les prédateurs.",
      copy:
        "Les jeunes requins citrons passent leurs premières années à l'abri du récif. Le sanctuaire garde la nurserie intacte — et avec elle, la chaîne du vivant qui tient tout l'atoll ensemble.",
      stat: "3 km de bord récifal protégé",
      caption: "ma'o · requin citron · −20 m",
    },
    twin: {
      kicker: "Projet 04 — jumeau numérique + biocode",
      title: "Données fondatrices.",
      copy:
        "Chaque tête de corail, chaque courant, chacune des 167 espèces — scannés, séquencés et reconstruits en jumeau numérique vivant. Quand le vrai Tetiaroa change, le jumeau le voit en premier.",
      stat: "167 espèces dans le biocode",
      imageAlt: "Corail ramifié en cours de cartographie",
      readouts: [
        { label: "santé du récif — indexée", at: 0.3 },
        { label: "ADN des espèces — catalogué", at: 0.52 },
        { label: "signaux de l'écosystème — synchronisés", at: 0.74 },
      ],
    },
    kids: {
      eyebrow: "Une éducation qui relie",
      titleLead: "Tamari'i",
      titleEmphasis: "petits chefs du lagon.",
      copy:
        "Tamari'i signifie enfants — et ici, les cours de science se vivent dans l'eau. Les salles de classe de Tetiaroa n'ont pas de murs, et les sorties de terrain ont des palmes.",
      programs: [
        {
          badge: "Dès 6 ans",
          title: "École de snorkeling",
          copy:
            "Premières palmes, premier récif. Sécurité dans le lagon et observation des espèces avant les devoirs.",
          image: sharedKidImages.snorkel,
          alt: "Corail lumineux en eau peu profonde",
        },
        {
          badge: "Saison de ponte",
          title: "Patrouille de nuit junior",
          copy:
            "Les enfants marchent sur une vraie plage de ponte avec l'équipe tortues — lampes éteintes, regard levé.",
          image: sharedKidImages.turtle,
          alt: "Tortue marine près de la surface la nuit",
        },
        {
          badge: "Chaque trimestre",
          title: "Classe Ora Hoa",
          copy:
            "Ora Hoa — « amis de la vie » — relie toute l'année les élèves polynésiens et la science polynésienne à l'Écostation.",
          image: sharedKidImages.classroom,
          alt: "Élèves apprenant dehors",
        },
      ],
      bannerCaption:
        "jour de relâcher au sanctuaire — le moment que personne ne manque",
    },
    night: {
      eyebrow: "Nous avons besoin de vous",
      titleLines: ["Ce qui éclôt ici", "ne reste pas ici."],
      beatLines: [
        "À Teti'aroa, un nid commence à éclore — notre équipe guide 96 bébés tortues jusqu'à l'eau.",
        "Les images et les données de la patrouille de nuit filent vers nos serveurs, puis autour du monde.",
        "Dans une classe à l'autre bout du monde, un enfant met un casque et découvre une passion pour l'océan.",
        "L'un de ces enfants lance un nettoyage de plage local, un autre étudie la biologie marine.",
        "Vingt-cinq ans plus tard, l'une de ces tortues revient sur la même plage pour pondre à son tour.",
        "... et ces enfants, devenus adultes, apprennent à leurs propres enfants quelle est notre place dans ce monde.",
      ],
      closeLead: "Ces histoires commencent avec vous.",
      closeStrong: "Éclairez le chemin.",
    },
    lantern: {
      tiers: [
        {
          amount: "$25",
          period: "/mois",
          name: "Ami",
          description:
            "Équipe une patrouille sur la plage — balises, batteries, lampes rouges.",
        },
        {
          amount: "$100",
          period: "/mois",
          name: "Gardien",
          description:
            "Finance une nuit complète de patrouille tortues pendant la saison de ponte.",
        },
        {
          amount: "$500",
          period: "/mois",
          name: "Mécène",
          description:
            "Un mois de science en mouvement — terrain à l'Écostation et jumeau numérique synchronisés.",
        },
        {
          amount: "$—",
          period: "/mois",
          name: "À votre rythme",
          description:
            "Choisissez un montant, ou financez directement un programme.",
          custom: true,
        },
      ],
      labels: {
        ariaLabel: "Choisir votre niveau de don",
        emptySelection: "Choisissez une lanterne à allumer",
        customAmountRequired: "Saisissez un montant pour l'allumer",
        lightPrefix: "Allumer le chemin",
        customAmountLabel: "votre montant",
        backToTop: "Retour en haut",
        currencySymbol: "$",
      },
    },
  },
};
