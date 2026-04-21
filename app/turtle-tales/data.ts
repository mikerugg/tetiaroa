export type PlushPalette = {
  shell: string;
  body: string;
  fin: string;
  belly: string;
  stitch: string;
  sparkle: string;
};

export type PlushCharacter = {
  id: string;
  name: string;
  persona: string;
  blurb: string;
  price: string;
  badge: string;
  impact: string;
  catchphrase: string;
  starterPack: string[];
  palette: PlushPalette;
};

export type StoryAdventure = {
  id: string;
  label: string;
  place: string;
  colors: [string, string, string];
  visual: string;
  titleBits: string[];
  quests: string[];
  treasures: string[];
};

export type StoryMood = {
  id: string;
  label: string;
  imageStyle: string;
  openings: string[];
  endings: string[];
};

export const plushCharacters: PlushCharacter[] = [
  {
    id: "lani",
    name: "Lani Lagoon",
    persona: "Soft dreamer",
    blurb:
      "A seafoam storyteller who loves sleepy lagoon adventures and whispered coral songs.",
    price: "$34",
    badge: "QR shell charm included",
    impact: "Helps fund one turtle-patrol shift log.",
    catchphrase: "Best for calm bedtime stories.",
    starterPack: [
      "plush turtle",
      "scan-to-start shell tag",
      "3 starter AI story credits",
      "adoption card + stickers",
    ],
    palette: {
      shell: "#21a19c",
      body: "#9ce7dc",
      fin: "#58c6bf",
      belly: "#fff0d9",
      stitch: "#13716d",
      sparkle: "#fff7b8",
    },
  },
  {
    id: "kiko",
    name: "Kiko Comet",
    persona: "Brave explorer",
    blurb:
      "A bright reef racer built for treasure hunts, fast friends, and splashy rescue missions.",
    price: "$34",
    badge: "Adventure QR shell included",
    impact: "Helps fund nest markers for the beach team.",
    catchphrase: "Best for bold quest stories.",
    starterPack: [
      "plush turtle",
      "adventure shell QR",
      "3 poster-image credits",
      "collector passport",
    ],
    palette: {
      shell: "#ff8654",
      body: "#ffd1b6",
      fin: "#ffac71",
      belly: "#fff3de",
      stitch: "#ca5e2f",
      sparkle: "#ffe489",
    },
  },
  {
    id: "moa",
    name: "Moa Moonshell",
    persona: "Gentle guardian",
    blurb:
      "A moonlit hatchling who shines during night beach patrols and glowing star-water tales.",
    price: "$36",
    badge: "Glow-shell QR included",
    impact: "Helps fund red-filter lights for night patrols.",
    catchphrase: "Best for magical moon stories.",
    starterPack: [
      "plush turtle",
      "glow-shell QR tag",
      "3 bedtime story credits",
      "night-beach postcard pack",
    ],
    palette: {
      shell: "#5562d9",
      body: "#c9d3ff",
      fin: "#8d9af4",
      belly: "#fff6e4",
      stitch: "#3d49b8",
      sparkle: "#c4f4ff",
    },
  },
];

export const storyAdventures: StoryAdventure[] = [
  {
    id: "reef-treasure",
    label: "Reef treasure dive",
    place: "The candy-color reef garden",
    colors: ["#8ce2ff", "#30b7c9", "#ffdf8a"],
    visual: "picture-book coral treasure map",
    titleBits: ["Rainbow Compass", "Coral Crown", "Bubble Treasure"],
    quests: [
      "follow a string of glowing shells through the reef arches",
      "help a shy fish choir rehearse for the lagoon parade",
      "find the missing coral compass before the tide turns",
    ],
    treasures: ["a pearl whistle", "a coral ribbon", "a map of sleepy currents"],
  },
  {
    id: "moonlight-hatch",
    label: "Moonlight hatch watch",
    place: "The silver beach under a sleepy moon",
    colors: ["#132149", "#355fbf", "#ffe6b4"],
    visual: "storybook moonlit shoreline with lantern stars",
    titleBits: ["Moonbeam Parade", "Sleepy Sand Song", "Star Nest Secret"],
    quests: [
      "count tiny hatchling tracks before the waves can erase them",
      "carry a pocket of moonlight to the quietest nest on the beach",
      "guide a drowsy crab band away from the hatch path",
    ],
    treasures: ["a moon-pearl lantern", "a silver shell stamp", "a lullaby tide ribbon"],
  },
  {
    id: "lagoon-picnic",
    label: "Lagoon picnic mission",
    place: "The hush-blue lagoon with floating picnic clouds",
    colors: ["#abf0dc", "#51c6b8", "#fff0b8"],
    visual: "sunny lagoon picnic with floating fruit boats",
    titleBits: ["Lagoon Picnic", "Driftwood Picnic", "Sunbeam Snack Quest"],
    quests: [
      "deliver sea-grape snacks to a drifting birthday raft",
      "rescue a basket of mango stars from a silly breeze",
      "teach baby rays how to nap after lunch in the shallows",
    ],
    treasures: ["a mango-star napkin", "a driftwood drum", "a shell-swirled blanket"],
  },
];

export const storyMoods: StoryMood[] = [
  {
    id: "bedtime",
    label: "Bedtime glow",
    imageStyle: "soft watercolor + moonlit edges",
    openings: [
      "When the lagoon was quiet enough to hear a shell blink,",
      "Just as the stars tucked their knees into the sea,",
      "At the exact moment the tide whispered goodnight,",
    ],
    endings: [
      "By the last page, everyone was sleepy and safe.",
      "The tide hummed a lullaby all the way home.",
      "And the moon drew a tiny heart over the water.",
    ],
  },
  {
    id: "giggle",
    label: "Giggle mode",
    imageStyle: "bright gouache + wobbly sticker shapes",
    openings: [
      "On the silliest splash of the whole afternoon,",
      "Right after a coconut crab hiccupped confetti,",
      "Before breakfast bubbles had even finished popping,",
    ],
    endings: [
      "Everybody laughed so hard the fish made encore bubbles.",
      "The reef clapped with its tiniest sparkly fins.",
      "Even the clouds needed a minute to stop giggling.",
    ],
  },
  {
    id: "brave",
    label: "Brave quest",
    imageStyle: "bold poster art + heroic ocean light",
    openings: [
      "The adventure started the instant the current tilted forward,",
      "As soon as the horizon flashed its secret signal,",
      "With one brave wiggle of a flipper,",
    ],
    endings: [
      "The whole beach cheered when the mission was complete.",
      "The tide carried the victory song across every motu.",
      "That night, the stars pinned a medal above the lagoon.",
    ],
  },
];

export const activationSteps = [
  {
    step: "01",
    title: "Pick a hatchling.",
    copy:
      "Choose the turtle plush your kid wants to keep beside the bed, backpack, or reading fort.",
  },
  {
    step: "02",
    title: "Scan the shell QR.",
    copy:
      "Every plush unlocks its own turtle profile, starter credits, and a guided story studio.",
  },
  {
    step: "03",
    title: "Make stories and art.",
    copy:
      "AI turns the turtle's name, mood, and mission into picture-book text and collectible images.",
  },
];

export const grownupCards = [
  {
    title: "Kid-safe prompts",
    copy:
      "The story builder uses guided choices instead of open-ended chatting, so the tone stays playful and age-appropriate.",
  },
  {
    title: "QR-linked ownership",
    copy:
      "Each shell tag activates one turtle profile, making the stories feel personal to the plush your child actually owns.",
  },
  {
    title: "Real-world impact",
    copy:
      "A portion of every plush goes back to turtle conservation work and night patrols on Tetiaroa.",
  },
];
