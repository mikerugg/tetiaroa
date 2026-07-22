import type { DepthStop } from "./depth-scene";
import type { LanternDonateLabels, LanternTier } from "./lantern-donate";
import type { SiteFooterCopy } from "./site-footer";
import type { TopToolbarCopy } from "./top-toolbar";
import type { VrViewerLabels } from "./vr-viewer";
import {
  ENGLISH_CONTACT_PATH,
  ENGLISH_DONATE_PATH,
  ENGLISH_EMAIL_LIST_PATH,
  ENGLISH_IMPACT_PATH,
  ENGLISH_HOME_PATH,
  ENGLISH_TEAM_PATH,
  FRENCH_CONTACT_PATH,
  FRENCH_DONATE_PATH,
  FRENCH_EMAIL_LIST_PATH,
  FRENCH_IMPACT_PATH,
  FRENCH_HOME_PATH,
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
  href: string;
  cta: string;
  imageFit?: "cover" | "contain";
};

export type Pillar = {
  title: string;
  copy: string;
  areas: [string, string, string];
  image: string;
  alt: string;
  href: string;
  cta: string;
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
  highlight: {
    eyebrow: string;
    title: string;
    copy: string;
    cta: string;
    href: string;
    image: string;
    imageAlt: string;
    carouselLabel: string;
    previousLabel: string;
    nextLabel: string;
    pauseLabel: string;
    playLabel: string;
    ofLabel: string;
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
  sanctuary: {
    kicker: string;
    title: string;
    copy: string;
    stats: [string, string];
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
  impactFeedCta: {
    label: string;
    href: string;
  };
  pillars: {
    eyebrow: string;
    title: string;
    copy: string;
    layoutLabel: string;
    horizontalLabel: string;
    verticalLabel: string;
    storylineLabel: string;
    items: [Pillar, Pillar, Pillar];
  };
  kids: {
    eyebrow: string;
    titleLead: string;
    titleEmphasis: string;
    copy: string;
    programs: KidProgram[];
    bannerCaption: string;
    logoCallout: {
      eyebrow: string;
      title: string;
      copy: string;
      cta: string;
      href: string;
      image: string;
      alt: string;
    };
  };
  story: {
    eyebrow: string;
    title: string;
    lead: string;
    body: string;
    cta: string;
    ctaHref: string;
    promiseLines: [string, string, string];
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
  honuRender: "/sub-render.png",
};

const sharedPillarImages = {
  research:
    "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=1100&q=85&auto=format&fit=crop",
  education:
    "https://www.tetiaroasociety.org/sites/default/files/2021-02/IMG_6446sm.jpg",
  community:
    "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=1100&q=85&auto=format&fit=crop",
};

export const homeCopies: Record<HomeLocale, HomeCopy> = {
  en: {
    locale: "en",
    toolbar: {
      ariaLabel: "Primary",
      menuLabel: "Open navigation menu",
      menuTitle: "Navigation menu",
      homeHref: ENGLISH_HOME_PATH,
      teamHref: ENGLISH_TEAM_PATH,
      teamLabel: "Our Team",
      impactHref: ENGLISH_IMPACT_PATH,
      impactLabel: "Impact Feed",
      logoLabel: "Our Logo",
      storyHref: "/brando-story/work",
      storyLabel: "Our Story",
      languageHref: FRENCH_HOME_PATH,
      languageLabel: "FR",
      languageHrefLang: "fr",
      languageLang: "fr",
      languageAriaLabel: "Lire en français",
      donateHref: ENGLISH_DONATE_PATH,
      donateLabel: "Donate",
    },
    footer: {
      homeHref: ENGLISH_HOME_PATH,
      columns: [
        {
          title: "Explore",
          links: [
            { href: ENGLISH_HOME_PATH, label: "Home" },
            { href: ENGLISH_TEAM_PATH, label: "Our Team" },
            { href: "/our-logo", label: "Our Logo" },
            { href: "/brando-story/work", label: "Our Story" },
          ],
        },
        {
          title: "Projects",
          links: [
            { href: ENGLISH_IMPACT_PATH, label: "Impact Feed" },
            { href: "/#honu-xr", label: "Honu XR" },
            { href: "/#sanctuary", label: "Turtle and shark sanctuary" },
            { href: "/#twin", label: "Digital twin" },
          ],
        },
        {
          title: "Connect",
          links: [
            { href: "/turtle-tales", label: "Turtle Tales" },
            { href: "/field-station", label: "Field Station" },
            { href: ENGLISH_EMAIL_LIST_PATH, label: "Email list" },
            {
              href: ENGLISH_CONTACT_PATH,
              label: "Contact us",
            },
          ],
        },
      ],
      ctaEyebrow: "Back The Work",
      ctaCopy:
        "Your gift becomes patrols, monitoring, lessons, and the daily care the atoll needs.",
      ctaHref: ENGLISH_DONATE_PATH,
      ctaLabel: "Fund the work",
      socials: [
        {
          platform: "contact",
          href: ENGLISH_CONTACT_PATH,
          label: "Contact us",
        },
        {
          platform: "facebook",
          href: "https://www.facebook.com/tetiaroasociety",
          label: "Facebook",
        },
        {
          platform: "instagram",
          href: "https://www.instagram.com/tetiaroasociety",
          label: "Instagram",
        },
        {
          platform: "linkedin",
          href: "https://www.linkedin.com/company/tetiaroa-society/",
          label: "LinkedIn",
        },
        {
          platform: "youtube",
          href: "https://www.youtube.com/channel/UCPGkXEFTswBQft-8LUcvmCw",
          label: "YouTube",
        },
      ],
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
        id: "highlight",
        depth: 0,
        label: "Highlight",
        color: "#227f8b",
        transmission: "surface signal — Honu updates incoming",
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
        id: "sanctuary",
        depth: 20,
        label: "Sanctuary",
        color: "#0b6174",
        transmission: "−5 to −20 m — nests and nurseries in view",
      },
      {
        id: "twin",
        depth: 40,
        label: "Data",
        color: "#071f33",
        transmission: "−40 m — scanning. the twin is in sync",
      },
      {
        id: "pillars",
        depth: 8,
        label: "Pillars",
        color: "#0a4e4c",
        transmission: "foundation map: three pillars in view",
      },
      {
        id: "kids",
        depth: 2,
        label: "Tamari'i",
        color: "#8fd8cf",
        transmission: "surfacing — warm water ahead",
      },
      {
        id: "our-story",
        depth: 0,
        label: "Our Story",
        color: "#5a3b21",
        transmission: "archive open — the promise is still alive",
      },
      {
        id: "lanterns",
        depth: 0,
        label: "Connected",
        color: "#04101e",
        transmission: "night ops — the chain starts on this beach",
      },
      {
        id: "donation-levels",
        depth: 0,
        label: "Donate",
        color: "#04101e",
        transmission: "donation levels — choose how to help",
      },
    ],
    hero: {
      coordinatesPlace: "Society Islands / French Polynesia",
      titleLine1: "Save the island.",
      titleLine2: "Save the world.",
      watchCta: "Watch the film / 2:14",
    },
    highlight: {
      eyebrow: "Highlight",
      title: "Honu heads to Catalina for testing",
      copy:
        "Before Honu can open Teti’aroa’s deep water to students and scientists, it has to prove itself at sea. That work begins off Catalina Island, where the team is preparing for dive tests and a launch party.",
      cta: "Learn More",
      href: "#honu-xr",
      image: "/launch-party.jpg",
      imageAlt:
        "People seated inside Honu's clear observation dome during launch preparations",
      carouselLabel: "Featured impact stories",
      previousLabel: "Previous story",
      nextLabel: "Next story",
      pauseLabel: "Pause automatic rotation",
      playLabel: "Resume automatic rotation",
      ofLabel: "of",
    },
    dive: {
      eyebrow: "Te Mau Tia'i — the guardians",
      title: "Protect. Educate. Empower.",
      copy: "One atoll. A thousand metres of story.",
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
    sanctuary: {
      kicker: "Project 02 — sea turtle + lemon shark sanctuary",
      title: "The nursery in the shallows.",
      copy:
        "Every November, green sea turtles return to the same sand where they hatched. Just offshore, juvenile lemon sharks spend their first years inside the reef's protection. Teti'aroa's sanctuary work holds both beginnings together: nests mapped and guarded through hatching season, reef edge kept intact so the lagoon can keep raising the predators that hold the food web in balance.",
      stats: ["214 nests / 2025 season", "3 km of protected reef edge"],
      caption: "honu to ma'o · sanctuary sequence · −5 to −20 m",
    },
    twin: {
      kicker: "Project 03 — digital twin + biocode",
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
    impactFeedCta: {
      label: "See All Our Projects on the Impact Feed",
      href: ENGLISH_IMPACT_PATH,
    },
    pillars: {
      eyebrow: "Pillars of Tetiaroa",
      title: "Three responsibilities, one atoll.",
      copy:
        "Research shows us what is changing, education turns that knowledge into care, and global collaboration carries what works beyond the reef, so each pillar strengthens the other two.",
      layoutLabel: "Card layout",
      horizontalLabel: "Horizontal",
      verticalLabel: "Vertical",
      storylineLabel: "Storyline",
      items: [
        {
          title: "Research and Conservation",
          copy:
            "Measure the atoll, change one condition, and measure again, so every conservation action teaches us what to do next.",
          areas: [
            "TARP, habitat care, and biosecurity",
            "ATTRACT and conservation research",
            "Reef, lagoon, motu, and species monitoring",
          ],
          image: sharedPillarImages.research,
          alt: "Coral reef and lagoon habitat used for conservation research",
          href: "/pillars/research-conservation",
          cta: "Explore research and conservation",
        },
        {
          title: "Education and Culture",
          copy:
            "A student follows a question from field science into Polynesian knowledge and cultural history, and the island itself becomes the teacher.",
          areas: [
            "Local and international school visits",
            "Volunteer, application, and participation pathways",
            "On-site programs and cultural learning",
          ],
          image: sharedPillarImages.education,
          alt: "Students learning outdoors near the ocean",
          href: "/pillars/education-culture",
          cta: "Explore education and culture",
        },
        {
          title: "Community and Global Impact",
          copy:
            "Test an idea against island reality, change what fails, and share what works so the next community does not start from zero.",
          areas: [
            "Events, conferences, and community gatherings",
            "On-atoll volunteer action",
            "Honu, mosquito control, SWAC, and island resilience",
          ],
          image: sharedPillarImages.community,
          alt: "Aerial view of a tropical atoll and lagoon",
          href: "/pillars/community-global-impact",
          cta: "Explore community and global impact",
        },
      ],
    },
    kids: {
      eyebrow: "Education for young stewards",
      titleLead: "Tamari'i",
      titleEmphasis: "how kids meet the atoll",
      copy:
        "Tamari'i means children. Some meet Tetiaroa with sandy feet, some through a turtle story, and some through a headset in a classroom far away. The goal is the same: turn wonder into care.",
      programs: [
        {
          badge: "AI story lab",
          title: "Turtle Tales AI",
          copy:
            "A kid-safe story world where turtle characters unlock AI-powered picture-book adventures, art prompts, and conservation lessons that feel like play.",
          image: sharedKidImages.turtle,
          alt: "Sea turtle swimming near the surface",
          href: "/turtle-tales",
          cta: "Open Turtle Tales",
        },
        {
          badge: "On-island visits",
          title: "Learning activities on Tetiaroa",
          copy:
            "For children who visit the atoll: reef observations, junior naturalist prompts, turtle-care moments, and shoreline activities rooted in the real place beneath their feet.",
          image: sharedKidImages.snorkel,
          alt: "Bright coral in shallow water",
          href: "/field-station#education",
          cta: "See activities",
        },
        {
          badge: "Global classrooms",
          title: "Education, outreach + VR",
          copy:
            "School programs, classroom media, and Honu XR field trips are being built to bring Tetiaroa's lagoon, science, and stewardship to children anywhere on Earth.",
          image: sharedKidImages.honuRender,
          alt: "Render of the Honu XR submersible for virtual field trips",
          href: "#honu-xr",
          cta: "Explore Honu XR",
          imageFit: "contain",
        },
      ],
      bannerCaption:
        "from turtle stories to VR field trips, every path leads back to care",
      logoCallout: {
        eyebrow: "For curious explorers",
        title: "A logo full of island clues",
        copy:
          "Waves, birds, shark teeth, fern, braid, spiral, and the eye of light are tucked into the Tetiaroa Society mark. Follow each one to discover what the atoll teaches us.",
        cta: "Explore the glyphs",
        href: "/our-logo",
        image: "/logos/mark-segments/design-mark.png",
        alt: "Tetiaroa Society design mark made from Polynesian motifs",
      },
    },
    story: {
      eyebrow: "Our Story",
      title: "The Promise That Stayed",
      lead:
        "The world knew Marlon Brando as an actor. Tetiaroa knew him differently: as someone who arrived for a film and left with a responsibility he could not set down.",
      body:
        "In its lagoon, reef, birds, turtles, and motu, he saw a living world whose beauty could not be separated from its fragility. Tetiaroa Society carries that promise forward through science, conservation, education, and stewardship rooted in the atoll itself.",
      cta: "Discover our story",
      ctaHref: "/brando-story/work",
      promiseLines: ["Tetiaroa", "must be protected", "for the future."],
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
      menuLabel: "Ouvrir le menu de navigation",
      menuTitle: "Menu de navigation",
      homeHref: FRENCH_HOME_PATH,
      teamHref: FRENCH_TEAM_PATH,
      teamLabel: "L'équipe",
      impactHref: FRENCH_IMPACT_PATH,
      impactLabel: "Fil d'impact",
      logoLabel: "Le logo",
      storyHref: "/brando-story/work",
      storyLabel: "Notre histoire",
      languageHref: ENGLISH_HOME_PATH,
      languageLabel: "EN",
      languageHrefLang: "en",
      languageLang: "en",
      languageAriaLabel: "Read in English",
      donateHref: FRENCH_DONATE_PATH,
      donateLabel: "Donner",
    },
    footer: {
      homeHref: FRENCH_HOME_PATH,
      columns: [
        {
          title: "Explorer",
          links: [
            { href: FRENCH_HOME_PATH, label: "Accueil" },
            { href: FRENCH_TEAM_PATH, label: "Notre équipe" },
            { href: "/our-logo", label: "Le logo" },
            { href: "/brando-story/work", label: "Notre histoire" },
          ],
        },
        {
          title: "Projets",
          links: [
            { href: FRENCH_IMPACT_PATH, label: "Fil d'impact" },
            { href: `${FRENCH_HOME_PATH}#honu-xr`, label: "Honu XR" },
            {
              href: `${FRENCH_HOME_PATH}#sanctuary`,
              label: "Sanctuaire tortues et requins",
            },
            { href: `${FRENCH_HOME_PATH}#twin`, label: "Jumeau numérique" },
          ],
        },
        {
          title: "Relier",
          links: [
            { href: "/turtle-tales", label: "Turtle Tales" },
            { href: "/field-station", label: "Field Station" },
            { href: FRENCH_EMAIL_LIST_PATH, label: "Liste de diffusion" },
            {
              href: FRENCH_CONTACT_PATH,
              label: "Nous contacter",
            },
          ],
        },
      ],
      ctaEyebrow: "Soutenir le terrain",
      ctaCopy:
        "Votre don devient des patrouilles tortues, du suivi récifal, des leçons pour les élèves et le soin discret dont un atoll a besoin chaque jour.",
      ctaHref: FRENCH_DONATE_PATH,
      ctaLabel: "Financer le travail",
      socials: [
        {
          platform: "contact",
          href: FRENCH_CONTACT_PATH,
          label: "Nous contacter",
        },
        {
          platform: "facebook",
          href: "https://www.facebook.com/tetiaroasociety",
          label: "Facebook",
        },
        {
          platform: "instagram",
          href: "https://www.instagram.com/tetiaroasociety",
          label: "Instagram",
        },
        {
          platform: "linkedin",
          href: "https://www.linkedin.com/company/tetiaroa-society/",
          label: "LinkedIn",
        },
        {
          platform: "youtube",
          href: "https://www.youtube.com/channel/UCPGkXEFTswBQft-8LUcvmCw",
          label: "YouTube",
        },
      ],
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
        id: "highlight",
        depth: 0,
        label: "À la une",
        color: "#227f8b",
        transmission: "signal de surface — nouvelles de Honu en approche",
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
        id: "sanctuary",
        depth: 20,
        label: "Sanctuaire",
        color: "#0b6174",
        transmission: "−5 à −20 m — nids et nurseries en vue",
      },
      {
        id: "twin",
        depth: 40,
        label: "Données",
        color: "#071f33",
        transmission: "−40 m — scan en cours. le jumeau est synchronisé",
      },
      {
        id: "pillars",
        depth: 8,
        label: "Piliers",
        color: "#0a4e4c",
        transmission: "carte de la fondation : trois piliers en vue",
      },
      {
        id: "kids",
        depth: 2,
        label: "Tamari'i",
        color: "#8fd8cf",
        transmission: "remontée — eau chaude devant",
      },
      {
        id: "our-story",
        depth: 0,
        label: "Histoire",
        color: "#5a3b21",
        transmission: "archives ouvertes — la promesse reste vivante",
      },
      {
        id: "lanterns",
        depth: 0,
        label: "Reliés",
        color: "#04101e",
        transmission: "opérations de nuit — la chaîne commence sur cette plage",
      },
      {
        id: "donation-levels",
        depth: 0,
        label: "Donner",
        color: "#04101e",
        transmission: "niveaux de don — choisissez comment aider",
      },
    ],
    hero: {
      coordinatesPlace: "Îles de la Société / Polynésie française",
      titleLine1: "Sauver l'île.",
      titleLine2: "Sauver le monde.",
      watchCta: "Regarder le film / 2:14",
    },
    highlight: {
      eyebrow: "À la une",
      title: "Honu se prépare pour Catalina",
      copy:
        "L'équipe prépare Honu pour la suite : une rencontre de lancement et une série d'essais de plongée au large de Catalina Island, avant que le submersible serve les programmes d'éducation et de science de Teti'aroa.",
      cta: "En savoir plus",
      href: "#honu-xr",
      image: "/launch-party.jpg",
      imageAlt:
        "Personnes installées dans le dôme transparent du submersible Honu pendant les préparatifs de lancement",
      carouselLabel: "Histoires d’impact à la une",
      previousLabel: "Histoire précédente",
      nextLabel: "Histoire suivante",
      pauseLabel: "Mettre le défilement automatique en pause",
      playLabel: "Reprendre le défilement automatique",
      ofLabel: "sur",
    },
    dive: {
      eyebrow: "Te Mau Tia'i — les gardiens",
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
    sanctuary: {
      kicker: "Projet 02 — sanctuaire tortues marines + requins citrons",
      title: "La nurserie des eaux peu profondes.",
      copy:
        "Chaque novembre, les tortues vertes reviennent sur le sable même où elles sont nées. Tout près, les jeunes requins citrons passent leurs premières années à l'abri du récif. Le sanctuaire tient ces deux commencements ensemble : des nids cartographiés et protégés jusqu'à l'arrivée des nouveau-nés à la mer, et un bord récifal gardé intact pour que le lagon continue d'élever les prédateurs qui maintiennent l'équilibre du vivant.",
      stats: ["214 nids / saison 2025", "3 km de bord récifal protégé"],
      caption: "honu vers ma'o · séquence du sanctuaire · −5 à −20 m",
    },
    twin: {
      kicker: "Projet 03 — jumeau numérique + biocode",
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
    impactFeedCta: {
      label: "Voir tous nos projets dans le fil d'impact",
      href: FRENCH_IMPACT_PATH,
    },
    pillars: {
      eyebrow: "Les piliers de Tetiaroa",
      title: "Trois responsabilités, un seul atoll.",
      copy:
        "La recherche révèle les changements, l’éducation transforme ce savoir en soin, et la collaboration porte les solutions au-delà du récif, alors chaque pilier renforce les deux autres.",
      layoutLabel: "Disposition des cartes",
      horizontalLabel: "Horizontale",
      verticalLabel: "Verticale",
      storylineLabel: "Récit",
      items: [
        {
          title: "Recherche et conservation",
          copy:
            "Mesurer l’atoll, changer une condition, puis mesurer de nouveau, afin que chaque action de conservation nous apprenne quoi faire ensuite.",
          areas: [
            "TARP, soin des habitats et biosécurité",
            "ATTRACT et recherche en conservation",
            "Suivi du récif, du lagon, des motu et des espèces",
          ],
          image: sharedPillarImages.research,
          alt: "Récif corallien et habitat lagonaire étudiés pour la conservation",
          href: "/fr/pillars/research-conservation",
          cta: "Découvrir la recherche et la conservation",
        },
        {
          title: "Éducation et culture",
          copy:
            "Un élève suit une question de la science de terrain aux savoirs polynésiens et à l’histoire culturelle, et l’île elle-même devient le professeur.",
          areas: [
            "Visites scolaires locales et internationales",
            "Parcours pour candidater, participer et devenir bénévole",
            "Programmes sur site et apprentissage culturel",
          ],
          image: sharedPillarImages.education,
          alt: "Élèves apprenant dehors près de l'océan",
          href: "/fr/pillars/education-culture",
          cta: "Découvrir l’éducation et la culture",
        },
        {
          title: "Communauté et impact global",
          copy:
            "Confronter une idée à la réalité insulaire, changer ce qui échoue et partager ce qui fonctionne pour que la communauté suivante ne reparte pas de zéro.",
          areas: [
            "Événements, conférences et rencontres communautaires",
            "Actions bénévoles sur l'atoll",
            "Honu, contrôle des moustiques, SWAC et résilience insulaire",
          ],
          image: sharedPillarImages.community,
          alt: "Vue aérienne d'un atoll tropical et de son lagon",
          href: "/fr/pillars/community-global-impact",
          cta: "Découvrir la communauté et l’impact global",
        },
      ],
    },
    kids: {
      eyebrow: "Éducation des jeunes gardiens",
      titleLead: "Tamari'i",
      titleEmphasis: "comment les enfants rencontrent l'atoll",
      copy:
        "Tamari'i signifie enfants. Certains découvrent Tetiaroa les pieds dans le sable, d'autres par une histoire de tortue, d'autres encore avec un casque dans une classe lointaine. Le but reste le même : transformer l'émerveillement en soin.",
      programs: [
        {
          badge: "Labo IA",
          title: "Turtle Tales IA",
          copy:
            "Un univers d'histoires adapté aux enfants, où des personnages tortues ouvrent des aventures illustrées par IA, des prompts créatifs et des leçons de conservation qui ressemblent à du jeu.",
          image: sharedKidImages.turtle,
          alt: "Tortue marine nageant près de la surface",
          href: "/turtle-tales",
          cta: "Ouvrir Turtle Tales",
        },
        {
          badge: "Sur l'atoll",
          title: "Activités enfants à Tetiaroa",
          copy:
            "Pour les enfants qui visitent l'atoll : observations du récif, carnet de jeune naturaliste, moments autour des tortues et activités de rivage ancrées dans le lieu réel.",
          image: sharedKidImages.snorkel,
          alt: "Corail lumineux en eau peu profonde",
          href: "/field-station#education",
          cta: "Voir les activités",
        },
        {
          badge: "Classes du monde",
          title: "Éducation, médiation + VR",
          copy:
            "Programmes scolaires, médias pédagogiques et sorties Honu XR sont conçus pour apporter le lagon, la science et l'intendance de Tetiaroa aux enfants du monde entier.",
          image: sharedKidImages.honuRender,
          alt: "Rendu du submersible Honu XR pour les sorties virtuelles",
          href: "#honu-xr",
          cta: "Explorer Honu XR",
          imageFit: "contain",
        },
      ],
      bannerCaption:
        "des histoires de tortues aux sorties VR, chaque chemin revient au soin",
      logoCallout: {
        eyebrow: "Pour les explorateurs curieux",
        title: "Un logo rempli d'indices de l'atoll",
        copy:
          "Vagues, oiseaux, dents de requin, fougère, tresse, spirale et oeil de lumière se cachent dans le logo de Tetiaroa Society. Suivez-les pour découvrir ce que l'atoll nous raconte.",
        cta: "Explorer les glyphes",
        href: "/our-logo",
        image: "/logos/mark-segments/design-mark.png",
        alt: "Marque graphique de Tetiaroa Society composée de motifs polynésiens",
      },
    },
    story: {
      eyebrow: "Notre histoire",
      title: "La promesse qui demeure",
      lead:
        "Le monde connaissait Marlon Brando comme acteur. Tetiaroa l'a connu autrement : comme quelqu'un venu pour un film, puis reparti avec une responsabilité qu'il ne pouvait plus déposer.",
      body:
        "Dans son lagon, son récif, ses oiseaux, ses tortues et ses motu, il a vu un monde vivant dont la beauté ne pouvait pas être séparée de la fragilité. Tetiaroa Society porte cette promesse aujourd'hui par la science, la conservation, l'éducation et une intendance enracinée dans l'atoll lui-même.",
      cta: "Découvrir l'histoire",
      ctaHref: "/brando-story/work",
      promiseLines: ["Tetiaroa", "doit être protégé", "pour l'avenir."],
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
