export type Program = {
  tag: string;
  title: string;
  description: string;
  duration: string;
  image: string;
  alt: string;
};

export const programs: Program[] = [
  {
    tag: "Reef",
    title: "Coral resilience, year 4.",
    description: "Tracking recovery from the 2016 bleaching event.",
    duration: "4 YR",
    image:
      "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=1200&q=85&auto=format&fit=crop",
    alt: "Coral reef close-up",
  },
  {
    tag: "Marine",
    title: "Turtle nesting patrol.",
    description: "Nightly from October to March. 214 nests in 2025.",
    duration: "ANNUAL",
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=85&auto=format&fit=crop",
    alt: "Sea turtle on a tropical beach",
  },
  {
    tag: "Avian",
    title: "Seabird recovery.",
    description: "Quarterly transects across all 12 motu since 2022.",
    duration: "ONGOING",
    image:
      "https://images.unsplash.com/photo-1587613864411-ac83abff7c2e?w=1200&q=85&auto=format&fit=crop",
    alt: "Seabirds above the ocean",
  },
  {
    tag: "Restoration",
    title: "Rat-free atoll.",
    description: "520 hectares. Largest eradication in French Polynesia.",
    duration: "2022",
    image:
      "https://images.unsplash.com/photo-1502810190503-8303352d0dd1?w=1200&q=85&auto=format&fit=crop",
    alt: "Palm-lined tropical atoll seen from above",
  },
  {
    tag: "Biosecurity",
    title: "Mosquito elimination.",
    description: "Atoll-wide suppression with no insecticide.",
    duration: "PILOT",
    image:
      "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=1200&q=85&auto=format&fit=crop",
    alt: "Soft macro image of mosquito-related field work",
  },
  {
    tag: "Education",
    title: "Ora Hoa classroom.",
    description: "Polynesian students, Polynesian science, every term.",
    duration: "K-12",
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&q=85&auto=format&fit=crop",
    alt: "Students learning outdoors",
  },
];

export const stories: Program[] = [
  {
    tag: "Research",
    title: "What the reef remembers about a storm.",
    description: "Three years of resilience data from the windward side.",
    duration: "8 MIN",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1400&q=85&auto=format&fit=crop",
    alt: "Stormy tropical reef waters",
  },
  {
    tag: "Wildlife",
    title: "Counting honu by moonlight.",
    description: "A season with Te Mana o Te Moana. 214 nests.",
    duration: "5 MIN",
    image:
      "https://images.unsplash.com/photo-1591025207163-942350e47db2?w=1400&q=85&auto=format&fit=crop",
    alt: "Sea turtle near the surface at night",
  },
  {
    tag: "Restoration",
    title: "After the rats: what comes back.",
    description: "Seabird transects two years post-eradication.",
    duration: "6 MIN",
    image:
      "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=1400&q=85&auto=format&fit=crop",
    alt: "Seabirds returning to the atoll",
  },
  {
    tag: "The House",
    title: "A day at the Ecostation.",
    description: "Inside Te Fare rua ihi - the House of Multiple Sciences.",
    duration: "3 MIN",
    image:
      "https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=1400&q=85&auto=format&fit=crop",
    alt: "Research station facing the lagoon",
  },
];
