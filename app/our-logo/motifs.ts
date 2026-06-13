export type MotifId =
  | "fern"
  | "shark-teeth"
  | "braid"
  | "spiral"
  | "waves"
  | "eye-of-light"
  | "bird";

export type Motif = {
  id: MotifId;
  title: string;
  shortName: string;
  meaning: string;
  keywords: string[];
};

export const motifs: Motif[] = [
  {
    id: "braid",
    title: "The Braid",
    shortName: "Braid",
    meaning:
      "Traditional skill made visible in rooftops, ropes, and ornaments: a link that binds us all together.",
    keywords: ["link", "craft", "society"],
  },
  {
    id: "waves",
    title: "The Waves",
    shortName: "Waves",
    meaning:
      "The ocean surrounding Teti'aroa: an inexhaustible source of life and the living link between all of us.",
    keywords: ["ocean", "life", "connection"],
  },
  {
    id: "eye-of-light",
    title: "The Eye of Light",
    shortName: "Eye of light",
    meaning:
      "Te Mata Hoata: deep intuition and understanding, the light of knowledge and research.",
    keywords: ["knowledge", "research", "intuition"],
  },
  {
    id: "bird",
    title: "The Bird",
    shortName: "Bird",
    meaning:
      "A connection between our world and the etheric one, carrying messages revealed through science and guidance.",
    keywords: ["messages", "science", "guidance"],
  },
  {
    id: "shark-teeth",
    title: "The Shark Teeth",
    shortName: "Shark teeth",
    meaning:
      "Messenger of the god Tane, the first human-like god; a sign of protection, strength, and respect.",
    keywords: ["strength", "respect", "guardian"],
  },
  {
    id: "fern",
    title: "The Fern",
    shortName: "Fern",
    meaning:
      "A sacred plant of traditional medicine, carrying healing, protection, and care.",
    keywords: ["healing", "protection", "care"],
  },
  {
    id: "spiral",
    title: "The Spiral",
    shortName: "Spiral",
    meaning:
      "An ancient symbol of continuity and flowing energy, passing culture forward through time.",
    keywords: ["continuity", "energy", "transmission"],
  },
];
