import { homeCopies, type HomeLocale } from "../home-copy";
import {
  ENGLISH_STATIONS_PATH,
  FRENCH_DONATE_PATH,
  FRENCH_STATIONS_PATH,
} from "../language-links";
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

const stationImage = (fileName: string) =>
  `/stations/bailey-field-station/${fileName}`;

export const RAMS_PORTAL_URL = "https://rams.ucnrs.org";

export const stations: Record<StationSlug, StationContent> = {
  "bailey-field-station": {
    status: "open",
    name: "Bailey Field Station",
    shortName: "Bailey Field Station",
    formerName: "the Ecostation",
    location: "Motu Onetahi, Tetiaroa Atoll",
    eyebrow: "Field Station 01 / Motu Onetahi",
    tagline: "Our eco-friendly lab surrounded by the nature it studies.",
    summary: "",
    cardSummary:
      "Tetiaroa Society's first field station: LEED Platinum, beds for eighteen, wet and dry labs, and a whole atoll for a study site.",
    heroImage: stationImage("aerial.webp"),
    heroImageAlt:
      "The Bailey Field Station seen from the air, set among palms on Motu Onetahi",
    cardImage: stationImage("entrance.webp"),
    cardImageAlt:
      "The entrance and covered walkway of the Bailey Field Station",
    facts: [
      { label: "Location", value: "Motu Onetahi" },
      { label: "Built to", value: "LEED Platinum" },
      { label: "Sleeps", value: "18" },
      { label: "Dry lab", value: "40 m²" },
      { label: "From Tahiti", value: "53 km" },
    ],

    originTitle: "Researchers from all over the world come here.",
    originLead: "",
    originBody: [
      "Marine biologists, ornithologists, entomologists, archaeologists and climate scientists apply for time at the Bailey Field Station every year, from institutions across the globe. Some stay a fortnight. Some come back season after season.",
      "While they're here, researchers live inside the Onetahi community — eating at the staff cantina, riding the same bike paths, running the wet lab at odd hours. The reef, the forest, the brackish lakes and the marae are all minutes from the bench.",
      "Projects can be scientific, cultural or educational. Applications are handled through RAMS, the system we share with the University of California Natural Reserve System, and the full process is set out further down this page.",
    ],
    originImage: {
      src: stationImage("buildings-under-canopy.webp"),
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
    galleryIntro: "",
    gallery: [
      {
        src: stationImage("dry-lab.webp"),
        alt: "Researchers at work in the station's dry lab",
        caption: "The dry lab, mid-project.",
      },
      {
        src: stationImage("aquarium-tanks.webp"),
        alt: "Three hundred litre aquarium tanks in the outdoor wet lab",
        caption: "300-litre tanks, fed by three separate water lines.",
      },
      {
        src: stationImage("bunk-room.webp"),
        alt: "A bunk room in the field station dormitory",
        caption: "One of five air-conditioned bedrooms.",
      },
      {
        src: stationImage("common-area.webp"),
        alt: "People gathered around a table in the station's common area",
        caption: "The common area, where teams plan the day.",
      },
      {
        src: stationImage("juvenile-turtle-care.webp"),
        alt: "A researcher caring for juvenile turtles in the laboratory",
        caption: "Juvenile honu under care in the lab.",
      },
      {
        src: stationImage("coral-restoration.webp"),
        alt: "Coral fragments growing on a restoration frame",
        caption: "Coral grown out for restoration trials.",
      },
      {
        src: stationImage("work-boat.webp"),
        alt: "The Tetiaroa Society work boat loaded and ready to leave",
        caption: "A Society boat to quickly get around.",
      },
      {
        src: stationImage("kayaks.webp"),
        alt: "Kayaks stored at the field station ready for use",
        caption: "Kayaks, for a gentler pace.",
      },
      {
        src: stationImage("forest-side.webp"),
        alt: "The research station buildings seen through the coastal forest",
        caption: "The station, from the forest side.",
      },
      {
        src: stationImage("mosquito-release-buckets.webp"),
        alt: "Buckets of male mosquitoes being loaded onto a cart for release",
        caption: "Release buckets going out for the mosquito program.",
      },
      {
        src: stationImage("rangers.webp"),
        alt: "Tetiaroa Society rangers heading out on a field mission",
        caption: "Rangers heading out.",
      },
      {
        src: stationImage("quiet-workspace.webp"),
        alt: "A quiet shaded workspace at the field station",
        caption: "A quiet place to write up the day's notes.",
      },
    ],

    atollEyebrow: "Where you'll be",
    atollTitle: "You're working on a royal retreat.",
    atollBody: [
      "Thirteen motus in a ring, 53 kilometres north of Tahiti, reachable by boat, plane or helicopter. Long before anyone thought to put a laboratory here, Tetiaroa was the private retreat of Tahitian royalty — and it still holds a particular place in the hearts of Tahitian people.",
      "Its marae sit among the palms a short walk from the lab: sacred sites, protected by the government of French Polynesia, and still very much alive in the stories told about them. You'll be working beside colleagues who grew up with those stories.",
      "You'll share the island with Tetiaroa Society staff, which mostly means meals at the cantina, the same bike paths, and the same lagoon at the end of a working day.",
    ],
    atollNote:
      "Onetahi, Tiaraunu, Tauvini, Ahuroa… every islet in the ring has a name, and most have a story attached. Ask the people you're working beside — they grew up with them.",
    atollImage: {
      src: stationImage("entrance.webp"),
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

export const stationsFr: typeof stations = {
  "bailey-field-station": {
    status: "open",
    name: "Bailey Field Station",
    shortName: "Station Bailey",
    formerName: "l'Ecostation",
    location: "Motu Onetahi, atoll de Tetiaroa",
    eyebrow: "Station de terrain 01 / Motu Onetahi",
    tagline: "Notre laboratoire écoresponsable, entouré de la nature qu'il étudie.",
    summary: "",
    cardSummary:
      "La première station de terrain de Tetiaroa Society : LEED Platinum, dix-huit couchages, laboratoires sec et humide, et un atoll entier comme terrain d'étude.",
    heroImage: stationImage("aerial.webp"),
    heroImageAlt:
      "La station Bailey vue du ciel, posée parmi les cocotiers du motu Onetahi",
    cardImage: stationImage("entrance.webp"),
    cardImageAlt: "L'entrée et la coursive couverte de la station Bailey",
    facts: [
      { label: "Emplacement", value: "Motu Onetahi" },
      { label: "Construite selon", value: "LEED Platinum" },
      { label: "Couchages", value: "18" },
      { label: "Labo sec", value: "40 m²" },
      { label: "Depuis Tahiti", value: "53 km" },
    ],

    originTitle: "Des chercheurs du monde entier viennent ici.",
    originLead: "",
    originBody: [
      "Biologistes marins, ornithologues, entomologistes, archéologues et climatologues déposent chaque année une candidature pour venir travailler à la station Bailey, depuis des institutions du monde entier. Certains restent quinze jours. D'autres reviennent saison après saison.",
      "Pendant leur séjour, les chercheurs vivent au sein de la communauté d'Onetahi : repas à la cantine du personnel, mêmes pistes cyclables, laboratoire humide à des heures improbables. Le récif, la forêt, les lacs saumâtres et les marae sont tous à quelques minutes de la paillasse.",
      "Les projets peuvent être scientifiques, culturels ou éducatifs. Les candidatures passent par RAMS, le système que nous partageons avec le University of California Natural Reserve System, et toute la procédure est détaillée plus bas sur cette page.",
    ],
    originImage: {
      src: stationImage("buildings-under-canopy.webp"),
      alt: "Les bâtiments de la station entourés d'une végétation dense",
      caption: "Les bâtiments s'installent sous la canopée existante.",
    },

    workEyebrow: "Le travail",
    workTitle: "Ce que l'on étudie ici.",
    workIntro:
      "La station est une base, pas un programme. Les projets qui la traversent appartiennent aux scientifiques en visite, aux équipes de Tetiaroa Society et aux étudiants — mais ils se regroupent autour des questions auxquelles cet atoll répond particulièrement bien.",
    workAreas: [
      {
        icon: WavesIcon,
        title: "Récif et lagon",
        copy: "État des coraux, essais de restauration, chimie de l'eau et réaction du lagon à la chaleur. Le récif commence à quelques mètres de la plage : une plongée de suivi tient dans une matinée.",
      },
      {
        icon: FishIcon,
        title: "Tortues et requins",
        copy: "La nidification des tortues vertes est suivie avec Te Mana o te Moana, et les tables à marée et aquariums de la station accueillent les animaux qui ont besoin de soins. Les motu de ponte comme la nurserie du lagon sont accessibles par le bateau de la Society.",
      },
      {
        icon: LeafIcon,
        title: "Forêt indigène et oiseaux marins",
        copy: "Le Tetiaroa Atoll Restoration Project : éradication des rats et de la fourmi folle jaune, suivi des colonies d'oiseaux marins avec Te Manu, et vigilance face à tout ce qui débarque avec la prochaine coque. La plupart des motu sont désormais sans rats ; les derniers font encore l'objet de campagnes.",
      },
      {
        icon: BugIcon,
        title: "Élimination des moustiques",
        copy: "Le programme AeLIMIN+, piloté par l'Institut Louis Malardé avec Tetiaroa Society à ses côtés, réduit les Aedes sur Onetahi par lâchers de mâles stériles. Il faut un laboratoire, un espace d'élevage et un lieu d'où organiser un lâcher, semaine après semaine.",
      },
      {
        icon: LandmarkIcon,
        title: "Archéologie et culture",
        copy: "Les marae et les sites d'habitat de Tetiaroa sont strictement protégés et toujours étudiés. Ici, la recherche culturelle est traitée comme une recherche à part entière, pas comme un décor.",
      },
      {
        icon: FlaskConicalIcon,
        title: "Systèmes de l'atoll",
        copy: "Lacs saumâtres, nappes phréatiques, sols et une conduite directe d'eau océanique profonde — la plomberie physique d'un atoll, disponible pour l'échantillonnage sur place.",
      },
      {
        icon: BookOpenIcon,
        title: "Stages de terrain",
        copy: "Les classes universitaires utilisent la salle d'enseignement du laboratoire sec et prennent l'atoll pour sujet. Les étudiants arrivent étudiants et repartent après avoir mené quelque chose qui leur appartient.",
      },
      {
        icon: CompassIcon,
        title: "Suivi à long terme",
        copy: "Les mêmes transects, les mêmes nids, la même eau, mesurés année après année. Les changements lents n'apparaissent que dans une série longue.",
      },
    ],

    facilitiesEyebrow: "Le bâtiment",
    facilitiesTitle: "De quoi travailler, dormir et manger.",
    facilitiesIntro:
      "Tout ce qui suit est sur place et partagé. Le matériel de plongée et le temps de bateau se réservent avant votre arrivée.",
    facilities: [
      {
        icon: BedDoubleIcon,
        title: "Hébergement",
        copy: "Aéré, confortable, et pensé pour des gens qui y ramèneront du sable.",
        items: [
          "Cinq chambres climatisées",
          "Jusqu'à 18 couchages pour scientifiques et personnel",
          "Espace commun avec kitchenette",
          "Bureau et espace de travail",
          "Wifi partout",
        ],
      },
      {
        icon: MicroscopeIcon,
        title: "Laboratoire sec",
        copy: "Quarante mètres carrés climatisés, aussi à l'aise pour une classe que pour une paillasse.",
        items: [
          "Salle d'enseignement",
          "Paillasse et espace de travail",
          "Équipement de laboratoire courant",
          "Produits chimiques sur demande, à organiser avant l'arrivée",
        ],
      },
      {
        icon: FlaskConicalIcon,
        title: "Laboratoire humide",
        copy: "En extérieur, alimenté par trois circuits, et la raison pour laquelle beaucoup de projets choisissent cette station.",
        items: [
          "Circuits d'eau douce, d'eau de mer de surface et d'eau océanique profonde",
          "Aquarium extérieur et bacs de 300 litres",
          "Tables à marée",
        ],
      },
      {
        icon: ShipIcon,
        title: "Sur l'eau",
        copy: "Partagé avec les autres chercheurs et avec les programmes de terrain de la Society.",
        items: [
          "Bateau de Tetiaroa Society, en principe piloté par un pilote de la Society",
          "Kayaks",
          "Matériel de plongée, réservation préalable obligatoire",
          "Accès direct au récif, au lagon et au large",
        ],
      },
      {
        icon: UtensilsIcon,
        title: "Repas",
        copy: "Servis à la cantine du personnel de The Brando, à quelques minutes à pied ou à vélo.",
        items: [
          "Trois repas par jour, compris dans le tarif journalier",
          "Pris avec la communauté du personnel de l'île",
        ],
      },
      {
        icon: BikeIcon,
        title: "Se déplacer sur Onetahi",
        copy: "Le motu est petit et aménagé pour le vélo : c'est ainsi que tout le monde circule.",
        items: [
          "Vélos à disposition de tous les usagers de la station",
          "Chariots pour transporter le matériel",
          "Pistes cyclables bien revêtues à travers l'îlot",
        ],
      },
    ],

    galleryTitle: "La station, en service.",
    galleryIntro: "",
    gallery: [
      {
        src: stationImage("dry-lab.webp"),
        alt: "Des chercheurs au travail dans le laboratoire sec de la station",
        caption: "Le laboratoire sec, en pleine étude.",
      },
      {
        src: stationImage("aquarium-tanks.webp"),
        alt: "Des bacs de trois cents litres dans le laboratoire humide extérieur",
        caption: "Des bacs de 300 litres, alimentés par trois circuits distincts.",
      },
      {
        src: stationImage("bunk-room.webp"),
        alt: "Une chambre à lits superposés dans le dortoir de la station",
        caption: "L'une des cinq chambres climatisées.",
      },
      {
        src: stationImage("common-area.webp"),
        alt: "Des personnes réunies autour d'une table dans l'espace commun",
        caption: "L'espace commun, où les équipes préparent la journée.",
      },
      {
        src: stationImage("juvenile-turtle-care.webp"),
        alt: "Une chercheuse s'occupant de jeunes tortues au laboratoire",
        caption: "De jeunes honu soignés au laboratoire.",
      },
      {
        src: stationImage("coral-restoration.webp"),
        alt: "Des fragments de corail poussant sur une structure de restauration",
        caption: "Du corail cultivé pour les essais de restauration.",
      },
      {
        src: stationImage("work-boat.webp"),
        alt: "Le bateau de travail de Tetiaroa Society, chargé et prêt à partir",
        caption: "Un bateau de la Society pour se déplacer vite.",
      },
      {
        src: stationImage("kayaks.webp"),
        alt: "Des kayaks rangés à la station, prêts à l'usage",
        caption: "Les kayaks, pour une allure plus douce.",
      },
      {
        src: stationImage("forest-side.webp"),
        alt: "Les bâtiments de la station vus à travers la forêt littorale",
        caption: "La station, côté forêt.",
      },
      {
        src: stationImage("mosquito-release-buckets.webp"),
        alt: "Des seaux de moustiques mâles chargés sur un chariot pour un lâcher",
        caption: "Les seaux de lâcher partent pour le programme moustiques.",
      },
      {
        src: stationImage("rangers.webp"),
        alt: "Des rangers de Tetiaroa Society partant en mission de terrain",
        caption: "Les rangers partent en mission.",
      },
      {
        src: stationImage("quiet-workspace.webp"),
        alt: "Un espace de travail calme et ombragé à la station",
        caption: "Un coin tranquille pour rédiger les notes du jour.",
      },
    ],

    atollEyebrow: "Où vous serez",
    atollTitle: "Vous travaillez sur une retraite royale.",
    atollBody: [
      "Treize motu en anneau, à 53 kilomètres au nord de Tahiti, accessibles par bateau, avion ou hélicoptère. Bien avant que quiconque songe à y installer un laboratoire, Tetiaroa était la retraite privée de la royauté tahitienne — et l'atoll garde une place à part dans le cœur des Tahitiens.",
      "Ses marae se trouvent parmi les cocotiers, à quelques minutes du laboratoire : des sites sacrés, protégés par le gouvernement de la Polynésie française, et bien vivants dans les récits qu'on en fait. Vous travaillerez aux côtés de collègues qui ont grandi avec ces histoires.",
      "Vous partagerez l'île avec les équipes de Tetiaroa Society, ce qui veut surtout dire des repas à la cantine, les mêmes pistes cyclables et le même lagon en fin de journée.",
    ],
    atollNote:
      "Onetahi, Tiaraunu, Tauvini, Ahuroa… chaque îlot de l'anneau porte un nom, et la plupart ont une histoire. Demandez à celles et ceux avec qui vous travaillez : ils ont grandi avec.",
    atollImage: {
      src: stationImage("entrance.webp"),
      alt: "L'entrée et la coursive couverte de la station Bailey",
      caption: "Motu Onetahi, atoll de Tetiaroa.",
    },

    applyEyebrow: "Chercheurs en visite",
    applyTitle: "Candidater et réserver vos dates.",
    applyIntro:
      "Tout chercheur qui lance un projet scientifique — ou qui amène une classe universitaire — suit les étapes ci-dessous. Les candidatures sont gérées dans RAMS, le système que Tetiaroa Society partage avec le University of California Natural Reserve System.",
    applyLeadTime:
      "Prenez de l'avance. La procédure complète demande trois à six mois, et les permis doivent être déposés au moins un mois avant votre arrivée.",
    steps: [
      {
        title: "Écrire au responsable de la station",
        copy: "Avant tout, dites-nous ce que vous voulez faire. Le responsable de la station vous indiquera les permis et autorisations dont votre projet a réellement besoin, et si les dates que vous envisagez sont réalistes.",
        detail: "Utilisez le formulaire en bas de cette page.",
      },
      {
        title: "Déposer une candidature dans RAMS",
        copy: "Créez un profil, sélectionnez Tetiaroa Society Ecostation comme réserve, puis complétez le dossier : détails du projet, équipe, questions propres à la réserve et financement.",
        detail:
          "Les projets peuvent être scientifiques, culturels ou éducatifs, et doivent servir la mission de Tetiaroa Society. Pour être examiné, un projet doit être parrainé par au moins un membre du Conseil scientifique et être intégralement financé — rien n'est approuvé dans l'attente d'un financement futur.",
        action: {
          label: "Ouvrir le portail RAMS",
          href: RAMS_PORTAL_URL,
          external: true,
        },
      },
      {
        title: "Réserver votre place",
        copy: "Revenez sur votre candidature déposée dans RAMS pour effectuer la réservation : note d'intention, dates d'arrivée et de départ, participants, hébergement, transport et ressources nécessaires selon les jours.",
        detail:
          "Vous prendrez connaissance des décharges et des règles de la station, et les accepterez au moment de la réservation.",
      },
      {
        title: "Obtenir vos permis",
        copy: "Tetiaroa Society simplifie les démarches, mais les délais sont réels : les dossiers doivent être déposés au moins un mois avant votre arrivée.",
        detail:
          "Les ressortissants hors Union européenne menant des recherches en Polynésie française ont besoin d'une convention d'accueil. Tout travail sur les ressources génétiques — ADN, ARN ou produits métaboliques d'origine animale, végétale ou microbienne, à but commercial ou non — nécessite un Acte d'engagement pour une demande de consentement préalable donné en connaissance de cause auprès de la Direction de l'environnement.",
      },
      {
        title: "Envoyer vos formulaires complétés",
        copy: "Téléchargez les formulaires requis, remplissez-les et renvoyez-les — le protocole d'accueil, l'attestation sur l'honneur et tout autre document exigé par vos permis.",
        detail: "PDF uniquement, un fichier à la fois, 2 Mo maximum par fichier.",
      },
      {
        title: "Arriver",
        copy: "Vous signerez à votre arrivée le Code de conduite et le règlement intérieur de l'atoll, recevrez votre briefing, et commencerez le travail.",
      },
    ],

    ratesTitle: "Tarifs et frais",
    ratesIntro:
      "Les tarifs journaliers couvrent les repas, l'hébergement, l'usage du laboratoire et le wifi. Ils comprennent aussi l'usage partagé du bateau de Tetiaroa Society, qui pour la plupart des usagers doit être piloté par un pilote de la Society.",
    rates: [
      {
        audience: "Chercheurs internationaux",
        rate: "165 $",
        unit: "par jour",
        note: "Inscription via la Gump Station obligatoire.",
      },
      {
        audience: "Chercheurs basés en Polynésie française",
        rate: "132 $",
        unit: "par jour",
      },
      {
        audience: "Étudiants en stage de terrain international",
        rate: "132 $",
        unit: "par jour",
      },
      {
        audience: "Étudiants en stage de terrain local (UC Berkeley)",
        rate: "110 $",
        unit: "par jour",
      },
      {
        audience: "Transfert en bateau, Tahiti–Tetiaroa–Tahiti",
        rate: "128 $",
        unit: "aller-retour",
      },
    ],
    ratesFootnotes: [
      "Le bateau est partagé avec les autres chercheurs et dépend de la disponibilité d'un pilote de Tetiaroa Society. Si vous avez besoin d'un bateau dédié ou pour une durée prolongée, ou si vous souhaitez le piloter vous-même, organisez-le bien avant votre venue.",
      "Des produits chimiques peuvent être fournis sur demande avant votre arrivée ; les grandes quantités peuvent entraîner des frais supplémentaires.",
      "Des vols intérieurs vers l'atoll sont possibles moyennant un coût supplémentaire, sous réserve de disponibilité.",
    ],

    policyTitle: "Une chose que nous demandons en retour",
    policyBody:
      "Tetiaroa Society est financée par des personnes sincèrement enthousiasmées par ce que l'on découvre ici. Nous vous demandons donc de travailler avec notre équipe avant, pendant et après votre étude, et de nous envoyer un rapport une fois celle-ci terminée. Voici ce que nous partageons publiquement :",
    policyItems: [
      "Les descriptions de projet",
      "Des informations sur l'équipe de recherche",
      "Des informations sur le sujet de recherche",
      "Des photographies de terrain",
      "Les rapports d'étude",
      "Les articles publiés et leurs résultats",
    ],
    policyNote:
      "Des visiteurs séjournent aussi sur l'île et aimeraient entendre parler de votre travail. Il pourra être demandé aux chercheurs de donner une courte présentation pendant leur séjour.",

    metadataTitle: "Bailey Field Station | Tetiaroa Society",
    metadataDescription:
      "La station de terrain LEED Platinum de Tetiaroa Society sur le motu Onetahi : laboratoires sec et humide, dix-huit couchages et un accès direct au récif, à la forêt, aux lacs saumâtres et à l'eau océanique profonde. Candidature et réservation pour les chercheurs en visite.",
  },
};

export const stationsByLocale = {
  en: stations,
  fr: stationsFr,
} satisfies Record<HomeLocale, typeof stations>;


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
  titleAccent: "The Bailey Field Station gives our research a home.",
  intro:
    "",
  heroImage: stationImage("aerial.webp"),
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

  stationCard: {
    location: "Motu Onetahi, Tetiaroa Atoll",
    summary:
      "Tetiaroa Society's first field station: LEED Platinum, beds for eighteen, wet and dry labs, and a whole atoll for a study site.",
    imageAlt: "The entrance and covered walkway of the Bailey Field Station",
  },
  futureTitle: "Station 02",
  futureCopy: "Still on the drawing board.",
  futureBadge: "Under construction",
  openBadge: "Open to researchers",
  cardCta: "Go inside the station",

  workEyebrow: "Why stations matter",
  workTitle: "Our Field Stations serve as a base for our conservation efforts.",
  workIntro:"",
  work: [
    {
      image: stationImage("seabird-nest.jpeg"),
      alt: "A brown booby standing over two eggs in a nest on the open ground",
      title: "Seabirds are coming back to the treated motus",
      copy: "Ground-nesting seabirds are the honest scorecard, and the numbers on the treated motus are climbing. You only know that because someone walks those beaches season after season, counting the same nests in the same places. That kind of record is a habit, and the station is what makes the habit possible.",
    },
    {
      image: stationImage("forest-side.webp"),
      alt: "The field station buildings standing among the island's coastal forest",
      title: "Rat eradication takes years, so we stay for years",
      copy: "The Tetiaroa Atoll Restoration Project has cleared rats from most of the atoll. Tiaraunu, Tauvini and Ahuroa still show signs, and another baiting round is coming. Eradication is won in the follow-up: the checking, the re-baiting, the unglamorous Tuesday in February. With beds and boats on site, we can keep showing up until the last motu is clean.",
    },
    {
      image: stationImage("crazy-ant-baiting.png"),
      alt: "A team carrying bait buckets through the forest to treat yellow crazy ants",
      title: "We caught the crazy ants early",
      copy: "Yellow crazy ants make the IUCN's hundred worst invasive species list. They spray formic acid that blinds seabird chicks in the nest. We treated the last known infestations through to May 2025 and we're monitoring now to confirm they're gone. Catching an outbreak that early takes eyes on the ground every month.",
    },
    {
      image: stationImage("juvenile-turtle-care.webp"),
      alt: "A juvenile green turtle swimming among staghorn coral in a laboratory tank",
      title: "Turtles are studied a few steps from the reef",
      copy: "The outdoor wet lab runs on three water lines — fresh, surface seawater and deep ocean — feeding tanks and seawater tables a short walk from the lagoon. Green turtle monitoring happens alongside Te Mana o te Moana, and it happens here on the atoll. An animal can be cared for and released into the same water it came from.",
    },
    {
      image: stationImage("sterile-mosquito-release.jpg"),
      alt: "Three people releasing sterile male mosquitoes from buckets in the island forest",
      title: "A mosquito programme that needs a local partner",
      copy: "Institut Louis Malardé leads AeLIMIN+ for The Brando, releasing sterile male mosquitoes to suppress the Aedes species behind dengue and filariasis, mainly on Onetahi. We're a partner in that work. Programmes like it need people who live here, know the ground, and can turn up for release after release. That's the role a station plays.",
    },
    {
      image: stationImage("student-field-course.jpg"),
      alt: "A large group of students and Polynesian teachers holding woven palm baskets",
      title: "The teaching lab is where the next generation starts",
      copy: "The dry lab doubles as a classroom, and university field courses and school groups fill it. Students meet Polynesian teachers, handle real specimens, and stand on the reef they've been reading about. Tetiaroa's marae are protected under French Polynesian law and treated with the respect they're owed. Science and culture get taught here as one subject, because on this atoll they are.",
    },
  ] satisfies StationWork[],

  engageEyebrow: "Get involved",
  engageTitle: "Help keep the lights on.",
  engageIntro:
    "The station runs on people, and people need funding, fuel and food. Whether you give, follow along, or come and work here yourself, you're helping to protect vulnerable species.",
  engage: [
    {
      title: "Give",
      copy: "Your gift pays for the things that make a permanent presence possible: boat fuel, lab supplies, and salaries for the people who show up all year.",
      href: "/donate",
      cta: "Donate now",
      variant: "donate",
    },
    {
      title: "Follow the work",
      copy: "We publish what's actually happening on the atoll: eradication updates, seabird counts, what the students found, what surprised us.",
      href: "/impact",
      cta: "Read the impact feed",
      variant: "default",
    },
    {
      title: "Work here",
      copy: "The station is open to visiting researchers. There's a full guide to facilities, equipment, and how to apply.",
      href: "/stations/bailey-field-station#apply",
      cta: "For researchers",
      variant: "outline",
    },
  ] satisfies StationEngageRoute[],

  metadataTitle: "Our Stations | Tetiaroa Society",
  metadataDescription:
    "The Bailey Field Station is where scientists live and work on Tetiaroa. Beds, labs and boats on the atoll, all year — and the conservation results that only a permanent presence makes possible.",
};

export const stationsIndexCopyFr: typeof stationsIndexCopy = {
  eyebrow: "Nos stations",
  title: "La science vit ici",
  titleAccent: "La station Bailey donne un foyer à nos recherches.",
  intro: "",
  heroImage: stationImage("aerial.webp"),
  heroImageAlt:
    "La station Bailey vue du ciel, posée parmi les cocotiers du motu Onetahi",
  heroPrimaryCta: "Voir le travail",
  heroDonateCta: "Soutenir la station",

  stats: [
    { value: "18", label: "lits qui font vivre le travail toute l'année" },
    {
      value: "40 m²",
      label: "de laboratoire : les échantillons ne quittent pas l'atoll",
    },
    { value: "13", label: "motu à une matinée de bateau" },
    { value: "3", label: "circuits d'eau : douce, lagon et océan profond" },
  ],

  stationCard: {
    location: "Motu Onetahi, atoll de Tetiaroa",
    summary:
      "La première station de terrain de Tetiaroa Society : LEED Platinum, dix-huit couchages, laboratoires sec et humide, et un atoll entier comme terrain d'étude.",
    imageAlt: "L'entrée et la coursive couverte de la station Bailey",
  },
  futureTitle: "Station 02",
  futureCopy: "Encore sur la planche à dessin.",
  futureBadge: "En construction",
  openBadge: "Ouverte aux chercheurs",
  cardCta: "Entrer dans la station",

  workEyebrow: "Pourquoi les stations comptent",
  workTitle:
    "Nos stations de terrain servent de base à nos actions de conservation.",
  workIntro: "",
  work: [
    {
      image: stationImage("seabird-nest.jpeg"),
      alt: "Un fou brun veillant sur deux œufs dans un nid à même le sol",
      title: "Les oiseaux marins reviennent sur les motu traités",
      copy: "Les oiseaux qui nichent au sol sont le vrai baromètre, et leur nombre augmente sur les motu traités. On ne le sait que parce que quelqu'un parcourt ces plages saison après saison et compte les mêmes nids aux mêmes endroits. Ce relevé tient de l'habitude, et c'est la station qui rend cette habitude possible.",
    },
    {
      image: stationImage("forest-side.webp"),
      alt: "Les bâtiments de la station parmi la forêt littorale de l'île",
      title: "Éradiquer les rats prend des années, alors nous restons des années",
      copy: "Le Tetiaroa Atoll Restoration Project a débarrassé la majeure partie de l'atoll de ses rats. Tiaraunu, Tauvini et Ahuroa montrent encore des signes de présence, et une nouvelle campagne d'appâtage est prévue. Une éradication se gagne dans le suivi : les contrôles, le réappâtage, le mardi sans gloire de février. Avec des lits et des bateaux sur place, nous pouvons revenir jusqu'au dernier motu.",
    },
    {
      image: stationImage("crazy-ant-baiting.png"),
      alt: "Une équipe transportant des seaux d'appâts en forêt contre la fourmi folle jaune",
      title: "Nous avons pris les fourmis folles de vitesse",
      copy: "La fourmi folle jaune figure parmi les cent pires espèces envahissantes selon l'UICN. Elle projette un acide formique qui aveugle les poussins d'oiseaux marins au nid. Nous avons traité les derniers foyers connus jusqu'en mai 2025 et nous surveillons désormais pour confirmer leur disparition. Repérer un foyer aussi tôt suppose des yeux sur le terrain tous les mois.",
    },
    {
      image: stationImage("juvenile-turtle-care.webp"),
      alt: "Une jeune tortue verte nageant parmi les coraux dans un bac du laboratoire",
      title: "Les tortues sont étudiées à quelques pas du récif",
      copy: "Le laboratoire humide extérieur est alimenté par trois circuits — eau douce, eau de surface et eau océanique profonde — qui nourrissent les bacs et les tables à marée à quelques pas du lagon. Le suivi des tortues vertes se fait avec Te Mana o te Moana, et il se fait ici, sur l'atoll. Un animal peut être soigné puis relâché dans l'eau d'où il vient.",
    },
    {
      image: stationImage("sterile-mosquito-release.jpg"),
      alt: "Trois personnes relâchant des moustiques mâles stériles en forêt",
      title: "Un programme moustiques qui a besoin d'un partenaire sur place",
      copy: "L'Institut Louis Malardé pilote AeLIMIN+ pour le compte de The Brando, en relâchant des mâles stériles pour réduire les Aedes responsables de la dengue et de la filariose, principalement sur Onetahi. Nous sommes partenaires de ce travail. Un tel programme exige des gens qui vivent ici, connaissent le terrain et sont présents lâcher après lâcher. C'est exactement le rôle d'une station.",
    },
    {
      image: stationImage("student-field-course.jpg"),
      alt: "Un groupe d'élèves et d'enseignants polynésiens tenant des paniers tressés",
      title: "Le laboratoire pédagogique, là où commence la relève",
      copy: "Le laboratoire sec sert aussi de salle de classe, et les stages universitaires comme les groupes scolaires la remplissent. Les élèves rencontrent des enseignants polynésiens, manipulent de vrais spécimens et posent le pied sur le récif qu'ils étudiaient sur le papier. Les marae de Tetiaroa sont protégés par la loi polynésienne et traités avec le respect qui leur est dû. Ici, science et culture s'enseignent ensemble, parce que sur cet atoll elles ne font qu'un.",
    },
  ],

  engageEyebrow: "S'impliquer",
  engageTitle: "Aidez-nous à garder la lumière allumée.",
  engageIntro:
    "La station repose sur des personnes, et ces personnes ont besoin de financement, de carburant et de repas. Que vous donniez, que vous suiviez le travail ou que vous veniez y travailler, vous contribuez à protéger des espèces fragiles.",
  engage: [
    {
      title: "Donner",
      copy: "Votre don paie ce qui rend une présence permanente possible : le carburant des bateaux, le matériel de laboratoire et les salaires de celles et ceux qui sont là toute l'année.",
      href: FRENCH_DONATE_PATH,
      cta: "Faire un don",
      variant: "donate",
    },
    {
      title: "Suivre le travail",
      copy: "Nous publions ce qui se passe réellement sur l'atoll : avancement des éradications, comptages d'oiseaux, découvertes des étudiants, surprises du terrain.",
      href: "/fr/impact",
      cta: "Lire le fil d'impact",
      variant: "default",
    },
    {
      title: "Venir y travailler",
      copy: "La station accueille les chercheurs en visite. Un guide complet détaille les installations, l'équipement et la candidature.",
      href: "/fr/stations/bailey-field-station#apply",
      cta: "Pour les chercheurs",
      variant: "outline",
    },
  ],

  metadataTitle: "Nos stations | Tetiaroa Society",
  metadataDescription:
    "La station Bailey est le lieu où les scientifiques vivent et travaillent à Tetiaroa. Des lits, des laboratoires et des bateaux sur l'atoll, toute l'année — et les résultats de conservation qu'une présence permanente rend possibles.",
};

export const stationsIndexCopies = {
  en: stationsIndexCopy,
  fr: stationsIndexCopyFr,
} satisfies Record<HomeLocale, typeof stationsIndexCopy>;

/** Chrome on the station detail page that isn't part of the station record. */
export const stationUiCopy = {
  en: {
    backToStations: "Our Stations",
    applyCta: "Apply to visit",
    facilitiesCta: "Facilities",
    arrivalNoteTitle: "Thirteen motus, thirteen names",
    leadTimeTitle: "Plan on a long runway",
    stepLabel: "Step",
  },
  fr: {
    backToStations: "Nos stations",
    applyCta: "Candidater pour venir",
    facilitiesCta: "Installations",
    arrivalNoteTitle: "Treize motu, treize noms",
    leadTimeTitle: "Prévoyez large",
    stepLabel: "Étape",
  },
} satisfies Record<HomeLocale, Record<string, string>>;


export function isStationSlug(value: string): value is StationSlug {
  return (stationSlugs as readonly string[]).includes(value);
}

export function getStationPath(slug: StationSlug, locale: HomeLocale = "en") {
  return locale === "fr" ? `/fr/stations/${slug}` : `/stations/${slug}`;
}

export function getStationUrl(slug: StationSlug, locale: HomeLocale = "en") {
  return `https://www.tetiaroasociety.org${getStationPath(slug, locale)}`;
}

export function getStationsToolbarCopy(locale: HomeLocale): TopToolbarCopy {
  return {
    ...homeCopies[locale].toolbar,
    stationsHref:
      locale === "fr" ? FRENCH_STATIONS_PATH : ENGLISH_STATIONS_PATH,
    languageHref:
      locale === "fr" ? ENGLISH_STATIONS_PATH : FRENCH_STATIONS_PATH,
    languageLabel: locale === "fr" ? "EN" : "FR",
    languageHrefLang: locale === "fr" ? "en" : "fr",
    languageLang: locale === "fr" ? "en" : "fr",
    languageAriaLabel:
      locale === "fr" ? "Read in English" : "Lire en français",
  };
}
