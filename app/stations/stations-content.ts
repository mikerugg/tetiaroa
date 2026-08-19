import { homeCopies, type HomeLocale } from "../home-copy";
import { ENGLISH_STATIONS_PATH } from "../language-links";
import type { TopToolbarCopy } from "../top-toolbar";
import {
  BedDoubleIcon,
  BikeIcon,
  BookOpenIcon,
  BugIcon,
  CompassIcon,
  FishIcon,
  FlaskConicalIcon,
  LandmarkIcon,
  LeafIcon,
  MicroscopeIcon,
  ShipIcon,
  UtensilsIcon,
  WavesIcon,
  type LucideIcon,
} from "lucide-react";

export const stationSlugs = ["bailey-field-station"] as const;

export type StationSlug = (typeof stationSlugs)[number];

export type StationStatus = "open" | "planned";

export type StationFact = {
  label: string;
  value: string;
};

export type StationImage = {
  src: string;
  alt: string;
  caption: string;
};

export type StationWorkArea = {
  icon: LucideIcon;
  title: string;
  copy: string;
};

export type StationFacility = {
  icon: LucideIcon;
  title: string;
  copy: string;
  items: string[];
};

export type StationStepAction = {
  label: string;
  href: string;
  external?: boolean;
};

export type StationStep = {
  title: string;
  copy: string;
  detail?: string;
  action?: StationStepAction;
};

export type StationRate = {
  audience: string;
  rate: string;
  unit: string;
  note?: string;
};

export type StationContent = {
  status: StationStatus;
  name: string;
  shortName: string;
  formerName: string;
  location: string;
  eyebrow: string;
  tagline: string;
  summary: string;
  cardSummary: string;
  heroImage: string;
  heroImageAlt: string;
  cardImage: string;
  cardImageAlt: string;
  facts: StationFact[];

  originTitle: string;
  originLead: string;
  originBody: string[];
  originImage: StationImage;

  workEyebrow: string;
  workTitle: string;
  workIntro: string;
  workAreas: StationWorkArea[];

  facilitiesEyebrow: string;
  facilitiesTitle: string;
  facilitiesIntro: string;
  facilities: StationFacility[];

  galleryTitle: string;
  galleryIntro: string;
  gallery: StationImage[];

  atollEyebrow: string;
  atollTitle: string;
  atollBody: string[];
  atollNote: string;
  atollImage: StationImage;

  applyEyebrow: string;
  applyTitle: string;
  applyIntro: string;
  applyLeadTime: string;
  steps: StationStep[];

  ratesTitle: string;
  ratesIntro: string;
  rates: StationRate[];
  ratesFootnotes: string[];

  policyTitle: string;
  policyBody: string;
  policyItems: string[];
  policyNote: string;

  metadataTitle: string;
  metadataDescription: string;
};

const drupalImage = (path: string) =>
  `https://www.tetiaroasociety.org/sites/default/files/styles/max_1300x1300/public/${path}`;

/** Drupal originals, for images with no usable derivative at card size. */
const siteFile = (path: string) =>
  `https://www.tetiaroasociety.org/sites/default/files/${path}`;

export const RAMS_PORTAL_URL = "https://rams.ucnrs.org";

export const stations: Record<StationSlug, StationContent> = {
  "bailey-field-station": {
    status: "open",
    name: "Bailey Field Station",
    shortName: "Bailey Field Station",
    formerName: "the Ecostation",
    location: "Motu Onetahi, Tetiaroa Atoll",
    eyebrow: "Field Station 01 / Motu Onetahi",
    tagline: "The lab is a five-minute walk from the reef it studies.",
    summary:
      "The Bailey Field Station is where research on Tetiaroa actually happens. Reef, forest, brackish lakes, archaeological sites, and deep ocean water are all within a short walk or a short boat ride of the lab bench.",
    cardSummary:
      "Tetiaroa Society's first field station: LEED Platinum, beds for eighteen, wet and dry labs, and a whole atoll for a study site.",
    heroImage: drupalImage("2024-09/ecostation-from-above.JPG.webp?itok=VtdjW0V8"),
    heroImageAlt:
      "The Bailey Field Station seen from the air, set among palms on Motu Onetahi",
    cardImage: drupalImage("2025-09/station2.jpg.webp?itok=hjxTEpWO"),
    cardImageAlt:
      "The entrance and covered walkway of the Bailey Field Station",
    facts: [
      { label: "Location", value: "Motu Onetahi" },
      { label: "Built to", value: "LEED Platinum" },
      { label: "Sleeps", value: "18" },
      { label: "Dry lab", value: "40 m²" },
      { label: "From Tahiti", value: "53 km" },
    ],

    originTitle: "The resort next door built it and gave it away.",
    originLead:
      "Tetiaroa Society did not build its field station. It was given one.",
    originBody: [
      "While Pacific Beachcomber was constructing The Brando, its owners set aside part of the plan for something that would never sell a room: a facility built for scientists. When it was finished they donated it to Tetiaroa Society, and it became the hub for every piece of conservation and research work carried out on the atoll.",
      "It was designed and built to LEED Platinum standards. On an atoll that means the building has to account for its own water, power, and waste.",
      "It sits next to The Brando's staff village, inside the Onetahi community. Researchers eat at the staff cantina, ride the same bike paths, and are residents of a working island for the length of their stay.",
    ],
    originImage: {
      src: drupalImage("2025-09/station3.jpg.webp?itok=b1D-gloo"),
      alt: "The field station buildings surrounded by dense green vegetation",
      caption: "The buildings sit under the existing canopy.",
    },

    workEyebrow: "The work",
    workTitle: "What gets studied here.",
    workIntro:
      "The station is a base, not a program. The projects running through it belong to visiting scientists, Tetiaroa Society staff, and students — but they cluster around the questions this atoll is unusually good at answering.",
    workAreas: [
      {
        icon: WavesIcon,
        title: "Reef and lagoon",
        copy: "Coral condition, restoration trials, water chemistry, and the lagoon's response to heat. The reef starts a few metres past the beach, so a monitoring dive takes a morning.",
      },
      {
        icon: FishIcon,
        title: "Turtles and sharks",
        copy: "Green turtle nesting is monitored with Te Mana o te Moana, and the station's seawater tables and aquaria take the animals that need care. The nesting motus and the lagoon nursery are both reachable by the Society's boat.",
      },
      {
        icon: LeafIcon,
        title: "Native forest and seabirds",
        copy: "The Tetiaroa Atoll Restoration Project — rat and yellow crazy ant eradication, seabird colony monitoring with Te Manu, and holding back whatever arrives with the next hull. Most motus are now rat-free; the remaining few are still being worked.",
      },
      {
        icon: BugIcon,
        title: "Mosquito elimination",
        copy: "The AeLIMIN+ programme, led by Institut Louis Malardé with Tetiaroa Society alongside, suppressing Aedes mosquitoes on Onetahi through sterile male releases. It needs a lab, rearing space, and somewhere to stage a release week after week.",
      },
      {
        icon: LandmarkIcon,
        title: "Archaeology and culture",
        copy: "Tetiaroa's marae and settlement sites are under strict protection and under continuing study. Cultural research is treated as research here, not as background.",
      },
      {
        icon: FlaskConicalIcon,
        title: "Atoll systems",
        copy: "Brackish lakes, groundwater, soils, and a direct deep ocean water line — the physical plumbing of an atoll, available for sampling on site.",
      },
      {
        icon: BookOpenIcon,
        title: "Field courses",
        copy: "University classes use the dry lab's teaching space and the atoll as their subject. Students arrive as students and leave having run something of their own.",
      },
      {
        icon: CompassIcon,
        title: "Long-term monitoring",
        copy: "The same transects, the same nests, and the same water, measured year after year. Slow change only shows up in a long record.",
      },
    ],

    facilitiesEyebrow: "The building",
    facilitiesTitle: "Somewhere to work, sleep, and eat.",
    facilitiesIntro:
      "Everything below is on site and shared. Diving equipment and boat time need to be booked before you arrive.",
    facilities: [
      {
        icon: BedDoubleIcon,
        title: "Living quarters",
        copy: "Airy, comfortable, and built for people who will be tracking sand into them.",
        items: [
          "Five air-conditioned bedrooms",
          "Sleeping space for up to 18 scientists and staff",
          "Common area with a kitchenette",
          "Office and workspace",
          "Wifi throughout",
        ],
      },
      {
        icon: MicroscopeIcon,
        title: "Dry lab",
        copy: "Forty square metres, air-conditioned, and set up to hold a class as easily as a bench.",
        items: [
          "Teaching space",
          "Bench and work space",
          "General laboratory equipment",
          "Chemicals on request, arranged before arrival",
        ],
      },
      {
        icon: FlaskConicalIcon,
        title: "Wet lab",
        copy: "Outdoors, plumbed three ways, and the reason a lot of projects choose this station.",
        items: [
          "Fresh water, surface seawater, and deep ocean water lines",
          "Outdoor aquarium and 300-litre tanks",
          "Seawater tables",
        ],
      },
      {
        icon: ShipIcon,
        title: "On the water",
        copy: "Shared with other researchers and with the Society's own field programs.",
        items: [
          "Tetiaroa Society boat, normally driven by a Society driver",
          "Kayaks",
          "Diving equipment, pre-booking required",
          "Direct access to reef, lagoon, and open ocean",
        ],
      },
      {
        icon: UtensilsIcon,
        title: "Meals",
        copy: "Provided at The Brando staff cantina, a short walk or pedal from the housing.",
        items: [
          "Three meals a day, included in the daily rate",
          "Eaten alongside the island's staff community",
        ],
      },
      {
        icon: BikeIcon,
        title: "Getting around Onetahi",
        copy: "The motu is small and paved for bicycles, which is how everyone moves.",
        items: [
          "Bicycles available to all station users",
          "Carts for hauling gear",
          "Well-paved bike paths across the islet",
        ],
      },
    ],

    galleryTitle: "The station, in use.",
    galleryIntro:
      "Photographs taken by the people working here.",
    gallery: [
      {
        src: drupalImage("2025-09/lab.JPG.webp?itok=NwLIT_Ty"),
        alt: "Researchers at work in the station's dry lab",
        caption: "The dry lab, mid-project.",
      },
      {
        src: drupalImage("2024-09/Aquarium300L.jpg.webp?itok=ISlQXejf"),
        alt: "Three hundred litre aquarium tanks in the outdoor wet lab",
        caption: "300-litre tanks, fed by three separate water lines.",
      },
      {
        src: drupalImage("2025-09/bunk.JPG.webp?itok=TYpqNHne"),
        alt: "A bunk room in the field station dormitory",
        caption: "One of five air-conditioned bedrooms.",
      },
      {
        src: drupalImage(
          "2025-09/meeting%20in%20the%20ecostation.jpg.webp?itok=BiAy36i8",
        ),
        alt: "People gathered around a table in the station's common area",
        caption: "The common area, where teams plan the day.",
      },
      {
        src: drupalImage("2024-09/aquarium.jpg.webp?itok=pLow2Xyp"),
        alt: "A researcher caring for juvenile turtles in the laboratory",
        caption: "Juvenile honu under care in the lab.",
      },
      {
        src: drupalImage("2024-09/growing-coral.jpg.webp?itok=5FQtjYqj"),
        alt: "Coral fragments growing on a restoration frame",
        caption: "Coral grown out for restoration trials.",
      },
      {
        src: drupalImage("2025-09/boat.JPG.webp?itok=7-PC6F8f"),
        alt: "The Tetiaroa Society work boat loaded and ready to leave",
        caption: "A Society boat to quickly get around.",
      },
      {
        src: drupalImage("2025-09/kayaks.jpg.webp?itok=mxwHnQJO"),
        alt: "Kayaks stored at the field station ready for use",
        caption: "Kayaks, for a gentler pace.",
      },
      {
        src: drupalImage("2024-09/research-in-the-forest.JPG.webp?itok=k1to0lSV"),
        alt: "The research station buildings seen through the coastal forest",
        caption: "The station, from the forest side.",
      },
      {
        src: drupalImage(
          "2024-09/Loading%20male%20mosquito%20release%20buckets%20onto%20cart.jpg.webp?itok=b5WrRQ4F",
        ),
        alt: "Buckets of male mosquitoes being loaded onto a cart for release",
        caption: "Release buckets going out for the mosquito program.",
      },
      {
        src: drupalImage("2024-09/rangers.png.webp?itok=rJdwl7nB"),
        alt: "Tetiaroa Society rangers heading out on a field mission",
        caption: "Rangers heading out.",
      },
      {
        src: drupalImage("2025-09/space%20for%20thinking.jpg.webp?itok=125Zdtot"),
        alt: "A quiet shaded workspace at the field station",
        caption: "A quiet place to write up the day's notes.",
      },
    ],

    atollEyebrow: "Where you'll be",
    atollTitle: "You are a guest on an inhabited island.",
    atollBody: [
      "The atoll sits 53 kilometres north of Tahiti and is made up of thirteen motus. The station is on Motu Onetahi, reachable by boat, by plane, or by helicopter.",
      "Tetiaroa was once a retreat for the Tahitian royal family, and it holds important archaeological sites — marae — that are under strict protection by the French Polynesian government. Researchers working here are expected to recognise the cultural, scientific, and educational significance of the place, and to behave accordingly.",
      "You will also be sharing the island with The Brando's guests and staff. Fieldwork gets planned around them.",
    ],
    atollNote:
      "Everyone using the station signs the Station Code of Conduct and Conditions of Use, along with the Internal Regulation of the Atoll of Tetiaroa, on arrival.",
    atollImage: {
      src: drupalImage("2025-09/station2.jpg.webp?itok=hjxTEpWO"),
      alt: "The entrance and covered walkway of the Bailey Field Station",
      caption: "Motu Onetahi, Tetiaroa Atoll.",
    },

    applyEyebrow: "Visiting researchers",
    applyTitle: "Apply, and reserve your dates.",
    applyIntro:
      "Any researcher starting a scientific project — or bringing a university class — works through the steps below. Applications are managed in RAMS, the system Tetiaroa Society shares with the University of California Natural Reserve System.",
    applyLeadTime:
      "Start early. The full process takes three to six months, and permits must be filed at least a month before you arrive.",
    steps: [
      {
        title: "Talk to the station manager",
        copy: "Before anything else, tell us what you want to do. The station manager will tell you which permits and authorisations your project actually needs, and whether the dates you have in mind are realistic.",
        detail: "Use the form at the bottom of this page.",
      },
      {
        title: "Submit an application in RAMS",
        copy: "Create a profile, select Tetiaroa Society Ecostation as your reserve, and complete the application with your project details, your team, the reserve-specific questions, and your funding.",
        detail:
          "Projects may be scientific, cultural, or educational, and must fit the mission of Tetiaroa Society. To be considered, a project needs the sponsorship of at least one member of the Scientific Advisory Board and must be fully funded — nothing is approved in anticipation of future funding.",
        action: {
          label: "Open the RAMS portal",
          href: RAMS_PORTAL_URL,
          external: true,
        },
      },
      {
        title: "Reserve your spot",
        copy: "Return to your submitted application in RAMS to make the reservation: statement of purpose, arrival and departure dates, participants, accommodation, transport, and the resources you need on which days.",
        detail:
          "You will review and agree to the station's waivers and policies as part of the reservation.",
      },
      {
        title: "Obtain your permits",
        copy: "Tetiaroa Society streamlines the permitting, but the deadlines are real: applications must be in at least one month before you arrive.",
        detail:
          "Non-EU citizens conducting research in French Polynesia need a convention d'accueil. Any work on genetic resources — DNA, RNA, or metabolic products of animal, plant, or microbial origin, commercial or not — needs a Commitment Act for a Prior Informed Consent Request from the Department of Environment.",
      },
      {
        title: "Send your completed forms",
        copy: "Download the required forms, fill them in, and return them — the protocole d'accueil, the attestation sur l'honneur, and anything else your permits require.",
        detail: "PDF only, one file at a time, 2 MB limit per file.",
      },
      {
        title: "Arrive",
        copy: "You will sign the Code of Conduct and the atoll's internal regulations on arrival, get your orientation, and start work.",
      },
    ],

    ratesTitle: "Rates and fees",
    ratesIntro:
      "Daily rates cover meals, lodging, lab use, and wifi. They also include shared use of the Tetiaroa Society boat, which for most users must be driven by a Society driver.",
    rates: [
      {
        audience: "International researchers",
        rate: "$165",
        unit: "per day",
        note: "Registration through Gump Station required.",
      },
      {
        audience: "French Polynesia-based researchers",
        rate: "$132",
        unit: "per day",
      },
      {
        audience: "Students in international field courses",
        rate: "$132",
        unit: "per day",
      },
      {
        audience: "Students in local field courses (UC Berkeley)",
        rate: "$110",
        unit: "per day",
      },
      {
        audience: "Boat transfer, Tahiti–Tetiaroa–Tahiti",
        rate: "$128",
        unit: "round trip",
      },
    ],
    ratesFootnotes: [
      "Boat use is shared with other researchers and depends on the availability of a Tetiaroa Society driver. If you need dedicated or extended boat time, or want to drive it yourself, arrange it well before your visit.",
      "Chemicals can be provided on request ahead of your arrival; large quantities may carry an additional fee.",
      "Domestic flights to the atoll are available at additional cost, subject to availability.",
    ],

    policyTitle: "One thing we ask in return",
    policyBody:
      "Tetiaroa Society is funded by people who are genuinely excited about what gets discovered here. So we ask you to work with our team before, during, and after your study, and to send a report when it's finished. What we share publicly includes:",
    policyItems: [
      "Project descriptions",
      "Information about the research team",
      "Information about the research subject",
      "Photographs from the field",
      "Study reports",
      "Published papers and results",
    ],
    policyNote:
      "There are also guests on the island who would like to hear about your work. Researchers may be asked to give one short presentation during their stay.",

    metadataTitle: "Bailey Field Station | Tetiaroa Society",
    metadataDescription:
      "Tetiaroa Society's LEED Platinum field station on Motu Onetahi: wet and dry labs, beds for eighteen, and direct access to reef, forest, brackish lakes, and deep ocean water. Application and reservation details for visiting researchers.",
  },
};

export type StationWork = {
  image: string;
  alt: string;
  title: string;
  copy: string;
};

export type StationStat = {
  value: string;
  label: string;
};

export type StationEngageRoute = {
  title: string;
  copy: string;
  href: string;
  cta: string;
  variant: "donate" | "default" | "outline";
};

export const stationsIndexCopy = {
  eyebrow: "Our Stations",
  title: "Science lives here",
  titleAccent: "because conservation is a residency, not an expedition",
  intro:
    "Researchers come and go. A season here, a field course there, a doctorate that runs three years. The station is the part that stays — beds, two labs and a boat tied up outside — so the work carries on between them. That continuity is why the rats are nearly gone and why the seabirds are coming back.",
  heroImage: siteFile("2024-09/ecostation-from-above.JPG"),
  heroImageAlt:
    "The Bailey Field Station seen from the air, set among the palms on Motu Onetahi",
  heroPrimaryCta: "See the work",
  heroDonateCta: "Fund the station",

  stats: [
    { value: "18", label: "beds that keep the work going year-round" },
    { value: "40 m²", label: "of lab, so samples never leave the atoll" },
    { value: "13", label: "motus within a morning's boat ride" },
    { value: "3", label: "water lines: fresh, reef and deep ocean" },
  ] satisfies StationStat[],

  listEyebrow: "The station",
  listTitle: "The Bailey Field Station, on Motu Onetahi",
  listIntro:
    "A resort built a laboratory and gave it away. Pacific Beachcomber constructed the station to LEED Platinum standards while it was building The Brando, then donated it to us. It sleeps 18 across five bedrooms, with a dry lab, a wet lab, boats and bikes, and reefs, brackish lakes and archaeological sites minutes from the door.",
  futureTitle: "One station, for now",
  futureCopy:
    "Tetiaroa is the proof of concept. A single well-run station on one atoll has changed what's possible across thirteen motus, and the same model would work on other atolls and coastlines across the Pacific. Building the next one starts with showing that the first one works. It does.",
  futureBadge: "In planning",
  openBadge: "Open to researchers",
  cardCta: "Go inside the station",

  workEyebrow: "What it enables",
  workTitle: "Every win here has an address.",
  workIntro:
    "None of the work below happened on a two-week visit. It happened because there's a place to sleep, a lab to work in, and a boat tied up outside. Here's what having a station on the atoll actually buys us.",
  work: [
    {
      image: siteFile("2024-09/P5030071-small.jpeg"),
      alt: "A brown booby standing over two eggs in a nest on the open ground",
      title: "Seabirds are coming back to the treated motus",
      copy: "Ground-nesting seabirds are the honest scorecard, and the numbers on the treated motus are climbing. You only know that because someone walks those beaches season after season, counting the same nests in the same places. That kind of record is a habit, and the station is what makes the habit possible.",
    },
    {
      image: siteFile("2024-09/research-in-the-forest.JPG"),
      alt: "The field station buildings standing among the island's coastal forest",
      title: "Rat eradication takes years, so we stay for years",
      copy: "The Tetiaroa Atoll Restoration Project has cleared rats from most of the atoll. Tiaraunu, Tauvini and Ahuroa still show signs, and another baiting round is coming. Eradication is won in the follow-up: the checking, the re-baiting, the unglamorous Tuesday in February. With beds and boats on site, we can keep showing up until the last motu is clean.",
    },
    {
      image: siteFile("2024-07/TCA%20baiting-sm.png"),
      alt: "A team carrying bait buckets through the forest to treat yellow crazy ants",
      title: "We caught the crazy ants early",
      copy: "Yellow crazy ants make the IUCN's hundred worst invasive species list. They spray formic acid that blinds seabird chicks in the nest. We treated the last known infestations through to May 2025 and we're monitoring now to confirm they're gone. Catching an outbreak that early takes eyes on the ground every month.",
    },
    {
      image: siteFile("2024-09/aquarium.jpg"),
      alt: "A juvenile green turtle swimming among staghorn coral in a laboratory tank",
      title: "Turtles are studied a few steps from the reef",
      copy: "The outdoor wet lab runs on three water lines — fresh, surface seawater and deep ocean — feeding tanks and seawater tables a short walk from the lagoon. Green turtle monitoring happens alongside Te Mana o te Moana, and it happens here on the atoll. An animal can be cared for and released into the same water it came from.",
    },
    {
      image: siteFile(
        "2024-07/2-%20Male%20mosquito%20release%202%20-%20Photo%20credit%20Denis%20PINSON%20Archipel%20Production.jpg",
      ),
      alt: "Three people releasing sterile male mosquitoes from buckets in the island forest",
      title: "A mosquito programme that needs a local partner",
      copy: "Institut Louis Malardé leads AeLIMIN+ for The Brando, releasing sterile male mosquitoes to suppress the Aedes species behind dengue and filariasis, mainly on Onetahi. We're a partner in that work. Programmes like it need people who live here, know the ground, and can turn up for release after release. That's the role a station plays.",
    },
    {
      image: siteFile("2021-09/IMG_2304_0.jpg"),
      alt: "A large group of students and Polynesian teachers holding woven palm baskets",
      title: "The teaching lab is where the next generation starts",
      copy: "The dry lab doubles as a classroom, and university field courses and school groups fill it. Students meet Polynesian teachers, handle real specimens, and stand on the reef they've been reading about. Tetiaroa's marae are protected under French Polynesian law and treated with the respect they're owed. Science and culture get taught here as one subject, because on this atoll they are.",
    },
  ] satisfies StationWork[],

  engageEyebrow: "Get involved",
  engageTitle: "Keep somebody on the atoll.",
  engageIntro:
    "The station runs on people, and people need funding, fuel and food. Whether you give, follow along, or come and work here yourself, you're helping keep the lights on in a building that a lot of vulnerable species depend on.",
  engage: [
    {
      title: "Give",
      copy: "Your gift pays for the things that make a permanent presence possible: boat fuel to reach the far motus, bait for the next eradication round, lab supplies, and salaries for the people who show up all year. It's the least glamorous budget in conservation and the most important.",
      href: "/donate",
      cta: "Donate now",
      variant: "donate",
    },
    {
      title: "Follow the work",
      copy: "We publish what's actually happening on the atoll: eradication updates, seabird counts, what the students found, what surprised us. No press releases, no polish. If you want to see what your support builds over months and years, this is the honest version.",
      href: "/impact",
      cta: "Read the impact feed",
      variant: "default",
    },
    {
      title: "Work here",
      copy: "The station is open to visiting researchers, with lab space, teaching space, sea access, and a community of people already doing the work. If your research belongs on a Pacific atoll, we'd like to hear from you. There's a full guide to facilities, access and how to apply.",
      href: "/stations/bailey-field-station#apply",
      cta: "For researchers",
      variant: "outline",
    },
  ] satisfies StationEngageRoute[],

  metadataTitle: "Our Stations | Tetiaroa Society",
  metadataDescription:
    "The Bailey Field Station is where scientists live and work on Tetiaroa. Beds, labs and boats on the atoll, all year — and the conservation results that only a permanent presence makes possible.",
};

export function isStationSlug(value: string): value is StationSlug {
  return (stationSlugs as readonly string[]).includes(value);
}

export function getStationPath(slug: StationSlug) {
  return `/stations/${slug}`;
}

export function getStationUrl(slug: StationSlug) {
  return `https://www.tetiaroasociety.org${getStationPath(slug)}`;
}

export function getStationsToolbarCopy(locale: HomeLocale): TopToolbarCopy {
  return {
    ...homeCopies[locale].toolbar,
    stationsHref: ENGLISH_STATIONS_PATH,
  };
}
