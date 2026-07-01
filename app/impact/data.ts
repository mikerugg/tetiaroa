export const impactCategories = [
  "Education",
  "TARP",
  "Research",
  "Technology",
  "Global Impact",
  "Conservation",
  "Biosecurity",
  "Wildlife",
  "Culture",
] as const;

export type ImpactCategory = (typeof impactCategories)[number];

export type ImpactProject = {
  id: string;
  title: string;
  summary: string;
  category: ImpactCategory;
  secondaryCategories: ImpactCategory[];
  latestUpdate: string;
  status: string;
  location: string;
  image: string;
  alt: string;
  metric: string;
  tags: string[];
  href: string;
  actionLabel: string;
};

export const impactProjects: ImpactProject[] = [
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
    image:
      "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=1400&q=85&auto=format&fit=crop",
    alt: "A close view of branching coral in clear tropical water",
    metric: "9 reef lines",
    tags: ["Coral recovery", "Lagoon health", "Field data"],
    href: "/#twin",
    actionLabel: "View update",
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
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=85&auto=format&fit=crop",
    alt: "Students gathered outdoors for a collaborative lesson",
    metric: "K-12 pathway",
    tags: ["Students", "Cultural learning", "Field kits"],
    href: "/field-station#education",
    actionLabel: "Open program",
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
    image: "/sub-render.png",
    alt: "Render of the Honu XR submersible for virtual field trips",
    metric: "104 m story dive",
    tags: ["Honu XR", "VR learning", "Ocean literacy"],
    href: "/#honu-xr",
    actionLabel: "Explore XR",
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
    image:
      "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=1400&q=85&auto=format&fit=crop",
    alt: "A quiet tropical shoreline with shallow water and palm trees",
    metric: "No insecticide",
    tags: ["Mosquito control", "Public health", "Island resilience"],
    href: "/impact#feed",
    actionLabel: "Read field note",
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
    image:
      "https://images.unsplash.com/photo-1587613864411-ac83abff7c2e?w=1400&q=85&auto=format&fit=crop",
    alt: "Seabirds flying above the ocean",
    metric: "12 motu watched",
    tags: ["Seabirds", "Transects", "Habitat recovery"],
    href: "/impact#feed",
    actionLabel: "View counts",
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
    image:
      "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=1400&q=85&auto=format&fit=crop",
    alt: "Aerial view of a tropical atoll and turquoise lagoon",
    metric: "520 ha rat-free",
    tags: ["Island restoration", "Motu care", "Recovery"],
    href: "/brando-story/work",
    actionLabel: "See the work",
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
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1400&q=85&auto=format&fit=crop",
    alt: "A snorkeler swimming over a clear coral reef",
    metric: "167 species",
    tags: ["Biocode", "Mapping", "Early signal"],
    href: "/#twin",
    actionLabel: "See twin",
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
    image:
      "https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=1400&q=85&auto=format&fit=crop",
    alt: "A research station looking out over tropical water",
    metric: "22 partner labs",
    tags: ["Open learning", "Island networks", "Shared methods"],
    href: "/team",
    actionLabel: "Meet partners",
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
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1400&q=85&auto=format&fit=crop",
    alt: "People learning outdoors near the ocean",
    metric: "Every visit teaches",
    tags: ["Guides", "Protocol", "Place-based learning"],
    href: "/team#comms-culture-team",
    actionLabel: "Meet guides",
  },
];
