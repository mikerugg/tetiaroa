import type { DepthStop } from "./depth-scene";
import type { LanternDonateLabels, LanternTier } from "./lantern-donate";
import type { SiteFooterCopy } from "./site-footer";
import type { TopToolbarCopy } from "./top-toolbar";
import type { VrViewerLabels } from "./vr-viewer";
import {
  ENGLISH_CONTACT_PATH,
  ENGLISH_DONATE_PATH,
  ENGLISH_EMAIL_LIST_PATH,
  ENGLISH_ATOLL_PATH,
  ENGLISH_IMPACT_PATH,
  ENGLISH_HOME_PATH,
  ENGLISH_OUR_STORY_PATH,
  ENGLISH_STATIONS_PATH,
  ENGLISH_SWAC_PATH,
  ENGLISH_TEAM_PATH,
  FRENCH_CONTACT_PATH,
  FRENCH_DONATE_PATH,
  FRENCH_EMAIL_LIST_PATH,
  FRENCH_ATOLL_PATH,
  FRENCH_IMPACT_PATH,
  FRENCH_STATIONS_PATH,
  FRENCH_HOME_PATH,
  FRENCH_OUR_STORY_PATH,
  FRENCH_SWAC_PATH,
  FRENCH_TEAM_PATH,
} from "./language-links";

export type HomeLocale = "en" | "fr";

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

export type HomeCopy = {
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
    renderAlt: string;
    renderCaption: string;
    learnMoreLabel: string;
    learnMoreHref: string;
    cta: string;
    viewer: VrViewerLabels;
  };
  sanctuary: {
    kickerLine1: string;
    kickerLine2: string;
    title: string;
    copy: string;
    stats: [string, string];
    caption: string;
    guardians: {
      eyebrow: string;
      title: string;
      copy: string;
      imageAlt: string;
      cta: string;
      href: string;
    };
  };
  swac: {
    kickerLine1: string;
    kickerLine2: string;
    title: string;
    copy: string;
    stat: string;
    cta: string;
    href: string;
    image: string;
    imageAlt: string;
  };
  impactFeedCta: {
    label: string;
    href: string;
  };
  restoration: {
    kickerLine1: string;
    kickerLine2: string;
    title: string;
    paragraphs: string[];
    imageAlt: string;
    cta: string;
    href: string;
  };
  pillars: {
    eyebrow: string;
    title: string;
    copy: string;
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
    sectionLabel: string;
    title: string;
    titleAccent: string;
    cta: string;
    ctaHref: string;
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
  honuRender: "/sub-render.webp",
};

const sharedPillarImages = {
  research: "/pillars/research-conservation/lagoon-bird-monitoring.webp",
  education:
    "/pillars/education-culture/field-course-homepage.webp",
  community: "/pillars/community-global-impact/community-gathering.webp",
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
      storyHref: ENGLISH_OUR_STORY_PATH,
      storyLabel: "Our Story",
      subsHref: "/honu",
      subsLabel: "Our Subs",
      atollHref: ENGLISH_ATOLL_PATH,
      atollLabel: "Our Atoll",
      stationsHref: ENGLISH_STATIONS_PATH,
      stationsLabel: "Our Stations",
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
            { href: ENGLISH_OUR_STORY_PATH, label: "Our Story" },
            { href: ENGLISH_ATOLL_PATH, label: "Our Atoll" },
          ],
        },
        {
          title: "Projects",
          links: [
            { href: ENGLISH_IMPACT_PATH, label: "Impact Feed" },
            { href: ENGLISH_SWAC_PATH, label: "Sea Water Air Conditioning" },
            { href: "/honu", label: "Honu XR" },
            { href: "/#sanctuary", label: "Turtle and shark sanctuary" },
          ],
        },
        {
          title: "Connect",
          links: [
            { href: "/turtle-tales", label: "Turtle Tales" },
            { href: ENGLISH_STATIONS_PATH, label: "Our Stations" },
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
      ctaLabel: "Donate",
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
      rating: {
        href: "https://www.charitynavigator.org/ein/451080688",
        eyebrow: "Four-Star Charity",
        copy: "Charity Navigator's highest rating for financial health and transparency.",
        ariaLabel:
          "Tetiaroa Society's Four-Star rating on Charity Navigator, opens in a new tab",
      },
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
        id: "restoration",
        depth: 0,
        label: "Restore",
        color: "#0a4e4c",
      },
      {
        id: "swac",
        depth: 900,
        label: "SWAC",
        color: "#071f33",
        transmission: "−900 m — intake water at 5 °C",
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
        label: "Education",
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
      watchCta: "Watch the film / 1:13",
    },
    highlight: {
      eyebrow: "Highlight",
      title: "Honu heads to Catalina for testing",
      copy:
        "Before Honu can open Teti’aroa’s deep water to students and scientists, it has to prove itself at sea. That work begins off Catalina Island, where the team is preparing for dive tests and a launch party.",
      cta: "Learn More",
      href: "#honu-xr",
      image: "/launch-party.webp",
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
        "Built by Doer Marine in partnership with Tetiaroa Society, Honu, Tahitian for sea turtle, will carry scientists, visitors, and budding oceanographers into the deep.\n\nThe Honu submersibles are built for real science and to share what they see and learn, with descents filmed by state-of-the-art 360° XR cameras, allowing Honu to open up the deep ocean to people in Polynesia and around the world.",
      renderAlt:
        "Render of the Honu submersible — acrylic dome, robotic arms, DOER Marine livery",
      renderCaption: "honu · design render · doer marine",
      learnMoreLabel: "Learn more about Honu",
      learnMoreHref: "/honu",
      cta: "Watch in fullscreen / VR",
      viewer: {
        recording: "rec — capturing dive 15",
        depth: "−104 m · 8k 360°",
        dragHint: "drag to look",
      },
    },
    sanctuary: {
      kickerLine1: "Project 02 — Sanctuary",
      kickerLine2: "sea turtles + lemon sharks",
      title: "The nursery in the shallows.",
      copy:
        "Every November, green sea turtles return to the same sand where they hatched. Just offshore, juvenile lemon sharks spend their first years inside the reef's protection. Teti'aroa's sanctuary work holds both beginnings together: nests mapped and guarded through hatching season, reef edge kept intact so the lagoon can keep raising the predators that hold the food web in balance.",
      stats: ["214 nests / 2025 season", "3 km of protected reef edge"],
      caption: "honu to ma'o · sanctuary sequence · −5 to −20 m",
      guardians: {
        eyebrow: "Protecting the Sanctuary",
        title: "Guardians of Teti'aroa",
        copy: "Guardians patrol the atoll's sensitive zones, support the scientists working in the field, and help enforce the rules that keep Teti'aroa's ecosystem intact.",
        imageAlt: "Tetiaroa Society rangers heading out on a field mission by boat",
        cta: "Meet the team",
        href: `${ENGLISH_TEAM_PATH}#staff`,
      },
    },
    swac: {
      kickerLine1: "Project 04 — SWAC",
      kickerLine2: "Teti'aroa's sea water air conditioning",
      title: "Our island reimagines air conditioning",
      copy:
        "Air conditioning burns energy making something the ocean already has. Our groundbreaking SWAC reaches 900 metres down for five-degree seawater and pumps that chilly water to the surface. Up to 90% less electricity—a breakthrough with consequences far beyond one island.",
      stat: "up to 90% less electricity",
      cta: "See our Interactive SWAC Demos",
      href: ENGLISH_SWAC_PATH,
      image: "/swac/key-project-03.gif",
      imageAlt:
        "Honu submersible illuminating the SWAC deep-water intake pipe",
    },
    impactFeedCta: {
      label: "See All Our Projects on the Impact Feed",
      href: ENGLISH_IMPACT_PATH,
    },
    restoration: {
      kickerLine1: "Project 03 — Restore",
      kickerLine2: "Tetiaroa Atoll Restoration Program",
      title: "Restoring a meta-ecosystem",
      paragraphs: [
        "Invasive species are the leading cause of island extinctions worldwide and have already driven the extinction of Teti'aroa's native land birds while contributing to declines in native seabirds, crabs, and vegetation.",
        "Our large-scale restoration program is unique in French Polynesia and aims to restore the atoll's natural ecological processes by removing invasive species and helping native species return.",
      ],
      imageAlt: "A fieldworker tending solar-powered speakers for seabird restoration on Tetiaroa",
      cta: "Learn more about TARP",
      href: "/pillars/research-conservation",
    },
    pillars: {
      eyebrow: "Pillars of Tetiaroa",
      title: "Three responsibilities, one atoll.",
      copy:
        "Research shows us how our world is changing, education turns that knowledge into action and care, and global collaboration carries what works beyond the island, out into the world.",
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
          alt: "Person using binoculars to observe two seabirds from a shallow lagoon",
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
          alt: "Five people standing before a seated gathering in an open-air room",
          href: "/pillars/community-global-impact",
          cta: "Explore community and global impact",
        },
      ],
    },
    kids: {
      eyebrow: "Educating the next guardians",
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
          href: "/pillars/education-culture/activities",
          cta: "See activities",
        },
        {
          badge: "Global classrooms",
          title: "Education, outreach + VR",
          copy:
            "School programs, classroom media, and Honu XR field trips are being built to bring Tetiaroa's lagoon, science, and stewardship to children anywhere on Earth.",
          image: sharedKidImages.honuRender,
          alt: "Render of the Honu XR submersible for virtual field trips",
          href: "/honu",
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
      sectionLabel: "Our story",
      title: "An idea changes hands.",
      titleAccent: "The Tetiaroa Society helps keep his promise.",
      cta: "Learn more about Marlon Brando and the Tetiaroa Society",
      ctaHref: ENGLISH_OUR_STORY_PATH,
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
          description: "Pick an amount that suits you.",
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
      storyHref: FRENCH_OUR_STORY_PATH,
      storyLabel: "Notre histoire",
      subsHref: "/honu",
      subsLabel: "Nos sous-marins",
      atollHref: FRENCH_ATOLL_PATH,
      atollLabel: "Notre atoll",
      stationsHref: FRENCH_STATIONS_PATH,
      stationsLabel: "Nos stations",
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
            { href: FRENCH_OUR_STORY_PATH, label: "Notre histoire" },
            { href: FRENCH_ATOLL_PATH, label: "Notre atoll" },
          ],
        },
        {
          title: "Projets",
          links: [
            { href: FRENCH_IMPACT_PATH, label: "Fil d'impact" },
            { href: FRENCH_SWAC_PATH, label: "Climatisation à l'eau de mer" },
            { href: `${FRENCH_HOME_PATH}#honu-xr`, label: "Honu XR" },
            {
              href: `${FRENCH_HOME_PATH}#sanctuary`,
              label: "Sanctuaire tortues et requins",
            },
          ],
        },
        {
          title: "Relier",
          links: [
            { href: "/turtle-tales", label: "Turtle Tales" },
            { href: FRENCH_STATIONS_PATH, label: "Nos stations" },
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
      ctaLabel: "Donner",
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
      rating: {
        href: "https://www.charitynavigator.org/ein/451080688",
        eyebrow: "Association quatre étoiles",
        copy: "La note la plus élevée de Charity Navigator pour la santé financière et la transparence.",
        ariaLabel:
          "La note quatre étoiles de Tetiaroa Society sur Charity Navigator, ouvre un nouvel onglet",
      },
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
        id: "restoration",
        depth: 0,
        label: "Restaurer",
        color: "#0a4e4c",
      },
      {
        id: "swac",
        depth: 900,
        label: "SWAC",
        color: "#071f33",
        transmission: "−900 m — eau captée à 5 °C",
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
        label: "Éducation",
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
      watchCta: "Regarder le film / 1:13",
    },
    highlight: {
      eyebrow: "À la une",
      title: "Honu se prépare pour Catalina",
      copy:
        "L'équipe prépare Honu pour la suite : une rencontre de lancement et une série d'essais de plongée au large de Catalina Island, avant que le submersible serve les programmes d'éducation et de science de Teti'aroa.",
      cta: "En savoir plus",
      href: "#honu-xr",
      image: "/launch-party.webp",
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
      copy: "Un atoll. Mille mètres d'histoire. Faites défiler pour plonger.",
      cue: "plonger",
    },
    honu: {
      kickerLine1: "Projet 01 — Honu XR",
      kickerLine2: "le submersible des grands fonds",
      title: "Voici Honu. Conçu pour ouvrir l'océan à tous.",
      copy:
        "Construit par Doer Marine en partenariat avec Tetiaroa Society, Honu, qui signifie tortue marine en tahitien, emmènera scientifiques, visiteurs et océanographes en herbe dans les profondeurs.\n\nLes submersibles Honu sont conçus pour mener de véritables recherches scientifiques et partager leurs observations et leurs découvertes. Leurs descentes seront filmées par des caméras XR 360° de pointe, permettant à Honu d’ouvrir les grands fonds aux habitants de Polynésie et du monde entier.",
      renderAlt:
        "Rendu du submersible Honu — dôme acrylique, bras robotiques, livrée DOER Marine",
      renderCaption: "honu · rendu de design · doer marine",
      learnMoreLabel: "En savoir plus sur Honu",
      learnMoreHref: FRENCH_IMPACT_PATH,
      cta: "Regarder en plein écran / VR",
      viewer: {
        recording: "rec — plongée 15 en cours",
        depth: "−104 m · 8k 360°",
        dragHint: "faites glisser pour regarder",
      },
    },
    sanctuary: {
      kickerLine1: "Projet 02 — Sanctuaire",
      kickerLine2: "tortues marines + requins citrons",
      title: "La nurserie des eaux peu profondes.",
      copy:
        "Chaque novembre, les tortues vertes reviennent sur le sable même où elles sont nées. Tout près, les jeunes requins citrons passent leurs premières années à l'abri du récif. Le sanctuaire tient ces deux commencements ensemble : des nids cartographiés et protégés jusqu'à l'arrivée des nouveau-nés à la mer, et un bord récifal gardé intact pour que le lagon continue d'élever les prédateurs qui maintiennent l'équilibre du vivant.",
      stats: ["214 nids / saison 2025", "3 km de bord récifal protégé"],
      caption: "honu vers ma'o · séquence du sanctuaire · −5 à −20 m",
      guardians: {
        eyebrow: "Protéger le sanctuaire",
        title: "Les gardiens de Teti’aroa",
        copy: "Les gardiens patrouillent dans les zones sensibles de l’atoll, accompagnent les scientifiques sur le terrain et contribuent à faire respecter les règles qui préservent l’écosystème de Teti’aroa.",
        imageAlt: "Des gardes nature de Tetiaroa Society partant en mission de terrain en bateau",
        cta: "Rencontrer l’équipe",
        href: `${FRENCH_TEAM_PATH}#staff`,
      },
    },
    swac: {
      kickerLine1: "Projet 04 — SWAC",
      kickerLine2: "la climatisation à l’eau de mer de Teti’aroa",
      title: "Notre île réinvente la climatisation",
      copy:
        "La climatisation engloutit de l’énergie pour produire un froid que l’océan offre déjà. Notre SWAC révolutionnaire va chercher, à 900 mètres de profondeur, une eau de mer à cinq degrés et la pompe jusqu’en surface. Jusqu’à 90 % d’électricité en moins — une percée dont la portée dépasse largement une seule île.",
      stat: "jusqu'à 90 % d'électricité en moins",
      cta: "Explorez nos démos SWAC",
      href: FRENCH_SWAC_PATH,
      image: "/swac/key-project-03.gif",
      imageAlt:
        "Le submersible Honu éclaire la conduite de captage en eau profonde du SWAC",
    },
    impactFeedCta: {
      label: "Voir tous nos projets dans le fil d'impact",
      href: FRENCH_IMPACT_PATH,
    },
    restoration: {
      kickerLine1: "Projet 03 — Restaurer",
      kickerLine2: "Programme de restauration de l’atoll de Tetiaroa",
      title: "Restaurer un méta-écosystème",
      paragraphs: [
        "Les espèces invasives sont la première cause d’extinction sur les îles dans le monde. Elles ont déjà fait disparaître les oiseaux terrestres indigènes de Teti’aroa et contribué au déclin des oiseaux marins, des crabes et de la végétation indigènes.",
        "Notre programme de restauration à grande échelle, unique en Polynésie française, vise à rétablir les processus écologiques naturels de l’atoll en éliminant les espèces invasives et en favorisant le retour des espèces indigènes.",
      ],
      imageAlt: "Une personne s’occupe de haut-parleurs alimentés par des panneaux solaires pour favoriser le retour des oiseaux marins à Tetiaroa",
      cta: "En savoir plus sur le TARP",
      href: "/fr/pillars/research-conservation",
    },
    pillars: {
      eyebrow: "Les piliers de Tetiaroa",
      title: "Trois responsabilités, un seul atoll.",
      copy:
        "La recherche nous montre comment notre monde évolue, l’éducation transforme ces connaissances en actions et en attention au vivant, et la collaboration internationale diffuse ce qui fonctionne au-delà de l’île, à travers le monde.",
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
          alt: "Une personne observe deux oiseaux marins aux jumelles depuis un lagon peu profond",
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
          alt: "Cinq personnes debout devant un groupe assis dans une salle ouverte sur la végétation",
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
          href: "/fr/pillars/education-culture/activities",
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
      sectionLabel: "Notre histoire",
      title: "Une idée change de mains.",
      titleAccent: "La Tetiaroa Society veille à tenir sa promesse.",
      cta: "En savoir plus sur Marlon Brando et la Tetiaroa Society",
      ctaHref: FRENCH_OUR_STORY_PATH,
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
          description: "Choisissez un montant qui vous convient.",
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
