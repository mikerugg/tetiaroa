import {
  type ImpactBodyBlock,
  type ImpactCategory,
  type ImpactContentEntry,
  toImpactFeedItem,
} from "./types";

type FallbackSeed = {
  id: string;
  title: string;
  summary: string;
  category: ImpactCategory;
  secondaryCategories: ImpactCategory[];
  latestUpdate: string;
  status: string;
  location: string;
  heroImage: string;
  heroImageAlt: string;
  metric: string;
  tags: string[];
};

function paragraph(key: string, text: string): ImpactBodyBlock {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `${key}-span`,
        text,
        marks: [],
      },
    ],
  };
}

const coolReefEntry: ImpactContentEntry = {
  id: "cool-reef",
  title: "Cool Reef: A temperature-controlled environment for coral development",
  slug: "cool-reef",
  language: "en",
  translationKey: "drupal-node-765",
  entryType: "Project",
  summary:
    "A research project testing shade and localized cooling as ways to protect coral fragments through hotter lagoon conditions.",
  category: "Research",
  secondaryCategories: ["Conservation", "Technology"],
  publishedAt: "2022-12-15",
  latestUpdate: "2024-12-31",
  status: "Project archive",
  location: "Tetiaroa reef nursery",
  heroImage:
    "https://www.tetiaroasociety.org/sites/default/files/2026-03/coolreef-2.jpg",
  heroImageAlt: "Researchers checking coral growth in the Cool Reef project",
  metric: "2022-2024",
  tags: ["Coral development", "Thermal stress", "CRIOBE"],
  body: [
    paragraph(
      "cool-reef-1",
      "Cool Reef studied how young coral fragments respond when their immediate environment is shaded, cooled, or left in normal lagoon conditions.",
    ),
    paragraph(
      "cool-reef-2",
      "The work focused on Acropora globiceps fragments and tested whether a carefully controlled microclimate could support coral development during periods of heat stress.",
    ),
    paragraph(
      "cool-reef-3",
      "This entry is seeded from the legacy Drupal project node so the new impact archive has a real migration target while the Sanity dataset is being prepared.",
    ),
  ],
  gallery: [
    {
      image:
        "https://www.tetiaroasociety.org/sites/default/files/2026-03/Fragments-d-acropora-globiceps-control.png",
      alt: "Acropora globiceps coral fragments in normal conditions",
      caption: "Normal conditions",
    },
    {
      image:
        "https://www.tetiaroasociety.org/sites/default/files/2026-03/Fragments-d-acropora-globiceps-ombrage.png",
      alt: "Acropora globiceps coral fragments under shade",
      caption: "Shade",
    },
    {
      image:
        "https://www.tetiaroasociety.org/sites/default/files/2026-03/Fragments-d-acropora-globiceps-refroidissement.png",
      alt: "Acropora globiceps coral fragments under cooling",
      caption: "Cooling",
    },
  ],
  projectDates: "2022-2024",
  team: [
    "Serge Planes",
    "Claire Boitel",
    "Hugo Bischoff",
    "Caroline Bonpain",
    "Clement Esclavy",
  ],
  affiliation: "CRIOBE",
  legacyNodeId: 765,
  legacyVid: 1410,
  legacyBundle: "casup_project",
  legacyPath: "/programs/research/cool-reef",
  seoDescription:
    "Cool Reef tested shade and localized cooling as tools for coral development on Tetiaroa.",
};

const fallbackSeeds: FallbackSeed[] = [
  {
    id: "tarp-reef-recovery",
    title: "TARP Reef Recovery Lines",
    summary:
      "Season after season, reef transects are showing where coral is holding, where it is struggling, and what the lagoon is telling us next.",
    category: "TARP",
    secondaryCategories: ["Research", "Conservation"],
    latestUpdate: "2026-06-18",
    status: "Field season active",
    location: "Honuea lagoon and outer reef",
    heroImage:
      "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=1400&q=85&auto=format&fit=crop",
    heroImageAlt: "A close view of branching coral in clear tropical water",
    metric: "9 reef lines",
    tags: ["Coral recovery", "Lagoon health", "Field data"],
  },
  {
    id: "ora-hoa-classroom",
    title: "Ora Hoa Learning Ground",
    summary:
      "Students learn the atoll by watching reefs, walking cultural routes, and treating Polynesian knowledge as living science, not a chapter in a book.",
    category: "Education",
    secondaryCategories: ["Culture", "Global Impact"],
    latestUpdate: "2026-06-12",
    status: "Classroom modules in motion",
    location: "Onetahi field campus",
    heroImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=85&auto=format&fit=crop",
    heroImageAlt: "Students gathered outdoors for a collaborative lesson",
    metric: "K-12 pathway",
    tags: ["Students", "Cultural learning", "Field kits"],
  },
  {
    id: "honu-xr",
    title: "Honu XR Field Trips",
    summary:
      "The virtual submersible lets students far from Tetiaroa descend into the lagoon story before they ever set foot on the atoll.",
    category: "Technology",
    secondaryCategories: ["Education", "Global Impact"],
    latestUpdate: "2026-06-05",
    status: "Prototype expanding",
    location: "Global classrooms",
    heroImage: "/sub-render.png",
    heroImageAlt: "Render of the Honu XR submersible for virtual field trips",
    metric: "104 m story dive",
    tags: ["Honu XR", "VR learning", "Ocean literacy"],
  },
  {
    id: "biosecurity-mosquito",
    title: "Mosquito-Free Atoll Work",
    summary:
      "Biosecurity teams are testing a lower-impact pathway for suppressing mosquitoes without turning the atoll into a chemistry experiment.",
    category: "Biosecurity",
    secondaryCategories: ["Research", "Technology"],
    latestUpdate: "2026-05-28",
    status: "Pilot monitoring",
    location: "Lagoon edge test zones",
    heroImage:
      "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=1400&q=85&auto=format&fit=crop",
    heroImageAlt: "A quiet tropical shoreline with shallow water and palm trees",
    metric: "No insecticide",
    tags: ["Mosquito control", "Public health", "Island resilience"],
  },
  {
    id: "seabird-recovery",
    title: "Seabird Return Counts",
    summary:
      "After eradication, transects are watching the motu answer back: nests, calls, and small signs of recovery returning to shore.",
    category: "Wildlife",
    secondaryCategories: ["Conservation", "Research"],
    latestUpdate: "2026-05-17",
    status: "Quarterly counts",
    location: "Tahuna Iti colony watch",
    heroImage:
      "https://images.unsplash.com/photo-1587613864411-ac83abff7c2e?w=1400&q=85&auto=format&fit=crop",
    heroImageAlt: "Seabirds flying above the ocean",
    metric: "12 motu watched",
    tags: ["Seabirds", "Transects", "Habitat recovery"],
  },
  {
    id: "rat-free-atoll",
    title: "Rat-Free Atoll Stewardship",
    summary:
      "The eradication was a turning point; the feed now follows the quieter work of keeping that promise intact season after season.",
    category: "Conservation",
    secondaryCategories: ["Biosecurity", "Wildlife"],
    latestUpdate: "2026-05-06",
    status: "Stewardship ongoing",
    location: "Across all 12 motu",
    heroImage:
      "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=1400&q=85&auto=format&fit=crop",
    heroImageAlt: "Aerial view of a tropical atoll and turquoise lagoon",
    metric: "520 ha rat-free",
    tags: ["Island restoration", "Motu care", "Recovery"],
  },
  {
    id: "digital-twin",
    title: "Digital Twin and Biocode",
    summary:
      "Scans, species records, and reef observations are building a model sharp enough to notice change while there is still time to act.",
    category: "Technology",
    secondaryCategories: ["Research", "TARP"],
    latestUpdate: "2026-04-24",
    status: "Data layers syncing",
    location: "Reef, lagoon, motu, and species layers",
    heroImage:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1400&q=85&auto=format&fit=crop",
    heroImageAlt: "A snorkeler swimming over a clear coral reef",
    metric: "167 species",
    tags: ["Biocode", "Mapping", "Early signal"],
  },
  {
    id: "global-island-resilience",
    title: "Island Resilience Exchange",
    summary:
      "What is tested on Tetiaroa travels outward through partner labs, island communities, and people facing the same hard questions.",
    category: "Global Impact",
    secondaryCategories: ["Culture", "Research"],
    latestUpdate: "2026-04-08",
    status: "Partner brief open",
    location: "Pacific partners and classrooms",
    heroImage:
      "https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=1400&q=85&auto=format&fit=crop",
    heroImageAlt: "A research station looking out over tropical water",
    metric: "22 partner labs",
    tags: ["Open learning", "Island networks", "Shared methods"],
  },
  {
    id: "cultural-routes",
    title: "Cultural Routes and Visitor Learning",
    summary:
      "Guides connect reef, birds, plants, stories, and protocol so each visit gives something back to the atoll.",
    category: "Culture",
    secondaryCategories: ["Education", "Conservation"],
    latestUpdate: "2026-03-29",
    status: "On-atoll interpretation",
    location: "Onetahi and visitor routes",
    heroImage:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1400&q=85&auto=format&fit=crop",
    heroImageAlt: "People learning outdoors near the ocean",
    metric: "Every visit teaches",
    tags: ["Guides", "Protocol", "Place-based learning"],
  },
];

function seedToEntry(seed: FallbackSeed): ImpactContentEntry {
  return {
    id: seed.id,
    title: seed.title,
    slug: seed.id,
    language: "en",
    entryType: "Project",
    summary: seed.summary,
    category: seed.category,
    secondaryCategories: seed.secondaryCategories,
    publishedAt: seed.latestUpdate,
    latestUpdate: seed.latestUpdate,
    status: seed.status,
    location: seed.location,
    heroImage: seed.heroImage,
    heroImageAlt: seed.heroImageAlt,
    metric: seed.metric,
    tags: seed.tags,
    body: [paragraph(`${seed.id}-body`, seed.summary)],
  };
}

export const fallbackImpactEntries: ImpactContentEntry[] = [
  coolReefEntry,
  ...fallbackSeeds.map(seedToEntry),
];

export const fallbackImpactFeedItems = fallbackImpactEntries.map(toImpactFeedItem);

export function getFallbackImpactEntryBySlug(slug: string) {
  return fallbackImpactEntries.find((entry) => entry.slug === slug) ?? null;
}
