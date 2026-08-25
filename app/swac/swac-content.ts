// ---------------------------------------------------------------------------
// TODO(verify): confirm with Tetiaroa Society / The Brando before launch.
// The figures below are conservative estimates drawn from public reporting on
// the atoll's SWAC plant and from general SWAC engineering literature. They are
// NOT measured site data. Anything marked (estimate) should be replaced with
// operator-supplied numbers, and the copy hedges accordingly until it is.
//
//   intakeDepthMetres    ~900 m   widely reported, high confidence
//   intakeWaterCelsius   ~4-6 C   consistent with global deep-water profiles
//   commissionedYear     2013     widely reported, high confidence
//   plantCoolingKw       2500 kW  (estimate) resort-scale, needs confirmation
//   pipeLengthMetres     2400 m   (estimate) needs confirmation
// ---------------------------------------------------------------------------

export type SwacLocale = "en" | "fr";

const ENGLISH_SWAC_PATH = "/island/swac";
const FRENCH_SWAC_PATH = "/fr/island/swac";
const ENGLISH_SWAC_URL = "https://www.tetiaroasociety.org/island/swac";
const FRENCH_SWAC_URL = "https://www.tetiaroasociety.org/fr/island/swac";

export const diveStopIds = [
  "surface",
  "reef",
  "twilight",
  "thermocline",
  "intake",
] as const;

export type DiveStopId = (typeof diveStopIds)[number];

export const basicStepIds = [
  "intake",
  "exchange",
  "distribute",
  "return",
] as const;

export type BasicStepId = (typeof basicStepIds)[number];

export type BasicStep = {
  id: BasicStepId;
  number: string;
  title: string;
  body: string;
};

export const loopNodeIds = [
  "intake",
  "exchanger",
  "freshLoop",
  "buildings",
  "ecostation",
  "discharge",
] as const;

export type LoopNodeId = (typeof loopNodeIds)[number];

export type SiteStatus = "operating" | "freshwater" | "candidate" | "stalled";

export type DiveStop = {
  id: DiveStopId;
  depth: number;
  eyebrow: string;
  title: string;
  body: string;
  readout: string;
};

export type LoopNode = {
  id: LoopNodeId;
  /** Percentage coordinates on the schematic viewBox. */
  x: number;
  y: number;
  label: string;
  title: string;
  body: string;
  spec: string;
};

export type LedgerPreset = {
  id: string;
  label: string;
  /** Cooling load in kilowatts of heat removed. */
  kw: number;
};

export type FeasibilitySite = {
  id: string;
  name: string;
  region: string;
  lat: number;
  lon: number;
  status: SiteStatus;
  note: string;
};

// ---------------------------------------------------------------------------
// Physics. Kept pure so the dive HUD, the SVG fallback and the tests all agree.
// ---------------------------------------------------------------------------

export const MAX_DIVE_DEPTH = 950;
export const INTAKE_DEPTH = 900;
export const THERMOCLINE_TOP = 60;
export const THERMOCLINE_BASE = 400;

const SURFACE_CELSIUS = 28.5;
const THERMOCLINE_BASE_CELSIUS = 9;
const ABYSSAL_CELSIUS = 4.4;

/**
 * Piecewise tropical Pacific temperature profile: a warm mixed layer, a sharp
 * thermocline, then a slow cold tail. Shaped to match published South Pacific
 * CTD casts closely enough to be honest at the resolution a reader perceives.
 */
export function temperatureAtDepth(depth: number): number {
  const d = clampNumber(depth, 0, MAX_DIVE_DEPTH);

  if (d <= THERMOCLINE_TOP) {
    return SURFACE_CELSIUS;
  }

  if (d <= THERMOCLINE_BASE) {
    const t = (d - THERMOCLINE_TOP) / (THERMOCLINE_BASE - THERMOCLINE_TOP);
    // Ease-out so the steepest drop sits at the top of the thermocline.
    const eased = 1 - Math.pow(1 - t, 1.9);
    return SURFACE_CELSIUS - eased * (SURFACE_CELSIUS - THERMOCLINE_BASE_CELSIUS);
  }

  const t = (d - THERMOCLINE_BASE) / (MAX_DIVE_DEPTH - THERMOCLINE_BASE);
  return (
    THERMOCLINE_BASE_CELSIUS - t * (THERMOCLINE_BASE_CELSIUS - ABYSSAL_CELSIUS)
  );
}

/** Absolute pressure in bar. One atmosphere at the surface, one more per 10 m. */
export function pressureAtDepth(depth: number): number {
  return 1 + clampNumber(depth, 0, MAX_DIVE_DEPTH) / 10;
}

/**
 * Downwelling irradiance as a fraction of surface light, Beer-Lambert with an
 * attenuation coefficient for clear oligotrophic water.
 */
export function lightAtDepth(depth: number): number {
  return Math.exp(-0.045 * clampNumber(depth, 0, MAX_DIVE_DEPTH));
}

// ---------------------------------------------------------------------------
// Energy ledger. Every coefficient is named and sourced so it can be corrected
// without archaeology.
// ---------------------------------------------------------------------------

/** Seasonal coefficient of performance, air-cooled chiller in the tropics. */
export const CONVENTIONAL_COP = 3;
/** SWAC has no refrigeration cycle; this is pumping and distribution only. */
export const SWAC_COP = 20;
/** Equivalent full-load cooling hours per year at this latitude. */
export const ANNUAL_COOLING_HOURS = 4500;
/** Island diesel gensets deliver roughly this much electricity per litre. */
export const KWH_PER_LITRE_DIESEL = 3.6;
/** Combustion emissions of one litre of diesel. */
export const KG_CO2_PER_LITRE_DIESEL = 2.68;
/** A standard drum, used because barrels land where kilowatt-hours do not. */
export const LITRES_PER_DRUM = 200;

export type LedgerResult = {
  conventionalKwh: number;
  swacKwh: number;
  savedKwh: number;
  litresDiesel: number;
  drums: number;
  tonnesCo2: number;
  reductionPercent: number;
};

export function calculateLedger(coolingKw: number): LedgerResult {
  const kw = Math.max(0, coolingKw);
  const conventionalKwh = (kw / CONVENTIONAL_COP) * ANNUAL_COOLING_HOURS;
  const swacKwh = (kw / SWAC_COP) * ANNUAL_COOLING_HOURS;
  const savedKwh = conventionalKwh - swacKwh;
  const litresDiesel = savedKwh / KWH_PER_LITRE_DIESEL;

  return {
    conventionalKwh,
    swacKwh,
    savedKwh,
    litresDiesel,
    drums: litresDiesel / LITRES_PER_DRUM,
    tonnesCo2: (litresDiesel * KG_CO2_PER_LITRE_DIESEL) / 1000,
    reductionPercent:
      conventionalKwh === 0 ? 0 : (savedKwh / conventionalKwh) * 100,
  };
}

// ---------------------------------------------------------------------------
// Feasibility. Deliberately coarse: this exists to make the tradeoff intuitive,
// not to underwrite a project. The copy says so out loud.
// ---------------------------------------------------------------------------

/** Marine pipeline, laid and anchored, per kilometre. (estimate) */
export const PIPELINE_COST_PER_KM = 2_000_000;
/** Onshore heat-exchange plant and distribution, per kilowatt of cooling. */
export const PLANT_COST_PER_KW = 1_200;

export type FeasibilityVerdict = "strong" | "plausible" | "marginal" | "unlikely";

export type FeasibilityResult = {
  capitalCost: number;
  annualSavings: number;
  paybackYears: number;
  verdict: FeasibilityVerdict;
};

export function calculateFeasibility(
  distanceKm: number,
  coolingKw: number,
  pricePerKwh: number,
): FeasibilityResult {
  const distance = Math.max(0, distanceKm);
  const kw = Math.max(0, coolingKw);
  const price = Math.max(0, pricePerKwh);

  const capitalCost =
    distance * PIPELINE_COST_PER_KM + kw * PLANT_COST_PER_KW;
  const annualSavings = calculateLedger(kw).savedKwh * price;
  const paybackYears =
    annualSavings <= 0 ? Number.POSITIVE_INFINITY : capitalCost / annualSavings;

  return {
    capitalCost,
    annualSavings,
    paybackYears,
    verdict: gradePayback(paybackYears),
  };
}

export function gradePayback(paybackYears: number): FeasibilityVerdict {
  if (!Number.isFinite(paybackYears)) {
    return "unlikely";
  }
  if (paybackYears < 8) {
    return "strong";
  }
  if (paybackYears < 15) {
    return "plausible";
  }
  if (paybackYears < 25) {
    return "marginal";
  }
  return "unlikely";
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

export function clampNumber(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

export function clampStopIndex(
  index: number,
  length: number = diveStopIds.length,
) {
  if (length <= 0) {
    return 0;
  }
  if (Number.isNaN(index)) {
    return 0;
  }
  return Math.min(length - 1, Math.max(0, Math.round(index)));
}

export function getMissingStopIds(
  source: ReadonlyArray<{ id: string }>,
  target: ReadonlyArray<{ id: string }>,
): string[] {
  const targetIds = new Set(target.map((item) => item.id));
  return source.map((item) => item.id).filter((id) => !targetIds.has(id));
}

export function resolveMediaSource(source: string, fallback: string) {
  return source.trim().length > 0 ? source : fallback;
}

// ---------------------------------------------------------------------------
// Thermal circuit. A counterflow plate exchanger, solved rather than animated.
// Effectiveness is the one tuned number; everything else falls out of it.
// ---------------------------------------------------------------------------

/** Plate heat exchanger effectiveness. Titanium plates, clean, counterflow. */
export const EXCHANGER_EFFECTIVENESS = 0.85;
/** Seawater arriving from the intake, year round. */
export const SEAWATER_INTAKE_C = 5;
/** Temperature the buildings add to the loop, from idle to peak occupancy. */
const BUILDING_DELTA_MIN = 3;
const BUILDING_DELTA_MAX = 9;

export type CircuitState = {
  /** 0-1. Cooling demand across the buildings on the loop. */
  load: number;
  seawaterIn: number;
  seawaterOut: number;
  /** Chilled fresh water leaving the exchanger, headed for the fan coils. */
  supplyTemp: number;
  /** Fresh water coming back warmed from the buildings. */
  returnTemp: number;
  buildingDelta: number;
  /** Relative pump throughput, 0-1, for animation speed. */
  flowRate: number;
};

/**
 * Counterflow exchanger at steady state. The fresh loop is closed, so its
 * supply temperature is whatever satisfies both the exchanger effectiveness
 * and the heat the buildings put back in:
 *
 *   supply = seawaterIn + ((1 - e) / e) * buildingDelta
 *
 * Equal mass flow on both sides, so whatever the fresh side loses in kelvin
 * the seawater side gains.
 */
export function calculateCircuit(load: number): CircuitState {
  const clamped = clampNumber(load, 0, 1);
  const buildingDelta =
    BUILDING_DELTA_MIN + clamped * (BUILDING_DELTA_MAX - BUILDING_DELTA_MIN);
  const ratio =
    (1 - EXCHANGER_EFFECTIVENESS) / EXCHANGER_EFFECTIVENESS;
  const supplyTemp = SEAWATER_INTAKE_C + ratio * buildingDelta;

  return {
    load: clamped,
    seawaterIn: SEAWATER_INTAKE_C,
    seawaterOut: SEAWATER_INTAKE_C + buildingDelta,
    supplyTemp,
    returnTemp: supplyTemp + buildingDelta,
    buildingDelta,
    flowRate: 0.35 + clamped * 0.65,
  };
}

/**
 * Maps a circuit temperature onto 0-1 for the pipe colour. The window is tuned
 * to the range the circuit actually occupies (about 5-15 C) rather than to the
 * whole ocean, so the jump across the exchanger is visible instead of being
 * squashed into the middle of the ramp.
 */
export function temperatureToRamp(celsius: number): number {
  return clampNumber((celsius - 4.5) / 10, 0, 1);
}

// ---------------------------------------------------------------------------
// The slope. Why it works here, in one comparison.
// Profiles are [kilometres from shore, metres depth], simplified from published
// bathymetry. Shape is faithful; every vertex is not.
// ---------------------------------------------------------------------------

export type SlopeProfile = {
  id: "atoll" | "shelf";
  /** Kilometres of pipe needed to reach INTAKE_DEPTH. */
  distanceToDepthKm: number;
  points: ReadonlyArray<readonly [number, number]>;
};

export const slopeProfiles: Record<"atoll" | "shelf", SlopeProfile> = {
  atoll: {
    id: "atoll",
    distanceToDepthKm: 2,
    points: [
      [0, 0],
      [0.25, 25],
      [0.5, 120],
      [0.85, 330],
      [1.3, 610],
      [2, 900],
      [3.2, 1450],
      [5, 2050],
    ],
  },
  shelf: {
    id: "shelf",
    distanceToDepthKm: 138,
    points: [
      [0, 0],
      [25, 22],
      [55, 42],
      [85, 68],
      [112, 95],
      [126, 140],
      [132, 420],
      [138, 900],
      [148, 1650],
    ],
  },
};

/** Linear interpolation along a profile. Used by the slope readout. */
export function depthAtDistance(
  profile: SlopeProfile,
  distanceKm: number,
): number {
  const points = profile.points;
  const d = clampNumber(distanceKm, points[0][0], points[points.length - 1][0]);

  for (let i = 1; i < points.length; i += 1) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    if (d <= x1) {
      const t = x1 === x0 ? 0 : (d - x0) / (x1 - x0);
      return y0 + t * (y1 - y0);
    }
  }

  return points[points.length - 1][1];
}

// ---------------------------------------------------------------------------
// What to do when the shelf is long. A long shelf is not a dead end, it is a
// different technology. Each of these is built and running somewhere.
// ---------------------------------------------------------------------------

export const alternativeIds = [
  "swac",
  "lake",
  "warmShelf",
  "coldShelf",
  "aquifer",
  "mine",
  "district",
] as const;

export type AlternativeId = (typeof alternativeIds)[number];

export type Alternative = {
  id: AlternativeId;
  geography: string;
  technology: string;
  summary: string;
  detail: string;
  example: string;
  /** Rough share of conventional chiller electricity still required. */
  remainingEnergy: number;
};

// ---------------------------------------------------------------------------
// Copy
// ---------------------------------------------------------------------------

export type SwacCopy = {
  locale: SwacLocale;
  path: string;
  url: string;
  languageHref: string;
  metadata: { title: string; description: string };
  hero: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    description: string;
    coordinates: string;
    place: string;
    begin: string;
    pause: string;
    play: string;
    videoLabel: string;
    posterAlt: string;
    posterSrc: string;
  };
  basics: {
    eyebrow: string;
    title: string;
    definition: string;
    diagramLabel: string;
    seaLabel: string;
    depthLabel: string;
    plantLabel: string;
    buildingsLabel: string;
    coldLabel: string;
    warmLabel: string;
    chilledLabel: string;
    statValue: string;
    statLabel: string;
    steps: BasicStep[];
  };
  dive: {
    eyebrow: string;
    title: string;
    intro: string;
    instructions: string;
    stopLabel: string;
    depthLabel: string;
    temperatureLabel: string;
    pressureLabel: string;
    lightLabel: string;
    thermoclineLabel: string;
    toExchangerLabel: string;
    visualDescription: string;
    payoffTitle: string;
    payoffBody: string;
    stops: DiveStop[];
  };
  circuit: {
    eyebrow: string;
    title: string;
    intro: string;
    loadLabel: string;
    loadHint: string;
    lowLoad: string;
    highLoad: string;
    seawaterInLabel: string;
    seawaterOutLabel: string;
    supplyLabel: string;
    returnLabel: string;
    deltaLabel: string;
    visualDescription: string;
    closeLabel: string;
    nodes: LoopNode[];
  };
  meter: {
    eyebrow: string;
    title: string;
    intro: string;
    conventionalLabel: string;
    swacLabel: string;
    liveLabel: string;
    raceLabel: string;
    resetLabel: string;
    kwhLabel: string;
    annualLabel: string;
    dieselLabel: string;
    drumsLabel: string;
    co2Label: string;
    reductionLabel: string;
    loadLabel: string;
    caveat: string;
    presets: LedgerPreset[];
  };
  slope: {
    eyebrow: string;
    title: string;
    intro: string;
    dragLabel: string;
    atollLabel: string;
    atollCaption: string;
    shelfLabel: string;
    shelfCaption: string;
    depthMarker: string;
    pipeLabel: string;
    geologyLabel: string;
    geologyHref: string;
    visualDescription: string;
    alternativesEyebrow: string;
    alternativesTitle: string;
    alternativesIntro: string;
    geographyLabel: string;
    technologyLabel: string;
    exampleLabel: string;
    remainingLabel: string;
    alternatives: Alternative[];
  };
  globe: {
    eyebrow: string;
    title: string;
    intro: string;
    instructions: string;
    statusLabels: Record<SiteStatus, string>;
    calculatorTitle: string;
    calculatorIntro: string;
    distanceLabel: string;
    demandLabel: string;
    priceLabel: string;
    capitalLabel: string;
    savingsLabel: string;
    paybackLabel: string;
    yearsLabel: string;
    verdicts: Record<FeasibilityVerdict, { title: string; body: string }>;
    caveat: string;
    closeLabel: string;
    sites: FeasibilitySite[];
  };
  hard: {
    eyebrow: string;
    title: string;
    intro: string;
    items: Array<{ title: string; body: string }>;
  };
  sources: {
    eyebrow: string;
    title: string;
    intro: string;
    labels: {
      society: string;
      makai: string;
      nrel: string;
      otec: string;
      honolulu: string;
      cornell: string;
    };
  };
  cta: {
    eyebrow: string;
    title: string;
    body: string;
    /** The credentials beat: what we actually know how to do. */
    expertiseLabel: string;
    expertise: string[];
    contactLabel: string;
    contactHref: string;
    stationsLabel: string;
    stationsHref: string;
    donateLabel: string;
    donateHref: string;
  };
};


const englishCopy: SwacCopy = {
  locale: "en",
  path: ENGLISH_SWAC_PATH,
  url: ENGLISH_SWAC_URL,
  languageHref: FRENCH_SWAC_PATH,
  metadata: {
    title: "Sea Water Air Conditioning | Tetiaroa Society",
    description:
      "Tetiaroa cools its buildings with water drawn from 900 metres down. How the system works, what it saves, and how to find out whether your coastline could carry one.",
  },
  hero: {
    eyebrow: "Tetiaroa · Sea water air conditioning",
    titleLead: "The cold was",
    titleAccent: "already there",
    description:
      "Air conditioning has one job: move heat somewhere colder. In the tropics that somewhere is hard to find, until you look down. Nine hundred metres under Tetiaroa the Pacific sits at five degrees. We pump it up, borrow the chill, and send it back.",
    coordinates: "17°00′S 149°34′W",
    place: "Tetiaroa Atoll, French Polynesia",
    begin: "Take the pipe down",
    pause: "Pause",
    play: "Play",
    videoLabel: "Aerial footage of Tetiaroa atoll and its lagoon",
    posterAlt: "Tetiaroa atoll from the air, reef and lagoon",
    posterSrc: "/geology/atoll-foundation-poster.webp",
  },
  basics: {
    eyebrow: "The basics",
    title: "What is SWAC?",
    definition:
      "Sea water air conditioning replaces the part of an air conditioner that makes cold. Instead of a compressor burning electricity to chill water, a pipe runs out to where the ocean is already cold and brings that cold ashore. The seawater never enters a building and never mixes with anything. It passes a titanium plate, hands over its chill, and goes home. Everything downstream is ordinary air conditioning.",
    diagramLabel:
      "A cross-section showing a pipe running from a shore plant down to 900 metres, a heat exchanger on land, a chilled water loop feeding buildings, and a return pipe discharging warmed seawater at depth.",
    seaLabel: "Sea level",
    depthLabel: "900 m · 5 °C",
    plantLabel: "Plant",
    buildingsLabel: "Buildings",
    coldLabel: "Cold seawater in",
    warmLabel: "Warmed seawater out",
    chilledLabel: "Chilled fresh water",
    statValue: "90%",
    statLabel: "Less electricity than a conventional chiller",
    steps: [
      {
        id: "intake",
        number: "01",
        title: "Reach the cold",
        body:
          "A pipe runs down the island's slope to around nine hundred metres, where the Pacific holds five degrees all year round.",
      },
      {
        id: "exchange",
        number: "02",
        title: "Trade the chill",
        body:
          "Ashore, seawater and fresh water pass on opposite faces of a titanium plate. Heat crosses the metal. The two waters never touch.",
      },
      {
        id: "distribute",
        number: "03",
        title: "Cool the rooms",
        body:
          "Chilled fresh water circles a closed loop to the same fan coils any hotel already owns. Nothing downstream needs reinventing.",
      },
      {
        id: "return",
        number: "04",
        title: "Send it back",
        body:
          "The seawater leaves a few degrees warmer and returns to a depth where it matches the water around it.",
      },
    ],
  },
  dive: {
    eyebrow: "The descent",
    title: "Nine hundred metres, straight down",
    intro:
      "Follow the intake pipe from the reef to its mouth. The readings on the left trace a real ocean profile. Watch for the point where the temperature falls off a cliff.",
    instructions: "Scroll to descend",
    stopLabel: "Depth stop",
    depthLabel: "Depth",
    temperatureLabel: "Temperature",
    pressureLabel: "Pressure",
    lightLabel: "Daylight remaining",
    thermoclineLabel: "Thermocline",
    toExchangerLabel: "To the heat exchanger",
    visualDescription:
      "A cross-section of the water column beside Tetiaroa, from the reef at the surface down to the intake pipe mouth at 900 metres, with temperature falling from 28 to 5 degrees.",
    payoffTitle: "And then it becomes energy efficient cooling",
    payoffBody:
      "The seawater never enters a building. It gives up its chill across a titanium plate and goes straight back to the ocean. What reaches the rooms is fresh water, cooled through the metal.",
    stops: [
      {
        id: "surface",
        depth: 0,
        eyebrow: "0 metres",
        title: "The lagoon",
        body:
          "Twenty-eight degrees, and perfect for swimming. Just not for cooling. Push heat into water this warm and it has nowhere to go.",
        readout: "Warm mixed layer",
      },
      {
        id: "reef",
        depth: 40,
        eyebrow: "40 metres",
        title: "The reef wall",
        body:
          "The last of the branching coral. Past here the slope tips over and runs. This is the outer flank of a volcano, and it has been sinking quietly for millions of years.",
        readout: "Still 28 °C",
      },
      {
        id: "twilight",
        depth: 200,
        eyebrow: "200 metres",
        title: "The last of the light",
        body:
          "A hundred-thousandth of the sunlight that hit the surface. Divers call this the twilight zone. The water is cooling now, and the pipe still has seven hundred metres to fall.",
        readout: "Falling fast",
      },
      {
        id: "thermocline",
        depth: 400,
        eyebrow: "400 metres",
        title: "Through the thermocline",
        body:
          "The ocean's dividing line. Above it, sun-warmed water that mixes with the surface. Below it, a different ocean entirely. Nineteen degrees vanish in three hundred metres.",
        readout: "The boundary",
      },
      {
        id: "intake",
        depth: 900,
        eyebrow: "900 metres",
        title: "The intake",
        body:
          "Five degrees. Every day, every season, through every cyclone the atoll has ever taken. This water sank near the poles and crossed the Pacific to get here. All we had to do was reach it.",
        readout: "Intake depth",
      },
    ],
  },
  circuit: {
    eyebrow: "The circuit",
    title: "Two loops that never mix",
    intro:
      "Seawater runs up one face of a titanium plate. Fresh water runs down the other. Heat crosses the metal and the water never does. Drag the load handle to see the whole circuit respond.",
    loadLabel: "Cooling demand",
    loadHint: "Drag to change the load on the loop",
    lowLoad: "Night, half empty",
    highLoad: "Peak afternoon",
    seawaterInLabel: "Seawater in",
    seawaterOutLabel: "Seawater out",
    supplyLabel: "Chilled supply",
    returnLabel: "Warm return",
    deltaLabel: "Building rise",
    visualDescription:
      "A schematic of the sea water air conditioning circuit: an intake pipe from deep water, a titanium plate heat exchanger, a closed freshwater loop serving the buildings, and a discharge pipe returning warmed seawater to the ocean.",
    closeLabel: "Close",
    nodes: [
      {
        id: "intake",
        x: 9,
        y: 82.5,
        label: "Intake",
        title: "The intake pipe",
        body:
          "High-density polyethylene, weighted and anchored down the atoll's outer slope. Laying it is the hardest week of the project and most of the budget. Route it well and it runs for forty years.",
        spec: "≈900 m depth · deep water at 5 °C",
      },
      {
        id: "exchanger",
        x: 31.5,
        y: 45,
        label: "Heat exchanger",
        title: "Titanium plates",
        body:
          "Corrugated titanium sheets, millimetres apart, seawater on one face and the closed loop on the other. Titanium because seawater eats everything else. This is the only place the two waters meet, and they meet through metal.",
        spec: "Counterflow · ~85% effectiveness",
      },
      {
        id: "freshLoop",
        x: 52,
        y: 26,
        label: "Chilled loop",
        title: "The closed loop",
        body:
          "Ordinary fresh water, sealed, circling between the plant and the buildings. Nothing is used up and nothing is discharged. It carries chill out and heat back, indefinitely.",
        spec: "Closed circuit · no refrigerant",
      },
      {
        id: "buildings",
        x: 74.4,
        y: 24,
        label: "The rooms",
        title: "Fan coils and air handlers",
        body:
          "Standard chilled-water air conditioning, the same hardware any hotel or hospital already owns. That is the quiet advantage: we replace what makes the cold, not what delivers it.",
        spec: "Conventional chilled-water distribution",
      },
      {
        id: "ecostation",
        x: 74,
        y: 59,
        label: "Ecostation tap",
        title: "Deep water for the lab",
        body:
          "The same deep line feeds the Society's wet lab, plumbed for three supplies: fresh, surface seawater, and deep ocean water. Cold, clean, nutrient-rich water turns out to be good for far more than cooling.",
        spec: "Ecostation · research supply",
      },
      {
        id: "discharge",
        x: 93,
        y: 83,
        label: "Discharge",
        title: "Putting it back",
        body:
          "The seawater leaves a few degrees warmer and returns to a depth where its temperature and density match the water around it, so it neither rises to the lagoon nor sinks. Choosing that depth is the most consequential decision in the whole design.",
        spec: "Density-matched return",
      },
    ],
  },
  meter: {
    eyebrow: "The meter",
    title: "Watch both meters",
    intro:
      "Same building, same rooms, same afternoon, same number on the thermostat. One runs a conventional chiller. One runs sea water air conditioning. Give the meters a moment, or skip to the end of the year.",
    conventionalLabel: "Conventional chiller",
    swacLabel: "Sea water air conditioning",
    liveLabel: "Live",
    raceLabel: "Run a full year",
    resetLabel: "Reset",
    kwhLabel: "kWh",
    annualLabel: "Per year",
    dieselLabel: "Diesel not burned",
    drumsLabel: "200-litre drums",
    co2Label: "CO₂ avoided",
    reductionLabel: "Electricity saved",
    loadLabel: "Cooling load",
    caveat:
      "The maths here assumes a seasonal chiller efficiency of 3.0, a system efficiency of 20 for SWAC including pumping, 4,500 equivalent full-load cooling hours a year, and island diesel generation at 3.6 kWh per litre. Change any of those and the gap moves. The shape of it stays.",
    presets: [
      { id: "villa", label: "One villa", kw: 15 },
      { id: "hotel", label: "Small hotel", kw: 700 },
      { id: "resort", label: "The resort", kw: 2500 },
      { id: "hospital", label: "A hospital", kw: 5000 },
    ],
  },
  slope: {
    eyebrow: "Why here",
    title: "It comes down to slope",
    intro:
      "Tetiaroa is the drowned summit of a volcano. The seabed falls away from the reef so fast that nine hundred metres of depth sits two kilometres offshore. Drag the marker and compare that with a continental shelf, drawn at the same scale.",
    dragLabel: "Drag to compare",
    atollLabel: "Tetiaroa",
    atollCaption: "900 m deep, about 2 km out",
    shelfLabel: "A continental shelf",
    shelfCaption: "900 m deep, about 138 km out",
    depthMarker: "900 m — intake depth",
    pipeLabel: "Pipe required",
    geologyLabel: "How the atoll got this shape",
    geologyHref: "/island/geology",
    visualDescription:
      "Two seabed profiles at the same scale. Tetiaroa's volcanic flank reaches 900 metres depth within about 2 kilometres of shore; a continental shelf reaches the same depth about 138 kilometres out.",
    alternativesEyebrow: "If your shelf is long",
    alternativesTitle: "Cold water, other routes",
    alternativesIntro:
      "A long shelf does not rule out cold water. It rules out this particular pipe. Nearly every coastline has a version of the same trick available, and most of them are already running somewhere. Pick the ground you are standing on.",
    geographyLabel: "Your geography",
    technologyLabel: "What works instead",
    exampleLabel: "Already built",
    remainingLabel: "Electricity still needed",
    alternatives: [
      {
        id: "swac",
        geography: "A steep volcanic island",
        technology: "Sea water air conditioning",
        summary: "The system on this page. Deep cold at the end of a short pipe.",
        detail:
          "Volcanic islands and atolls are the ideal case. The seabed drops away almost at once, the pipe stays short, and the capital cost lands inside what a single large customer can carry. Most of the world's operating plants sit on islands for exactly this reason.",
        example: "Tetiaroa · Bora Bora · Papeete hospital",
        remainingEnergy: 0.15,
      },
      {
        id: "lake",
        geography: "A deep lake nearby",
        technology: "Lake source cooling",
        summary: "The same physics in fresh water, and you need far less depth.",
        detail:
          "A deep temperate lake stratifies. Below the thermocline it holds water near 4 °C all summer, sometimes only seventy metres down. That is a much shorter and much cheaper pipe than any ocean equivalent, which is why the resulting systems are among the largest anywhere.",
        example: "Cornell University, Cayuga Lake · Toronto, Lake Ontario",
        remainingEnergy: 0.13,
      },
      {
        id: "warmShelf",
        geography: "A long shelf, warm sea",
        technology: "Seawater condenser cooling",
        summary: "Stop chasing cold water. Use the sea to throw heat away instead.",
        detail:
          "You keep the chiller, but you stop dumping its heat into 35 °C air and dump it into 26 °C seawater. That one change takes twenty to thirty per cent off the bill, with a pipe measured in hundreds of metres. It is the unglamorous answer, and it is available to most tropical coastal cities today.",
        example: "Hong Kong's district seawater cooling scheme",
        remainingEnergy: 0.75,
      },
      {
        id: "coldShelf",
        geography: "A long shelf, cold sea",
        technology: "Direct free cooling",
        summary: "Up north the surface water is already cold enough. Skip the depth.",
        detail:
          "Above roughly 55 degrees of latitude the sea near the surface spends most of the year below the temperature a building needs. No deep pipe, no thermocline, and no refrigeration cycle for much of the year. A heat exchanger and a pump will do, which is why Nordic district cooling is the cheapest to run in the world.",
        example: "Stockholm · Helsinki",
        remainingEnergy: 0.12,
      },
      {
        id: "aquifer",
        geography: "Flat, inland, with an aquifer",
        technology: "Aquifer thermal energy storage",
        summary: "Bank the winter. Spend it in August.",
        detail:
          "Two wells into a shallow aquifer. In winter you pump groundwater up, let the cold air chill it, and push it back into a cold zone underground. In summer you draw that stored cold out again. The ground is the storage tank, and it works nowhere near the sea. The Netherlands alone runs thousands of them.",
        example: "The Netherlands · Belgium",
        remainingEnergy: 0.25,
      },
      {
        id: "mine",
        geography: "A flooded mine or quarry",
        technology: "Mine water cooling",
        summary: "Old workings fill with water that holds one temperature forever.",
        detail:
          "Abandoned coal and mineral workings hold enormous volumes of water at a constant temperature, already plumbed by the shafts dug to reach the ore. Former mining towns tend to have exactly the density and industrial land use that district cooling wants, which is a rare and welcome coincidence.",
        example: "Heerlen, Netherlands · Springhill, Nova Scotia",
        remainingEnergy: 0.22,
      },
      {
        id: "district",
        geography: "A dense city on any coast",
        technology: "A shared trunk main",
        summary: "One pipe, many buildings. Density is what makes a long pipe affordable.",
        detail:
          "The pipe costs the same whether it serves one hotel or forty office towers. At enough density, an intake no single building could ever justify becomes ordinary civic infrastructure. This is what Honolulu spent two decades trying to build, and why it kept coming so close.",
        example: "Honolulu's proposed scheme · Toronto's network",
        remainingEnergy: 0.15,
      },
    ],
  },
  globe: {
    eyebrow: "Elsewhere",
    title: "Who else has the slope",
    intro:
      "Plants that are running, freshwater cousins, and a few that never got built. Drag the globe. The pattern is easy to spot: this technology follows steep coastlines and deep lakes, and thins out where the shelf runs long.",
    instructions: "Drag to rotate · tap a marker",
    statusLabels: {
      operating: "Operating",
      freshwater: "Fresh water",
      candidate: "Candidate",
      stalled: "Not built",
    },
    calculatorTitle: "Run your own coastline",
    calculatorIntro:
      "Three numbers decide it. How far you have to go to reach cold water, how much cooling you need, and what electricity costs where you are.",
    distanceLabel: "Distance to cold water",
    demandLabel: "Cooling demand",
    priceLabel: "Electricity price",
    capitalLabel: "Capital cost",
    savingsLabel: "Saved per year",
    paybackLabel: "Simple payback",
    yearsLabel: "years",
    verdicts: {
      strong: {
        title: "This is the easy case",
        body:
          "The pipe pays for itself inside a decade. Sites that look like this are why the technology exists, and there are more of them than there are projects.",
      },
      plausible: {
        title: "Worth a feasibility study",
        body:
          "A payback in this range is ordinary for civic infrastructure and long for a private developer. Whether it gets built usually comes down to who is holding the balance sheet.",
      },
      marginal: {
        title: "This one needs patient money",
        body:
          "Technically sound, financially awkward. Projects in this band want a public balance sheet, a carbon price, or an owner who thinks in decades. Some of them find one.",
      },
      unlikely: {
        title: "Take one of the other routes",
        body:
          "The physics still works. The arithmetic does not. This is where seawater condenser cooling, lake source, or aquifer storage will beat a deep pipe comfortably, and all three are worth a look.",
      },
    },
    caveat:
      "Deliberately coarse. It assumes roughly two million per kilometre of marine pipeline and twelve hundred per kilowatt of onshore plant, and it ignores financing, permitting, seabed conditions and most of what actually decides a project. Treat it as a way to feel the tradeoff, then talk to someone who has laid one.",
    closeLabel: "Close",
    sites: [
      {
        id: "tetiaroa",
        name: "Tetiaroa",
        region: "French Polynesia",
        lat: -17.0,
        lon: -149.57,
        status: "operating",
        note: "Roughly 900 m intake on the atoll's outer slope, running since 2013.",
      },
      {
        id: "bora-bora",
        name: "Bora Bora",
        region: "French Polynesia",
        lat: -16.5,
        lon: -151.75,
        status: "operating",
        note: "One of the earliest resort-scale plants anywhere, and a near neighbour.",
      },
      {
        id: "papeete",
        name: "Papeete",
        region: "Tahiti",
        lat: -17.58,
        lon: -149.61,
        status: "operating",
        note: "The territorial hospital. A public building rather than a resort, which matters more than it sounds.",
      },
      {
        id: "cornell",
        name: "Cornell University",
        region: "Ithaca, New York",
        lat: 42.44,
        lon: -76.5,
        status: "freshwater",
        note: "Lake source cooling from Cayuga Lake since 2000. The cold sits at eighty metres here, not nine hundred.",
      },
      {
        id: "toronto",
        name: "Toronto",
        region: "Ontario",
        lat: 43.64,
        lon: -79.38,
        status: "freshwater",
        note: "Deep Lake Water Cooling serves the whole downtown core. The density argument, proven at scale.",
      },
      {
        id: "stockholm",
        name: "Stockholm",
        region: "Sweden",
        lat: 59.33,
        lon: 18.06,
        status: "freshwater",
        note: "District cooling straight from cold surface water. At this latitude the depth problem simply disappears.",
      },
      {
        id: "honolulu",
        name: "Honolulu",
        region: "Hawai'i",
        lat: 21.31,
        lon: -157.86,
        status: "stalled",
        note: "Engineered, permitted, financed on paper, never laid. The clearest proof that the constraint is capital rather than physics.",
      },
      {
        id: "male",
        name: "Malé",
        region: "Maldives",
        lat: 4.17,
        lon: 73.51,
        status: "candidate",
        note: "Atoll geography, high electricity prices, and every kilowatt currently made from imported diesel.",
      },
      {
        id: "curacao",
        name: "Willemstad",
        region: "Curaçao",
        lat: 12.11,
        lon: -68.93,
        status: "candidate",
        note: "A steep Caribbean shelf and a long-standing interest in deep ocean water.",
      },
      {
        id: "mauritius",
        name: "Port Louis",
        region: "Mauritius",
        lat: -20.16,
        lon: 57.5,
        status: "candidate",
        note: "A deep ocean water project has been studied here for well over a decade.",
      },
      {
        id: "zanzibar",
        name: "Stone Town",
        region: "Zanzibar",
        lat: -6.16,
        lon: 39.19,
        status: "candidate",
        note: "Dense, hot and coastal. A textbook district cooling case, if the bathymetry cooperates.",
      },
      {
        id: "nassau",
        name: "Nassau",
        region: "The Bahamas",
        lat: 25.06,
        lon: -77.34,
        status: "candidate",
        note: "Deep water close to shore and some of the highest power prices in the hemisphere.",
      },
    ],
  },
  hard: {
    eyebrow: "What we have learned",
    title: "The four questions that decide it",
    intro:
      "None of the hard parts are physics. They are decisions, and every one of them has caught a project out somewhere. Here is what running a plant for a decade has taught us to ask first.",
    items: [
      {
        title: "The pipe is the project",
        body:
          "Almost the entire cost sits in the marine pipeline, and it is spent before the first kilowatt-hour is saved. Route it well and you buy forty years of nearly free cooling. Route it badly and you buy a salvage operation. Survey work earns its money here several times over.",
      },
      {
        title: "The seabed decides",
        body:
          "You need deep water close in, a slope stable enough to anchor on, and a path that stays clear of reef worth protecting. Those three rarely line up by accident. Finding the corridor where they do is the first thing worth paying for.",
      },
      {
        title: "Plan for the day it stops",
        body:
          "One pipe. A cyclone, a slip on the slope, a dragged anchor. Every serious installation keeps conventional chillers standing by, and sizing that backup honestly is what separates a design that runs from one that reads well on paper.",
      },
      {
        title: "The discharge is the licence",
        body:
          "Water going back is warmer and richer in nutrients than the water around it. Return it at the wrong depth and you fertilise a reef that was doing fine. Getting it right takes modelling, monitoring and years of follow-up, and it is the first thing any regulator will ask about.",
      },
    ],
  },
  sources: {
    eyebrow: "Sources",
    title: "Where the numbers come from",
    intro:
      "Figures on this page come from public reporting and from general SWAC engineering literature. Site-specific performance data for the atoll's plant is not ours to publish, and anything described as an estimate is exactly that.",
    labels: {
      society: "Tetiaroa Society — the atoll, its research stations and infrastructure",
      makai: "Makai Ocean Engineering — seawater air conditioning system design and pipeline engineering",
      nrel: "NREL — ocean thermal resource assessment and deep seawater cooling potential",
      otec: "Ocean Energy Systems — deep ocean water applications and district cooling reviews",
      honolulu: "Honolulu Seawater Air Conditioning — project record and environmental review",
      cornell: "Cornell University — Lake Source Cooling project documentation and monitoring",
    },
  },
  cta: {
    eyebrow: "Tetiaroa Society",
    title: "Bring us your coastline",
    body:
      "Tetiaroa has run a deep-water cooling system through a decade of tropical weather, and the Society's scientists have been measuring what it does to the reef the entire time. That combination is rare: a working plant and the research to go with it. If your island is burning diesel to stay cool, we would like to look at your bathymetry.",
    expertiseLabel: "What we bring",
    expertise: [
      "Route survey and slope stability on live volcanic flanks",
      "Discharge modelling and reef monitoring, before and after",
      "Plant sizing for loads that triple between noon and midnight",
      "Ten years of operating data across cyclone seasons",
    ],
    contactLabel: "Talk to us about your site",
    contactHref: "/contact",
    stationsLabel: "Our research stations",
    stationsHref: "/stations",
    donateLabel: "Support the work",
    donateHref: "/donate",
  },
};

const frenchCopy: SwacCopy = {
  locale: "fr",
  path: FRENCH_SWAC_PATH,
  url: FRENCH_SWAC_URL,
  languageHref: ENGLISH_SWAC_PATH,
  metadata: {
    title: "Climatisation à l'eau de mer | Tetiaroa Society",
    description:
      "Tetiaroa climatise ses bâtiments avec de l'eau puisée à 900 mètres. Comment le système fonctionne, ce qu'il économise, et comment savoir si votre littoral pourrait en accueillir un.",
  },
  hero: {
    eyebrow: "Tetiaroa · Climatisation à l'eau de mer",
    titleLead: "Le froid était",
    titleAccent: "déjà là",
    description:
      "Une climatisation n'a qu'une tâche : déplacer la chaleur vers un endroit plus froid. Sous les tropiques, cet endroit est introuvable, sauf si l'on regarde vers le bas. À neuf cents mètres sous Tetiaroa, le Pacifique se tient à cinq degrés. Nous le remontons, lui empruntons sa fraîcheur, et le renvoyons.",
    coordinates: "17°00′S 149°34′O",
    place: "Atoll de Tetiaroa, Polynésie française",
    begin: "Suivre la conduite",
    pause: "Pause",
    play: "Lecture",
    videoLabel: "Images aériennes de l'atoll de Tetiaroa et de son lagon",
    posterAlt: "L'atoll de Tetiaroa vu du ciel, récif et lagon",
    posterSrc: "/geology/atoll-foundation-poster.webp",
  },
  basics: {
    eyebrow: "L'essentiel",
    title: "Qu'est-ce que le SWAC ?",
    definition:
      "La climatisation à l'eau de mer remplace la partie d'un climatiseur qui fabrique le froid. Au lieu d'un compresseur qui brûle de l'électricité pour refroidir de l'eau, une conduite va chercher le froid là où l'océan est déjà froid et le ramène à terre. L'eau de mer n'entre jamais dans un bâtiment et ne se mélange à rien. Elle longe une plaque de titane, cède sa fraîcheur, et repart. Tout le reste est de la climatisation ordinaire.",
    diagramLabel:
      "Une coupe montrant une conduite reliant une centrale à terre à 900 mètres de profondeur, un échangeur de chaleur sur la côte, une boucle d'eau glacée desservant les bâtiments, et une conduite de rejet restituant l'eau de mer réchauffée en profondeur.",
    seaLabel: "Niveau de la mer",
    depthLabel: "900 m · 5 °C",
    plantLabel: "Centrale",
    buildingsLabel: "Bâtiments",
    coldLabel: "Eau de mer froide",
    warmLabel: "Eau de mer réchauffée",
    chilledLabel: "Eau douce glacée",
    statValue: "90 %",
    statLabel: "D'électricité en moins qu'un groupe froid classique",
    steps: [
      {
        id: "intake",
        number: "01",
        title: "Atteindre le froid",
        body:
          "Une conduite descend le talus de l'île jusque vers neuf cents mètres, là où le Pacifique se tient à cinq degrés toute l'année.",
      },
      {
        id: "exchange",
        number: "02",
        title: "Céder la fraîcheur",
        body:
          "À terre, l'eau de mer et l'eau douce longent les deux faces d'une plaque de titane. La chaleur traverse le métal. Les deux eaux ne se touchent jamais.",
      },
      {
        id: "distribute",
        number: "03",
        title: "Rafraîchir les chambres",
        body:
          "L'eau douce glacée tourne en circuit fermé vers les mêmes ventilo-convecteurs que possède déjà n'importe quel hôtel. Rien en aval n'est à réinventer.",
      },
      {
        id: "return",
        number: "04",
        title: "La renvoyer",
        body:
          "L'eau de mer repart quelques degrés plus chaude, restituée à une profondeur où elle rejoint l'eau environnante.",
      },
    ],
  },
  dive: {
    eyebrow: "La descente",
    title: "Neuf cents mètres, à la verticale",
    intro:
      "Suivez la conduite depuis le récif jusqu'à sa prise d'eau. Les valeurs à gauche suivent un profil océanique réel. Guettez le moment où la température bascule.",
    instructions: "Faites défiler pour descendre",
    stopLabel: "Palier",
    depthLabel: "Profondeur",
    temperatureLabel: "Température",
    pressureLabel: "Pression",
    lightLabel: "Lumière restante",
    thermoclineLabel: "Thermocline",
    toExchangerLabel: "Vers l'échangeur",
    visualDescription:
      "Une coupe de la colonne d'eau au large de Tetiaroa, du récif en surface jusqu'à la prise d'eau à 900 mètres, la température passant de 28 à 5 degrés.",
    payoffTitle: "Et puis elle rafraîchit une chambre",
    payoffBody:
      "L'eau de mer n'entre jamais dans un bâtiment. Elle cède sa fraîcheur à travers une plaque de titane et repart aussitôt à l'océan. Ce qui arrive dans les chambres, c'est de l'eau douce, refroidie au travers du métal.",
    stops: [
      {
        id: "surface",
        depth: 0,
        eyebrow: "0 mètre",
        title: "Le lagon",
        body:
          "Vingt-huit degrés, parfait pour la baignade. Beaucoup moins pour la climatisation. Une eau aussi chaude n'a nulle part où mettre la chaleur qu'on lui confie.",
        readout: "Couche de mélange",
      },
      {
        id: "reef",
        depth: 40,
        eyebrow: "40 mètres",
        title: "Le tombant",
        body:
          "Les derniers coraux branchus. Passé ce point, la pente bascule et file. C'est le flanc externe d'un volcan, et il s'enfonce tranquillement depuis des millions d'années.",
        readout: "Toujours 28 °C",
      },
      {
        id: "twilight",
        depth: 200,
        eyebrow: "200 mètres",
        title: "Les derniers rayons",
        body:
          "Un cent-millième de la lumière reçue en surface. Les plongeurs appellent cela la zone crépusculaire. L'eau se rafraîchit, et la conduite a encore sept cents mètres à descendre.",
        readout: "Chute rapide",
      },
      {
        id: "thermocline",
        depth: 400,
        eyebrow: "400 mètres",
        title: "La thermocline",
        body:
          "La ligne de partage de l'océan. Au-dessus, une eau brassée et réchauffée par le soleil. En dessous, un tout autre océan. Dix-neuf degrés disparaissent en trois cents mètres.",
        readout: "La frontière",
      },
      {
        id: "intake",
        depth: 900,
        eyebrow: "900 mètres",
        title: "La prise d'eau",
        body:
          "Cinq degrés. Chaque jour, chaque saison, à travers chaque cyclone encaissé par l'atoll. Cette eau a plongé près des pôles et traversé le Pacifique pour arriver ici. Il suffisait d'aller la chercher.",
        readout: "Profondeur de captage",
      },
    ],
  },
  circuit: {
    eyebrow: "Le circuit",
    title: "Deux boucles qui ne se mélangent jamais",
    intro:
      "L'eau de mer longe une face d'une plaque de titane. L'eau douce longe l'autre. La chaleur traverse le métal, l'eau jamais. Tirez la poignée de charge et regardez tout le circuit réagir.",
    loadLabel: "Demande de froid",
    loadHint: "Tirez pour modifier la charge du circuit",
    lowLoad: "Nuit, à moitié vide",
    highLoad: "Plein après-midi",
    seawaterInLabel: "Eau de mer entrante",
    seawaterOutLabel: "Eau de mer sortante",
    supplyLabel: "Départ glacé",
    returnLabel: "Retour réchauffé",
    deltaLabel: "Écart bâtiment",
    visualDescription:
      "Schéma du circuit de climatisation à l'eau de mer : conduite de captage en eau profonde, échangeur à plaques de titane, boucle d'eau douce fermée desservant les bâtiments, et conduite de rejet renvoyant l'eau de mer réchauffée à l'océan.",
    closeLabel: "Fermer",
    nodes: [
      {
        id: "intake",
        x: 9,
        y: 82.5,
        label: "Captage",
        title: "La conduite de captage",
        body:
          "Du polyéthylène haute densité, lesté et ancré le long du talus externe de l'atoll. La poser est la semaine la plus difficile du chantier et l'essentiel du budget. Bien tracée, elle tient quarante ans.",
        spec: "≈900 m de profondeur · eau profonde à 5 °C",
      },
      {
        id: "exchanger",
        x: 31.5,
        y: 45,
        label: "Échangeur",
        title: "Des plaques de titane",
        body:
          "Des feuilles de titane ondulées, séparées de quelques millimètres, l'eau de mer d'un côté et la boucle fermée de l'autre. Du titane, parce que l'eau de mer dévore tout le reste. C'est le seul endroit où les deux eaux se rencontrent, et elles le font à travers du métal.",
        spec: "Contre-courant · efficacité ~85 %",
      },
      {
        id: "freshLoop",
        x: 52,
        y: 26,
        label: "Boucle glacée",
        title: "Le circuit fermé",
        body:
          "De l'eau douce ordinaire, scellée, qui tourne entre la centrale et les bâtiments. Rien ne se consomme, rien ne se rejette. Elle emporte le froid à l'aller et la chaleur au retour, indéfiniment.",
        spec: "Circuit fermé · sans fluide frigorigène",
      },
      {
        id: "buildings",
        x: 74.4,
        y: 24,
        label: "Les chambres",
        title: "Ventilo-convecteurs et centrales de traitement d'air",
        body:
          "De la climatisation à eau glacée tout à fait classique, le même matériel que possède déjà n'importe quel hôtel ou hôpital. C'est l'avantage discret : nous remplaçons ce qui fabrique le froid, pas ce qui le distribue.",
        spec: "Distribution à eau glacée classique",
      },
      {
        id: "ecostation",
        x: 74,
        y: 59,
        label: "Prise Ecostation",
        title: "De l'eau profonde pour le laboratoire",
        body:
          "La même ligne profonde alimente le laboratoire humide de la Society, équipé de trois arrivées : eau douce, eau de mer de surface, eau océanique profonde. Une eau froide, propre et riche en nutriments sert à bien plus qu'à climatiser.",
        spec: "Ecostation · alimentation scientifique",
      },
      {
        id: "discharge",
        x: 93,
        y: 83,
        label: "Rejet",
        title: "La rendre",
        body:
          "L'eau de mer repart quelques degrés plus chaude, restituée à une profondeur où sa température et sa densité rejoignent celles de l'eau environnante. Elle ne remonte pas vers le lagon et ne coule pas davantage. Choisir cette profondeur est la décision la plus lourde de conséquences de tout le projet.",
        spec: "Rejet à densité équivalente",
      },
    ],
  },
  meter: {
    eyebrow: "Le compteur",
    title: "Regardez les deux compteurs",
    intro:
      "Même bâtiment, mêmes chambres, même après-midi, même consigne au thermostat. L'un tourne avec un groupe froid classique. L'autre avec la climatisation à l'eau de mer. Laissez-leur un instant, ou passez directement à la fin de l'année.",
    conventionalLabel: "Groupe froid classique",
    swacLabel: "Climatisation à l'eau de mer",
    liveLabel: "En direct",
    raceLabel: "Dérouler une année",
    resetLabel: "Réinitialiser",
    kwhLabel: "kWh",
    annualLabel: "Par an",
    dieselLabel: "Gazole non brûlé",
    drumsLabel: "Fûts de 200 litres",
    co2Label: "CO₂ évité",
    reductionLabel: "Électricité économisée",
    loadLabel: "Charge de froid",
    caveat:
      "Le calcul retient un rendement saisonnier de 3,0 pour le groupe froid, de 20 pour le SWAC pompage compris, 4 500 heures annuelles équivalent pleine charge, et une production diesel insulaire à 3,6 kWh par litre. Changez l'une de ces valeurs et l'écart bouge. Sa forme, elle, reste la même.",
    presets: [
      { id: "villa", label: "Une villa", kw: 15 },
      { id: "hotel", label: "Petit hôtel", kw: 700 },
      { id: "resort", label: "Le complexe", kw: 2500 },
      { id: "hospital", label: "Un hôpital", kw: 5000 },
    ],
  },
  slope: {
    eyebrow: "Pourquoi ici",
    title: "Tout tient à la pente",
    intro:
      "Tetiaroa est le sommet noyé d'un volcan. Le fond s'éloigne du récif si vite que neuf cents mètres de profondeur se trouvent à deux kilomètres au large. Tirez le repère et comparez avec un plateau continental, dessiné à la même échelle.",
    dragLabel: "Tirez pour comparer",
    atollLabel: "Tetiaroa",
    atollCaption: "900 m de fond, à environ 2 km",
    shelfLabel: "Un plateau continental",
    shelfCaption: "900 m de fond, à environ 138 km",
    depthMarker: "900 m — profondeur de captage",
    pipeLabel: "Conduite nécessaire",
    geologyLabel: "Comment l'atoll a pris cette forme",
    geologyHref: "/fr/island/geology",
    visualDescription:
      "Deux profils de fond marin à la même échelle. Le flanc volcanique de Tetiaroa atteint 900 mètres de profondeur à environ 2 kilomètres du rivage ; un plateau continental atteint la même profondeur à environ 138 kilomètres.",
    alternativesEyebrow: "Si votre plateau est long",
    alternativesTitle: "L'eau froide, par d'autres chemins",
    alternativesIntro:
      "Un plateau étendu n'exclut pas l'eau froide. Il exclut cette conduite-là. Presque tout littoral dispose d'une variante du même tour de main, et la plupart tournent déjà quelque part. Choisissez le sol sur lequel vous vous tenez.",
    geographyLabel: "Votre géographie",
    technologyLabel: "Ce qui marche à la place",
    exampleLabel: "Déjà construit",
    remainingLabel: "Électricité encore nécessaire",
    alternatives: [
      {
        id: "swac",
        geography: "Une île volcanique escarpée",
        technology: "Climatisation à l'eau de mer",
        summary: "Le système décrit ici. Du froid profond au bout d'une conduite courte.",
        detail:
          "Îles volcaniques et atolls sont le cas idéal. Le fond plonge presque aussitôt, la conduite reste courte, et l'investissement tient dans ce qu'un seul gros client peut porter. La plupart des centrales en service dans le monde sont insulaires pour cette raison précise.",
        example: "Tetiaroa · Bora Bora · Hôpital de Papeete",
        remainingEnergy: 0.15,
      },
      {
        id: "lake",
        geography: "Un lac profond à proximité",
        technology: "Climatisation par eau de lac",
        summary: "La même physique en eau douce, et bien moins de profondeur.",
        detail:
          "Un lac tempéré profond se stratifie. Sous la thermocline, il garde une eau proche de 4 °C tout l'été, parfois à soixante-dix mètres seulement. La conduite est bien plus courte et bien moins chère que n'importe quel équivalent océanique, et les installations qui en résultent comptent parmi les plus grandes du monde.",
        example: "Université Cornell, lac Cayuga · Toronto, lac Ontario",
        remainingEnergy: 0.13,
      },
      {
        id: "warmShelf",
        geography: "Plateau étendu, mer chaude",
        technology: "Condenseurs à l'eau de mer",
        summary: "Cessez de chercher du froid. Servez-vous de la mer pour évacuer la chaleur.",
        detail:
          "Vous gardez le groupe froid, mais vous cessez de rejeter sa chaleur dans un air à 35 °C pour la rejeter dans une eau de mer à 26 °C. Ce seul changement retire vingt à trente pour cent de la facture, avec une conduite de quelques centaines de mètres. C'est la réponse sans panache, et elle est à portée de la plupart des villes côtières tropicales dès aujourd'hui.",
        example: "Le réseau d'eau de mer de Hong Kong",
        remainingEnergy: 0.75,
      },
      {
        id: "coldShelf",
        geography: "Plateau étendu, mer froide",
        technology: "Free cooling direct",
        summary: "Au nord, l'eau de surface est déjà assez froide. Oubliez la profondeur.",
        detail:
          "Au-delà d'environ 55 degrés de latitude, la mer proche de la surface passe la majeure partie de l'année sous la température dont un bâtiment a besoin. Pas de conduite profonde, pas de thermocline, et pas de cycle frigorifique une bonne partie de l'année. Un échangeur et une pompe suffisent, ce qui fait des réseaux de froid nordiques les moins coûteux du monde à exploiter.",
        example: "Stockholm · Helsinki",
        remainingEnergy: 0.12,
      },
      {
        id: "aquifer",
        geography: "Plaine intérieure, avec aquifère",
        technology: "Stockage thermique en aquifère",
        summary: "Mettez l'hiver de côté. Dépensez-le en août.",
        detail:
          "Deux forages dans un aquifère peu profond. L'hiver, on remonte l'eau souterraine, l'air froid la refroidit, et on la réinjecte dans une zone froide. L'été, on ressort ce froid stocké. Le sous-sol fait office de réservoir, et cela fonctionne très loin de la mer. Les Pays-Bas à eux seuls en exploitent des milliers.",
        example: "Pays-Bas · Belgique",
        remainingEnergy: 0.25,
      },
      {
        id: "mine",
        geography: "Une mine ou une carrière noyée",
        technology: "Climatisation par eau de mine",
        summary: "Les anciens travaux se remplissent d'une eau qui garde une seule température, pour toujours.",
        detail:
          "Les exploitations abandonnées retiennent d'énormes volumes d'eau à température constante, déjà desservis par les puits creusés pour atteindre le minerai. Les anciennes villes minières ont souvent exactement la densité bâtie et l'usage industriel qu'un réseau de froid recherche, heureuse coïncidence.",
        example: "Heerlen, Pays-Bas · Springhill, Nouvelle-Écosse",
        remainingEnergy: 0.22,
      },
      {
        id: "district",
        geography: "Une ville dense, sur n'importe quelle côte",
        technology: "Une conduite maîtresse partagée",
        summary: "Une conduite, beaucoup de bâtiments. C'est la densité qui rend une longue conduite abordable.",
        detail:
          "La conduite coûte le même prix qu'elle desserve un hôtel ou quarante tours de bureaux. À densité suffisante, un captage qu'aucun bâtiment ne pourrait justifier seul devient une infrastructure urbaine ordinaire. C'est ce que Honolulu a tenté pendant vingt ans, et la raison pour laquelle le projet a si souvent frôlé le but.",
        example: "Le projet de Honolulu · Le réseau de Toronto",
        remainingEnergy: 0.15,
      },
    ],
  },
  globe: {
    eyebrow: "Ailleurs",
    title: "Qui d'autre a la pente",
    intro:
      "Des centrales en service, des cousines d'eau douce, et quelques-unes qui n'ont jamais vu le jour. Faites tourner le globe. Le motif saute aux yeux : cette technologie suit les côtes abruptes et les lacs profonds, et se raréfie là où le plateau s'allonge.",
    instructions: "Faites glisser pour tourner · touchez un repère",
    statusLabels: {
      operating: "En service",
      freshwater: "Eau douce",
      candidate: "Envisagé",
      stalled: "Jamais construit",
    },
    calculatorTitle: "Testez votre littoral",
    calculatorIntro:
      "Trois nombres décident. La distance à parcourir pour atteindre l'eau froide, le besoin de froid, et le prix de l'électricité chez vous.",
    distanceLabel: "Distance jusqu'à l'eau froide",
    demandLabel: "Besoin de froid",
    priceLabel: "Prix de l'électricité",
    capitalLabel: "Investissement",
    savingsLabel: "Économisé par an",
    paybackLabel: "Retour simple",
    yearsLabel: "ans",
    verdicts: {
      strong: {
        title: "C'est le cas facile",
        body:
          "La conduite se rembourse en moins de dix ans. Les sites de ce genre sont la raison d'être de cette technologie, et il y en a plus qu'il n'y a de projets.",
      },
      plausible: {
        title: "Mérite une étude de faisabilité",
        body:
          "Un tel retour est banal pour une infrastructure publique et long pour un promoteur privé. Que le projet se fasse dépend le plus souvent de qui tient le bilan.",
      },
      marginal: {
        title: "Celui-ci demande de l'argent patient",
        body:
          "Techniquement solide, financièrement inconfortable. Les projets de cette bande ont besoin d'un bilan public, d'un prix du carbone, ou d'un propriétaire qui pense en décennies. Certains le trouvent.",
      },
      unlikely: {
        title: "Prenez l'un des autres chemins",
        body:
          "La physique tient toujours. L'arithmétique, non. C'est ici que les condenseurs à l'eau de mer, l'eau de lac ou le stockage en aquifère battent largement une conduite profonde, et les trois méritent un coup d'œil.",
      },
    },
    caveat:
      "Volontairement grossier. On y suppose environ deux millions par kilomètre de conduite marine et douze cents par kilowatt d'installation à terre, et l'on ignore le financement, les autorisations, la nature du fond et l'essentiel de ce qui décide vraiment d'un projet. Voyez-y un moyen de sentir l'arbitrage, puis parlez à quelqu'un qui en a posé une.",
    closeLabel: "Fermer",
    sites: [
      {
        id: "tetiaroa",
        name: "Tetiaroa",
        region: "Polynésie française",
        lat: -17.0,
        lon: -149.57,
        status: "operating",
        note: "Captage vers 900 m sur le talus externe de l'atoll, en service depuis 2013.",
      },
      {
        id: "bora-bora",
        name: "Bora Bora",
        region: "Polynésie française",
        lat: -16.5,
        lon: -151.75,
        status: "operating",
        note: "L'une des premières centrales à l'échelle d'un hôtel, et une proche voisine.",
      },
      {
        id: "papeete",
        name: "Papeete",
        region: "Tahiti",
        lat: -17.58,
        lon: -149.61,
        status: "operating",
        note: "L'hôpital du territoire. Un bâtiment public plutôt qu'un hôtel, ce qui compte plus qu'il n'y paraît.",
      },
      {
        id: "cornell",
        name: "Université Cornell",
        region: "Ithaca, New York",
        lat: 42.44,
        lon: -76.5,
        status: "freshwater",
        note: "Climatisation par le lac Cayuga depuis 2000. Ici le froid est à quatre-vingts mètres, pas à neuf cents.",
      },
      {
        id: "toronto",
        name: "Toronto",
        region: "Ontario",
        lat: 43.64,
        lon: -79.38,
        status: "freshwater",
        note: "Le réseau Deep Lake Water Cooling dessert tout le centre-ville. L'argument de la densité, démontré à grande échelle.",
      },
      {
        id: "stockholm",
        name: "Stockholm",
        region: "Suède",
        lat: 59.33,
        lon: 18.06,
        status: "freshwater",
        note: "Un réseau de froid alimenté directement par l'eau de surface. À cette latitude, la question de la profondeur disparaît.",
      },
      {
        id: "honolulu",
        name: "Honolulu",
        region: "Hawaï",
        lat: 21.31,
        lon: -157.86,
        status: "stalled",
        note: "Conçu, autorisé, financé sur le papier, jamais posé. La preuve la plus nette que la contrainte est financière et non physique.",
      },
      {
        id: "male",
        name: "Malé",
        region: "Maldives",
        lat: 4.17,
        lon: 73.51,
        status: "candidate",
        note: "Géographie d'atoll, électricité chère, et chaque kilowatt aujourd'hui produit au gazole importé.",
      },
      {
        id: "curacao",
        name: "Willemstad",
        region: "Curaçao",
        lat: 12.11,
        lon: -68.93,
        status: "candidate",
        note: "Un talus caraïbe abrupt et un intérêt ancien pour l'eau océanique profonde.",
      },
      {
        id: "mauritius",
        name: "Port-Louis",
        region: "Maurice",
        lat: -20.16,
        lon: 57.5,
        status: "candidate",
        note: "Un projet d'eau océanique profonde y est étudié depuis plus de dix ans.",
      },
      {
        id: "zanzibar",
        name: "Stone Town",
        region: "Zanzibar",
        lat: -6.16,
        lon: 39.19,
        status: "candidate",
        note: "Dense, chaude et côtière. Un cas d'école pour un réseau de froid, si la bathymétrie coopère.",
      },
      {
        id: "nassau",
        name: "Nassau",
        region: "Bahamas",
        lat: 25.06,
        lon: -77.34,
        status: "candidate",
        note: "De l'eau profonde près du rivage et parmi les tarifs électriques les plus élevés de l'hémisphère.",
      },
    ],
  },
  hard: {
    eyebrow: "Ce que nous avons appris",
    title: "Les quatre questions qui décident",
    intro:
      "Aucune des difficultés n'est physique. Ce sont des décisions, et chacune a piégé un projet quelque part. Voici ce que dix ans d'exploitation nous ont appris à demander en premier.",
    items: [
      {
        title: "La conduite, c'est le projet",
        body:
          "La quasi-totalité du coût réside dans la conduite marine, et elle se paie avant le premier kilowattheure économisé. Bien tracée, elle vous achète quarante ans de froid presque gratuit. Mal tracée, elle vous achète un chantier de renflouage. Les études de tracé se remboursent ici plusieurs fois.",
      },
      {
        title: "C'est le fond qui décide",
        body:
          "Il vous faut de l'eau profonde près du rivage, une pente assez stable pour y ancrer, et un tracé qui évite le récif qui mérite d'être protégé. Ces trois conditions s'alignent rarement par hasard. Trouver le couloir où elles coïncident est la première chose qui vaut d'être payée.",
      },
      {
        title: "Prévoir le jour où elle s'arrête",
        body:
          "Une seule conduite. Un cyclone, un glissement sur la pente, une ancre qui ripe. Toute installation sérieuse garde des groupes froids classiques en secours, et dimensionner honnêtement ce secours sépare une conception qui tourne d'une conception qui se lit bien.",
      },
      {
        title: "Le rejet, c'est le permis",
        body:
          "L'eau restituée est plus chaude et plus riche en nutriments que celle qui l'entoure. Rendue à la mauvaise profondeur, elle fertilise un récif qui se portait très bien. Y parvenir demande de la modélisation, du suivi et des années de contrôle, et c'est la première chose que tout régulateur vous demandera.",
      },
    ],
  },
  sources: {
    eyebrow: "Sources",
    title: "D'où viennent les chiffres",
    intro:
      "Les valeurs de cette page proviennent de publications accessibles et de la littérature technique générale sur le SWAC. Les données de performance propres à la centrale de l'atoll ne nous appartiennent pas, et tout ce qui est présenté comme une estimation en est bien une.",
    labels: {
      society: "Tetiaroa Society — l'atoll, ses stations de recherche et ses infrastructures",
      makai: "Makai Ocean Engineering — conception des systèmes de climatisation à l'eau de mer et ingénierie des conduites",
      nrel: "NREL — évaluation de la ressource thermique océanique et du potentiel de froid par eau profonde",
      otec: "Ocean Energy Systems — applications de l'eau océanique profonde et revues des réseaux de froid",
      honolulu: "Honolulu Seawater Air Conditioning — dossier de projet et étude d'impact",
      cornell: "Université Cornell — documentation et suivi du projet Lake Source Cooling",
    },
  },
  cta: {
    eyebrow: "Tetiaroa Society",
    title: "Apportez-nous votre littoral",
    body:
      "Tetiaroa exploite un système de froid en eau profonde depuis dix ans de météo tropicale, et les scientifiques de la Society mesurent depuis le début ce qu'il fait au récif. Cette combinaison est rare : une centrale qui tourne et la recherche qui va avec. Si votre île brûle du gazole pour rester au frais, nous aimerions regarder votre bathymétrie.",
    expertiseLabel: "Ce que nous apportons",
    expertise: [
      "Étude de tracé et stabilité de pente sur flanc volcanique",
      "Modélisation du rejet et suivi du récif, avant et après",
      "Dimensionnement pour des charges qui triplent entre midi et minuit",
      "Dix ans de données d'exploitation en saison cyclonique",
    ],
    contactLabel: "Parlons de votre site",
    contactHref: "/fr/contact",
    stationsLabel: "Nos stations de recherche",
    stationsHref: "/fr/stations",
    donateLabel: "Soutenir le travail",
    donateHref: "/fr/donate",
  },
};

export const swacCopies: Record<SwacLocale, SwacCopy> = {
  en: englishCopy,
  fr: frenchCopy,
};
