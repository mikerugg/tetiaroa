import {
  BookOpenIcon,
  BrainCircuitIcon,
  FlaskConicalIcon,
  GraduationCapIcon,
  HandHeartIcon,
  LanguagesIcon,
  LeafIcon,
  MicroscopeIcon,
  NetworkIcon,
  type LucideIcon,
} from "lucide-react";
import { homeVideoSources } from "../home-video-sources";

export const pillarSlugs = [
  "research-conservation",
  "education-culture",
  "community-global-impact",
] as const;

export type PillarSlug = (typeof pillarSlugs)[number];
export type PillarLocale = "en" | "fr";

export type PillarEffort = {
  icon: LucideIcon;
  title: string;
  copy: string;
  details: [string, string, string];
};

export type PillarLink = {
  label: string;
  description: string;
  href: string;
  external?: boolean;
};

export type PillarMedia = {
  kind: "image" | "video";
  src: string;
  alt: string;
  caption: string;
};

export type PillarContent = {
  number: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  heroTitle: string;
  heroCopy: string;
  heroImage: string;
  heroImageAlt: string;
  introTitle: string;
  introCopy: string;
  principle: string;
  mediaTitle: string;
  media: [PillarMedia, PillarMedia, PillarMedia];
  effortsTitle: string;
  effortsIntro: string;
  efforts: [PillarEffort, PillarEffort, PillarEffort];
  bridgeTitle: string;
  bridgeCopy: string;
  links: PillarLink[];
  metadataDescription: string;
};

export const pillarUiCopy = {
  en: {
    heroCta: "Follow the work",
    workEyebrow: "On the ground",
    detailsLabel: "In the field",
    relatedEyebrow: "The work keeps moving",
    relatedTitle: "See the work now.",
    relatedCopy:
      "Current projects, reports, and field notes.",
    openLabel: "Open",
    otherEyebrow: "Keep exploring",
    otherTitle: "Explore the other two pillars.",
    otherAction: "Explore this pillar",
    donateEyebrow: "Back the work",
    donateTitle: "Keep the work moving.",
    donateCopy:
      "Your gift keeps field teams equipped, lessons running, and long-term monitoring in motion.",
    donateAction: "Fund the Work",
  },
  fr: {
    heroCta: "Suivre le travail",
    workEyebrow: "Sur le terrain",
    detailsLabel: "Sur le terrain",
    relatedEyebrow: "Le travail continue",
    relatedTitle: "Voir le travail en cours.",
    relatedCopy:
      "Projets, rapports et nouvelles du terrain.",
    openLabel: "Découvrir",
    otherEyebrow: "Poursuivre l’exploration",
    otherTitle: "Découvrir les deux autres piliers.",
    otherAction: "Découvrir ce pilier",
    donateEyebrow: "Soutenir les actions",
    donateTitle: "Faire avancer le travail.",
    donateCopy:
      "Votre don équipe le terrain, fait vivre les leçons et maintient le suivi au long cours.",
    donateAction: "Financer les actions",
  },
} as const;

const englishContent: Record<PillarSlug, PillarContent> = {
  "research-conservation": {
    number: "01",
    title: "Research and Conservation",
    shortTitle: "Research + Conservation",
    eyebrow: "Pillar 01 · Research + Conservation",
    heroTitle: "How does an atoll recover?",
    heroCopy:
      "We study the whole system, remove what strains it, and then come back to see what changed.",
    heroImage:
      "/pillars/research-conservation/lagoon-fieldwork.webp",
    heroImageAlt:
      "Researchers crossing the lagoon on their way to fieldwork on Tetiaroa",
    introTitle: "One atoll, one connected system.",
    introCopy:
      "Everything is connected here, so every conservation decision begins with evidence—from the reef and lagoon to birds, turtles, and motu.",
    principle:
      "We observe, act, measure, and adapt, because each result should shape what happens next.",
    mediaTitle: "Follow the work from motu to reef.",
    media: [
      {
        kind: "image",
        src: "/pillars/research-conservation/rat-eradication.webp",
        alt: "Tetiaroa Atoll Restoration Program rat eradication fieldwork",
        caption: "TARP · removing invasive pressure across the motu",
      },
      {
        kind: "video",
        src: homeVideoSources.turtleClip.embedUrl,
        alt: "Green sea turtle swimming through the waters of Tetiaroa",
        caption: "Green turtle sanctuary · lagoon monitoring",
      },
      {
        kind: "image",
        src: "/pillars/research-conservation/seabird-restoration.webp",
        alt: "Seabird restoration work on Tetiaroa",
        caption: "ATTRACT · helping seabirds return",
      },
    ],
    effortsTitle: "From evidence to action.",
    effortsIntro:
      "We act, we watch, and each one tells us what to do next.",
    efforts: [
      {
        icon: LeafIcon,
        title: "Remove invasive pressure",
        copy:
          "TARP removes rats and yellow crazy ants, and then strengthens biosecurity so native life has room to recover.",
        details: [
          "Rat eradication and follow-up",
          "Yellow crazy ant treatment",
          "Biosecurity and habitat recovery",
        ],
      },
      {
        icon: MicroscopeIcon,
        title: "Watch the response",
        copy:
          "The team tracks seabirds, turtle nests, vegetation, crabs, reefs, fresh water, and coastline change, because recovery leaves many small signals.",
        details: [
          "Species and habitat monitoring",
          "Land-to-sea nutrient research",
          "Long-term ecological baselines",
        ],
      },
      {
        icon: FlaskConicalIcon,
        title: "Test what comes next",
        copy:
          "ATTRACT, Cool Reef, eDNA, Biocode, and the digital model each test a different way to read and restore the atoll.",
        details: [
          "Coral climate adaptation",
          "Seabird recolonization",
          "Digital and genetic tools",
        ],
      },
    ],
    bridgeTitle: "Recovery rarely announces itself.",
    bridgeCopy:
      "Maybe it is a new nest, a native plant still standing, or a healthier reef—and so we keep watching.",
    links: [
      {
        label: "Conservation in the Impact Feed",
        description:
          "Restoration, sanctuary updates, and observations from across the atoll.",
        href: "/impact?topic=conservation",
      },
      {
        label: "Research in the Impact Feed",
        description:
          "Current studies, monitoring, technical reports, and the people behind them.",
        href: "/impact?topic=research",
      },
      {
        label: "Meet the field team",
        description:
          "Meet the staff, advisors, and partners behind the work.",
        href: "/team",
      },
    ],
    metadataDescription:
      "See how Tetiaroa Society joins field research with conservation, from atoll restoration and biosecurity to species monitoring and coral adaptation.",
  },
  "education-culture": {
    number: "02",
    title: "Education and Culture",
    shortTitle: "Education + Culture",
    eyebrow: "Pillar 02 · Education + Culture",
    heroTitle: "How does an island become a classroom?",
    heroCopy:
      "You read a reef, carry a story, solve a real problem—and suddenly the island is a place worth protecting.",
    heroImage:
      "/pillars/education-culture/field-course.jpg",
    heroImageAlt:
      "Students gathered outdoors for a lesson during a field course on Tetiaroa",
    introTitle: "Let the place lead the lesson.",
    introCopy:
      "The place leads, so birds, motu, Polynesian knowledge, and modern field science all become part of the same lesson.",
    principle:
      "Wonder opens the door, and understanding gives students a reason to care for what comes next.",
    mediaTitle: "Learning happens in the middle of it all.",
    media: [
      {
        kind: "image",
        src: "/pillars/education-culture/lakeside-students.jpg",
        alt: "Students learning about the atoll during a field course",
        caption: "Field course · learning from the atoll itself",
      },
      {
        kind: "image",
        src: "/pillars/education-culture/methods.png",
        alt: "Students taking part in an education activity on Tetiaroa",
        caption: "Observe · question · test · share",
      },
      {
        kind: "image",
        src: "/pillars/education-culture/education-square.jpg",
        alt: "Place-based education on Tetiaroa",
        caption: "Culture and science · one connected lesson",
      },
    ],
    effortsTitle: "The atoll is the classroom.",
    effortsIntro:
      "Students notice, ask, investigate, and then decide what they might do next.",
    efforts: [
      {
        icon: GraduationCapIcon,
        title: "Field courses for young people",
        copy:
          "Students ages 8 to 18 explore the motu, study its life and history, test ideas, and share what they find.",
        details: [
          "Local school field courses",
          "Science and traditional knowledge",
          "Hands-on island stewardship",
        ],
      },
      {
        icon: BookOpenIcon,
        title: "Learning across ages and shores",
        copy:
          "Interns, visiting groups, researchers, and local students bring different questions to the Ecostation and learn from one another.",
        details: [
          "University internships",
          "International field programs",
          "Researchers learning beside students",
        ],
      },
      {
        icon: LanguagesIcon,
        title: "Culture inside every method",
        copy:
          "Fieldwork meets language, oral history, games, legends, and both traditional and modern tools.",
        details: [
          "Interdisciplinary curriculum",
          "Critical and collaborative thinking",
          "Past and present in conversation",
        ],
      },
    ],
    bridgeTitle: "A better question matters more than a perfect answer.",
    bridgeCopy:
      "Students observe, question, test, rethink, and share—and that, really, is where stewardship begins.",
    links: [
      {
        label: "Education in the Impact Feed",
        description:
          "Field courses, learning projects, cultural programs, and student work.",
        href: "/impact?topic=education",
      },
      {
        label: "Visit the Field Station",
        description:
          "See how learning fits into the daily rhythm of field science.",
        href: "/stations/bailey-field-station",
      },
      {
        label: "Meet Turtle Tales",
        description:
          "Meet the atoll through story, play, and curiosity.",
        href: "/turtle-tales",
      },
    ],
    metadataDescription:
      "Explore Tetiaroa Society's place-based education and cultural programs, from Polynesian student field courses to internships and interdisciplinary outreach.",
  },
  "community-global-impact": {
    number: "03",
    title: "Community and Global Impact",
    shortTitle: "Community + Global Impact",
    eyebrow: "Pillar 03 · Community + Global Impact",
    heroTitle: "How can one atoll change what happens elsewhere?",
    heroCopy:
      "We test ideas in island conditions, change what fails, and share what works.",
    heroImage:
      "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=2400&q=88&auto=format&fit=crop",
    heroImageAlt: "Aerial view of a Pacific atoll and its open lagoon",
    introTitle: "Every global problem arrives somewhere specific.",
    introCopy:
      "Big problems become real somewhere, so Tetiaroa brings communities, scientists, innovators, and funders together to test solutions against island reality.",
    principle:
      "An idea matters when another community can test it, adapt it, and carry it home.",
    mediaTitle: "Ideas only matter when they meet reality.",
    media: [
      {
        kind: "image",
        src: "/pillars/community-global-impact/ocean-innovation.jpg",
        alt: "Blue Climate Initiative ocean innovation gathering",
        caption: "Blue Climate Initiative · solutions for people, ocean, planet",
      },
      {
        kind: "image",
        src: "/sub-render.webp",
        alt: "Honu submersible concept for ocean education and research",
        caption: "Honu · opening ocean access",
      },
      {
        kind: "video",
        src: homeVideoSources.atoll.embedUrl,
        alt: "Aerial passage over Tetiaroa Atoll",
        caption: "Tetiaroa · a whole island system in view",
      },
    ],
    effortsTitle: "The atoll is a starting point.",
    effortsIntro:
      "Bring people together, test the idea, improve it, and share the evidence.",
    efforts: [
      {
        icon: NetworkIcon,
        title: "Accelerate ocean-climate ideas",
        copy:
          "The Blue Climate Initiative brings communities, scientists, innovators, investors, and emerging leaders together, because better ocean-climate ideas need all of them.",
        details: [
          "Ocean innovation networks",
          "Research and collaboration",
          "Community leadership",
        ],
      },
      {
        icon: BrainCircuitIcon,
        title: "Put systems to work",
        copy:
          "SWAC, targeted mosquito control, and Honu test how engineering can support climate, health, research, and education.",
        details: [
          "Low-carbon island infrastructure",
          "Health and biodiversity tools",
          "Immersive ocean education",
        ],
      },
      {
        icon: HandHeartIcon,
        title: "Build a community of practice",
        copy:
          "Conferences, partnerships, volunteer action, and shared research carry lessons beyond the reef.",
        details: [
          "Convenings and partnerships",
          "Volunteer participation",
          "Lessons that travel",
        ],
      },
    ],
    bridgeTitle: "Tetiaroa will not have every answer.",
    bridgeCopy:
      "And that is okay—the atoll offers a place to test, listen, improve, and share what survives contact with reality.",
    links: [
      {
        label: "Global impact in the Impact Feed",
        description:
          "Partnerships, technologies, gatherings, and ideas moving beyond the reef.",
        href: "/impact?topic=global-impact",
      },
      {
        label: "Blue Climate Initiative",
        description:
          "Meet the network moving ocean-climate ideas into action.",
        href: "https://www.blueclimateinitiative.org/",
        external: true,
      },
      {
        label: "Watch Honu take shape",
        description:
          "Follow Honu as it becomes an education and research platform.",
        href: "/#honu-xr",
      },
    ],
    metadataDescription:
      "Discover how Tetiaroa Society connects island practice to global ocean and climate action through collaboration, technology, and the Blue Climate Initiative.",
  },
};

const frenchContent: Record<PillarSlug, PillarContent> = {
  "research-conservation": {
    number: "01",
    title: "Recherche et conservation",
    shortTitle: "Recherche + Conservation",
    eyebrow: "Pilier 01 · Recherche + Conservation",
    heroTitle: "Comment un atoll se reconstruit-il ?",
    heroCopy:
      "Nous étudions le système entier, retirons ce qui le fragilise, puis revenons voir ce qui a changé.",
    heroImage:
      "/pillars/research-conservation/lagoon-fieldwork.webp",
    heroImageAlt:
      "Des scientifiques traversent le lagon pour rejoindre leur terrain d’étude à Tetiaroa",
    introTitle: "Un atoll, un seul système vivant.",
    introCopy:
      "Ici, tout est lié, alors chaque décision commence par des preuves—du récif et du lagon jusqu’aux oiseaux, tortues et motu.",
    principle:
      "Nous observons, agissons, mesurons et adaptons, car chaque résultat doit guider la suite.",
    mediaTitle: "Suivre le travail, des motu jusqu’au récif.",
    media: [
      {
        kind: "image",
        src: "/pillars/research-conservation/rat-eradication.webp",
        alt: "Travail de dératisation du Programme de restauration de l’atoll de Tetiaroa",
        caption: "TARP · lever la pression des espèces invasives",
      },
      {
        kind: "video",
        src: homeVideoSources.turtleClip.embedUrl,
        alt: "Tortue verte nageant dans les eaux de Tetiaroa",
        caption: "Sanctuaire des tortues vertes · suivi du lagon",
      },
      {
        kind: "image",
        src: "/pillars/research-conservation/seabird-restoration.webp",
        alt: "Travail de restauration des oiseaux marins à Tetiaroa",
        caption: "ATTRACT · accompagner le retour des oiseaux marins",
      },
    ],
    effortsTitle: "Des preuves à l’action.",
    effortsIntro:
      "Nous agissons, nous observons, et chaque étape nous indique la suivante.",
    efforts: [
      {
        icon: LeafIcon,
        title: "Lever la pression des espèces invasives",
        copy:
          "TARP élimine les rats et les fourmis folles jaunes, puis renforce la biosécurité pour que le vivant indigène puisse se rétablir.",
        details: [
          "Éradication des rats et suivi",
          "Traitement des fourmis folles jaunes",
          "Biosécurité et restauration des habitats",
        ],
      },
      {
        icon: MicroscopeIcon,
        title: "Observer la réponse du vivant",
        copy:
          "L’équipe suit oiseaux, nids de tortues, végétation, crabes, récif, eau douce et trait de côte, car la restauration laisse de petits signes.",
        details: [
          "Suivi des espèces et des habitats",
          "Recherche des motu jusqu’au récif",
          "Données écologiques au long cours",
        ],
      },
      {
        icon: FlaskConicalIcon,
        title: "Éprouver les outils de demain",
        copy:
          "ATTRACT, Cool Reef, l’ADN environnemental, Biocode et le modèle numérique testent chacun une façon de comprendre et restaurer l’atoll.",
        details: [
          "Adaptation des coraux au climat",
          "Recolonisation par les oiseaux marins",
          "Outils numériques et génétiques",
        ],
      },
    ],
    bridgeTitle: "La restauration se fait rarement remarquer.",
    bridgeCopy:
      "C’est peut-être un nouveau nid, une plante indigène toujours là ou un récif plus sain—alors nous continuons d’observer.",
    links: [
      {
        label: "La conservation dans le fil d’impact",
        description:
          "Restauration, nouvelles du sanctuaire et observations dans tout l’atoll.",
        href: "/fr/impact?topic=conservation",
      },
      {
        label: "La recherche dans le fil d’impact",
        description:
          "Études en cours, suivi, rapports techniques et équipes de recherche.",
        href: "/fr/impact?topic=research",
      },
      {
        label: "Rencontrer l’équipe de terrain",
        description:
          "Les équipes, conseillers et institutions qui portent le travail.",
        href: "/fr/team",
      },
    ],
    metadataDescription:
      "Découvrez comment Tetiaroa Society unit recherche de terrain et conservation, de la restauration de l’atoll au suivi des espèces et à l’adaptation des coraux.",
  },
  "education-culture": {
    number: "02",
    title: "Éducation et culture",
    shortTitle: "Éducation + Culture",
    eyebrow: "Pilier 02 · Éducation + Culture",
    heroTitle: "Comment une île devient-elle une salle de classe ?",
    heroCopy:
      "On lit un récif, transmet une histoire, résout un vrai problème—et soudain l’île devient un lieu que l’on veut protéger.",
    heroImage:
      "/pillars/education-culture/field-course.jpg",
    heroImageAlt:
      "Des élèves réunis en plein air pendant un séjour pédagogique à Tetiaroa",
    introTitle: "Laisser le lieu guider la leçon.",
    introCopy:
      "Le lieu guide la leçon, alors les élèves apprennent des oiseaux, des motu, des savoirs polynésiens et de la science de terrain.",
    principle:
      "L’émerveillement ouvre la porte, et la compréhension donne aux élèves une raison de prendre soin de la suite.",
    mediaTitle: "On apprend au milieu du vivant.",
    media: [
      {
        kind: "image",
        src: "/pillars/education-culture/lakeside-students.jpg",
        alt: "Des élèves découvrent l’atoll pendant un séjour de terrain",
        caption: "Séjour de terrain · apprendre directement de l’atoll",
      },
      {
        kind: "image",
        src: "/pillars/education-culture/methods.png",
        alt: "Des élèves participent à une activité pédagogique à Tetiaroa",
        caption: "Observer · questionner · tester · partager",
      },
      {
        kind: "image",
        src: "/pillars/education-culture/education-square.jpg",
        alt: "Programme éducatif ancré dans le territoire de Tetiaroa",
        caption: "Culture et science · une seule leçon",
      },
    ],
    effortsTitle: "L’atoll est la salle de classe.",
    effortsIntro:
      "Les élèves observent, questionnent, enquêtent, puis décident de ce qu’ils pourraient faire ensuite.",
    efforts: [
      {
        icon: GraduationCapIcon,
        title: "Des séjours de terrain pour la jeunesse",
        copy:
          "Les jeunes de 8 à 18 ans explorent les motu, étudient leur vie et leur histoire, testent des idées et partagent leurs découvertes.",
        details: [
          "Séjours des écoles locales",
          "Sciences et savoirs traditionnels",
          "Gestes concrets de protection",
        ],
      },
      {
        icon: BookOpenIcon,
        title: "Apprendre au-delà d’un âge ou d’un rivage",
        copy:
          "Stagiaires, groupes en visite, chercheurs et élèves locaux apportent leurs questions à l’Ecostation et apprennent les uns des autres.",
        details: [
          "Stages universitaires",
          "Programmes de terrain internationaux",
          "Chercheurs et élèves côte à côte",
        ],
      },
      {
        icon: LanguagesIcon,
        title: "La culture au cœur de la méthode",
        copy:
          "Le terrain rejoint la langue, la mémoire orale, les jeux, les légendes et les outils traditionnels comme modernes.",
        details: [
          "Programme interdisciplinaire",
          "Réflexion critique et collaborative",
          "Dialogue entre passé et présent",
        ],
      },
    ],
    bridgeTitle:
      "Une bonne question compte plus qu’une réponse parfaite.",
    bridgeCopy:
      "Les élèves observent, questionnent, testent, repensent et partagent—et c’est vraiment là que commence la responsabilité.",
    links: [
      {
        label: "L’éducation dans le fil d’impact",
        description:
          "Séjours, projets pédagogiques, programmes culturels et travaux d’élèves.",
        href: "/fr/impact?topic=education",
      },
      {
        label: "Visiter la station de terrain",
        description:
          "Voir comment l’apprentissage rejoint le rythme quotidien de la science de terrain.",
        href: "/fr/stations/bailey-field-station",
      },
      {
        label: "Découvrir Turtle Tales",
        description:
          "Découvrir l’atoll par le récit, le jeu et la curiosité.",
        href: "/turtle-tales",
      },
    ],
    metadataDescription:
      "Découvrez les programmes éducatifs et culturels de Tetiaroa Society, des séjours des élèves polynésiens aux stages et aux outils pédagogiques interdisciplinaires.",
  },
  "community-global-impact": {
    number: "03",
    title: "Communauté et impact global",
    shortTitle: "Communauté + Impact global",
    eyebrow: "Pilier 03 · Communauté + Impact global",
    heroTitle: "Comment un atoll peut-il changer ce qui se passe ailleurs ?",
    heroCopy:
      "Nous testons les idées face aux contraintes insulaires, corrigeons ce qui échoue et partageons ce qui fonctionne.",
    heroImage:
      "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=2400&q=88&auto=format&fit=crop",
    heroImageAlt: "Vue aérienne d’un atoll du Pacifique et de son lagon",
    introTitle: "Chaque problème mondial finit par arriver quelque part.",
    introCopy:
      "Les grands problèmes deviennent réels quelque part, alors Tetiaroa réunit communautés, scientifiques, innovateurs et financeurs pour tester les solutions face au réel insulaire.",
    principle:
      "Une idée compte lorsqu’une autre communauté peut la tester, l’adapter et la ramener chez elle.",
    mediaTitle: "Une idée ne compte que lorsqu’elle rencontre le réel.",
    media: [
      {
        kind: "image",
        src: "/pillars/community-global-impact/ocean-innovation.jpg",
        alt: "Rencontre d’innovation océanique de la Blue Climate Initiative",
        caption: "Blue Climate Initiative · des solutions pour les humains, l’océan et la planète",
      },
      {
        kind: "image",
        src: "/sub-render.webp",
        alt: "Concept du submersible Honu pour l’éducation et la recherche océaniques",
        caption: "Honu · ouvrir l’accès à l’océan",
      },
      {
        kind: "video",
        src: homeVideoSources.atoll.embedUrl,
        alt: "Vue aérienne de l’atoll de Tetiaroa",
        caption: "Tetiaroa · un système insulaire entier en vue",
      },
    ],
    effortsTitle: "L’atoll est un point de départ.",
    effortsIntro:
      "Réunir les bonnes personnes, tester l’idée, l’améliorer et partager les preuves.",
    efforts: [
      {
        icon: NetworkIcon,
        title: "Accélérer les solutions océan-climat",
        copy:
          "La Blue Climate Initiative réunit communautés, scientifiques, innovateurs, investisseurs et nouvelles voix, car les meilleures idées océan-climat ont besoin de tous.",
        details: [
          "Réseaux d’innovation océanique",
          "Recherche et collaboration",
          "Leadership des communautés",
        ],
      },
      {
        icon: BrainCircuitIcon,
        title: "Mettre les systèmes à l’épreuve",
        copy:
          "Le SWAC, le contrôle ciblé des moustiques et Honu mettent l’ingénierie au service du climat, de la santé, de la recherche et de l’éducation.",
        details: [
          "Infrastructures insulaires bas carbone",
          "Outils pour la santé et la biodiversité",
          "Éducation immersive à l’océan",
        ],
      },
      {
        icon: HandHeartIcon,
        title: "Former une communauté de pratique",
        copy:
          "Conférences, partenariats, bénévolat et recherche partagée portent les enseignements au-delà du récif.",
        details: [
          "Rencontres et partenariats",
          "Engagement bénévole",
          "Des enseignements qui voyagent",
        ],
      },
    ],
    bridgeTitle:
      "Tetiaroa n’aura jamais toutes les réponses.",
    bridgeCopy:
      "Et c’est très bien—l’atoll offre un lieu pour tester, écouter, améliorer et partager ce qui résiste à l’épreuve du réel.",
    links: [
      {
        label: "L’impact global dans le fil d’impact",
        description:
          "Partenariats, technologies, rencontres et idées qui voyagent au-delà du récif.",
        href: "/fr/impact?topic=global-impact",
      },
      {
        label: "Blue Climate Initiative",
        description:
          "Découvrir le réseau qui transforme les idées océan-climat en actions.",
        href: "https://www.blueclimateinitiative.org/",
        external: true,
      },
      {
        label: "Suivre la naissance de Honu",
        description:
          "Suivre Honu, future plateforme d’éducation et de recherche océaniques.",
        href: "/fr#honu-xr",
      },
    ],
    metadataDescription:
      "Découvrez comment Tetiaroa Society relie l’expérience insulaire à l’action mondiale pour l’océan et le climat par la collaboration, la technologie et la Blue Climate Initiative.",
  },
};

export const pillarContent: Record<
  PillarLocale,
  Record<PillarSlug, PillarContent>
> = {
  en: englishContent,
  fr: frenchContent,
};

export function isPillarSlug(value: string): value is PillarSlug {
  return (pillarSlugs as readonly string[]).includes(value);
}

export function getPillarPath(locale: PillarLocale, slug: PillarSlug) {
  return `${locale === "fr" ? "/fr" : ""}/pillars/${slug}`;
}

export function getPillarUrl(locale: PillarLocale, slug: PillarSlug) {
  return `https://www.tetiaroasociety.org${getPillarPath(locale, slug)}`;
}
