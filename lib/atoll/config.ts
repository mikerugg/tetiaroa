import type { AtollHub, GuideCategory, GuideCategoryId, GuideHabitatId, GuideLocale } from "./types";

export function getAtollPath(locale: GuideLocale, suffix = "") {
  return `${locale === "fr" ? "/fr" : ""}/island${suffix ? `/${suffix.replace(/^\/+/, "")}` : ""}`;
}

export const categoryLabels: Record<GuideLocale, Record<GuideCategoryId, string>> = {
  en: { birds: "Birds", plants: "Plants", fish: "Fish", turtles: "Turtles", "marine-mammals": "Marine mammals", invertebrates: "Invertebrates" },
  fr: { birds: "Oiseaux", plants: "Plantes", fish: "Poissons", turtles: "Tortues", "marine-mammals": "Mammifères marins", invertebrates: "Invertébrés" },
};
export const habitatLabels: Record<GuideLocale, Record<GuideHabitatId, string>> = {
  en: { "motu-shore": "Motu and shore", "lagoon-reef": "Lagoon and reef", "open-ocean": "Open ocean" },
  fr: { "motu-shore": "Motu et rivages", "lagoon-reef": "Lagon et récif", "open-ocean": "Au large" },
};
export const subgroupLabels: Record<GuideLocale, Record<string, string>> = {
  en: { seabirds: "Seabirds", "shore-birds": "Shore and terrestrial birds", "bony-fish": "Bony fish", sharks: "Sharks", rays: "Rays", crustaceans: "Crustaceans", molluscs: "Molluscs", "corals-anemones": "Corals and anemones", echinoderms: "Echinoderms", worms: "Worms" },
  fr: { seabirds: "Oiseaux marins", "shore-birds": "Oiseaux terrestres et de rivage", "bony-fish": "Poissons osseux", sharks: "Requins", rays: "Raies", crustaceans: "Crustacés", molluscs: "Mollusques", "corals-anemones": "Coraux et anémones", echinoderms: "Échinodermes", worms: "Vers" },
};
const introductions: Record<GuideLocale, Record<GuideCategoryId, string>> = {
  en: {
    birds: "Look above the lagoon, into the trees, and along the reef at low tide. Tetiaroa's birdlife includes nesting seabirds, shorebirds on long migrations, and birds that spend their lives here.",
    plants: "An atoll's plants tell you where you are: on the exposed shore, beneath a forest canopy, or beside a place people have tended. Explore their names, habitats, and uses across Polynesia.",
    fish: "Some graze the reef. Others hunt in the lagoon or patrol the water beyond it. Meet the fish, sharks, and rays described by the Society's guides and researchers.",
    turtles: "Green turtles return to Tetiaroa's beaches to lay their eggs. Meet them alongside the other sea turtles recorded in French Polynesian waters, with local sightings and nesting records described in each profile.",
    "marine-mammals": "Humpback whales visit the waters outside Tetiaroa's reef. Dolphins and beaked whales have their own routes through the region. Explore what is known about their lives in Polynesian waters.",
    invertebrates: "A coconut crab in the forest and a coral colony on the reef share a place in this guide. Explore the animals without backbones that build, graze, burrow, and hunt across the atoll.",
  },
  fr: {
    birds: "Levez les yeux au-dessus du lagon, regardez dans les arbres et longez le récif à marée basse. L'avifaune de Tetiaroa réunit des oiseaux marins nicheurs, de grands migrateurs et des oiseaux qui vivent ici toute l'année.",
    plants: "Sur un atoll, les plantes racontent le lieu : un rivage exposé, un sous-bois ou un espace cultivé. Découvrez leurs noms, leurs milieux et leurs usages à travers la Polynésie.",
    fish: "Certains broutent le récif. D'autres chassent dans le lagon ou parcourent les eaux du large. Rencontrez les poissons, requins et raies décrits par les guides et les chercheurs de Tetiaroa Society.",
    turtles: "Les tortues vertes reviennent pondre sur les plages de Tetiaroa. Découvrez-les aux côtés des autres tortues marines signalées dans les eaux polynésiennes, avec les observations et les sites de ponte précisés dans chaque fiche.",
    "marine-mammals": "Les baleines à bosse fréquentent les eaux au-delà du récif de Tetiaroa. Dauphins et baleines à bec suivent leurs propres routes dans la région. Découvrez ce que l’on sait de leur vie dans les eaux polynésiennes.",
    invertebrates: "Le crabe de cocotier de la forêt et la colonie corallienne du récif se retrouvent dans ce guide. Découvrez les animaux sans colonne vertébrale qui bâtissent, broutent, creusent et chassent sur l'atoll.",
  },
};
const subgroups: Record<GuideCategoryId, string[]> = {
  birds: ["seabirds", "shore-birds"], plants: [], fish: ["bony-fish", "sharks", "rays"], turtles: [], "marine-mammals": [], invertebrates: ["crustaceans", "molluscs", "corals-anemones", "echinoderms", "worms"],
};
const ids = Object.keys(subgroups) as GuideCategoryId[];
function makeCategoryDefaults(locale: GuideLocale): GuideCategory[] {
  return ids.map((id) => ({
    id, title: categoryLabels[locale][id], introduction: introductions[locale][id], count: 0,
    subgroups: subgroups[id].map((key) => ({ id: key, title: subgroupLabels[locale][key] })), resources: [], relatedStories: [],
  }));
}
export const categoryDefaults: Record<GuideLocale, GuideCategory[]> = {
  en: makeCategoryDefaults("en"), fr: makeCategoryDefaults("fr"),
};

export const hubDefaults: Record<GuideLocale, AtollHub> = {
  en: {
    title: "Look closer at Tetiaroa.",
    introduction: "Birds nest in the trees, fish graze the reef and turtles return to the shore. Get to know the plants and animals of the atoll and its surrounding waters through the knowledge of guides, rangers and researchers.",
    image: { url: "/geology/tetiaroa-map.webp", alt: "Tetiaroa's lagoon encircled by its reef and wooded motu" },
    habitats: [
      { id: "motu-shore", title: "Motu and shore", introduction: "Birds in the canopy. Crabs underfoot. Plants rooted in sand made from the reef. Begin where the land meets the water." },
      { id: "lagoon-reef", title: "Lagoon and reef", introduction: "Look closer at the shallow water: grazing fish, living coral, and animals sheltered among the reef's branches." },
      { id: "open-ocean", title: "Open ocean", introduction: "Humpback whales arrive from Antarctic feeding grounds. Seabirds range far from land. Explore the lives that connect Tetiaroa to the wider Pacific." },
    ], featuredEntries: [], relatedStories: [],
  },
  fr: {
    title: "Tetiaroa, de plus près.",
    introduction: "Des oiseaux nichent dans les arbres, des poissons broutent le récif et des tortues reviennent sur les plages. Découvrez les plantes et les animaux de l’atoll et des eaux voisines à travers les connaissances des guides, des gardes nature et des chercheurs.",
    image: { url: "/geology/tetiaroa-map.webp", alt: "Le lagon de Tetiaroa entouré de son récif et de ses motu boisés" },
    habitats: [
      { id: "motu-shore", title: "Motu et rivages", introduction: "Des oiseaux dans la canopée, des crabes sous les pas, des plantes enracinées dans le sable corallien. Commencez là où la terre rencontre l'eau." },
      { id: "lagoon-reef", title: "Lagon et récif", introduction: "Approchez-vous des eaux peu profondes : poissons brouteurs, coraux vivants et animaux abrités parmi leurs branches." },
      { id: "open-ocean", title: "Au large", introduction: "Des baleines à bosse arrivent des eaux nourricières de l’Antarctique. Des oiseaux marins s’éloignent des terres. Découvrez les vies qui relient Tetiaroa au reste du Pacifique." },
    ], featuredEntries: [], relatedStories: [],
  },
};
