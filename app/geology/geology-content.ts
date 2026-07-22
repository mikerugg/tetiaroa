const ENGLISH_GEOLOGY_PATH = "/island/geology";
const FRENCH_GEOLOGY_PATH = "/fr/ile/geologie";
const ENGLISH_GEOLOGY_URL =
  "https://www.tetiaroasociety.org/island/geology";
const FRENCH_GEOLOGY_URL =
  "https://www.tetiaroasociety.org/fr/ile/geologie";

export type GeologyLocale = "en" | "fr";

export const geologyStageIds = [
  "hotspot",
  "drift",
  "reef",
  "flexure",
  "motu",
  "lowstand",
  "lagoon",
] as const;

export type GeologyStageId = (typeof geologyStageIds)[number];
export type EvidenceKind = "measured" | "established" | "reconstruction";

export type GeologyStage = {
  id: GeologyStageId;
  number: string;
  era: string;
  kicker: string;
  title: string;
  summary: string;
  detail: string;
  evidence: EvidenceKind;
  evidenceLabel: string;
  fact: string;
  visualDescription: string;
};

export type MapHotspot = {
  id: "reef" | "motu" | "lagoon" | "pinnacles" | "foundation";
  x: number;
  y: number;
  label: string;
  title: string;
  description: string;
  evidenceLabel: string;
};

export type GeologyCopy = {
  locale: GeologyLocale;
  path: string;
  url: string;
  languageHref: string;
  metadata: {
    title: string;
    description: string;
  };
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
    videoWebmSrc: string;
    videoSrc: string;
    posterSrc: string;
  };
  legend: Record<EvidenceKind, string>;
  story: {
    eyebrow: string;
    title: string;
    intro: string;
    instructions: string;
    stageLabel: string;
    factLabel: string;
    ariaLabel: string;
    visualTitle: string;
    visualSummary: string;
  };
  stages: GeologyStage[];
  flexure: {
    eyebrow: string;
    title: string;
    intro: string;
    unloadedLabel: string;
    loadedLabel: string;
    controlLabel: string;
    boundaryLabel: string;
    tahiti: string;
    tetiaroa: string;
    moat: string;
    oceanicPlate: string;
    descriptionUnloaded: string;
    descriptionLoaded: string;
    caveat: string;
  };
  seaLevel: {
    eyebrow: string;
    title: string;
    intro: string;
    controlLabel: string;
    metresLabel: string;
    periods: [
      { value: number; short: string; date: string; title: string; body: string },
      { value: number; short: string; date: string; title: string; body: string },
      { value: number; short: string; date: string; title: string; body: string },
      { value: number; short: string; date: string; title: string; body: string },
    ];
    reef: string;
    sea: string;
    karst: string;
    visualDescription: string;
  };
  map: {
    eyebrow: string;
    title: string;
    intro: string;
    imageAlt: string;
    instructions: string;
    detailLabel: string;
    closeLabel: string;
    hotspots: MapHotspot[];
    motuTitle: string;
    motu: string[];
  };
  fieldNote: {
    eyebrow: string;
    title: string;
    body: string;
    imageAlt: string;
  };
  sources: {
    eyebrow: string;
    title: string;
    intro: string;
    labels: {
      society: string;
      lithosphere: string;
      moorea: string;
      seaLevel: string;
    };
  };
  cta: {
    eyebrow: string;
    title: string;
    body: string;
    researchLabel: string;
    researchHref: string;
    gisLabel: string;
    donateLabel: string;
    donateHref: string;
  };
};

const englishStages: GeologyStage[] = [
  {
    id: "hotspot",
    number: "01",
    era: "Date unknown",
    kicker: "The volcano forms",
    title: "Tetiaroa begins as a volcano.",
    summary:
      "Magma rises through the Pacific Plate above the Society hotspot. Repeated eruptions build a volcano from the deep ocean floor until its summit emerges as an island.",
    detail:
      "Tetiaroa's volcanic foundation is now completely underwater, so scientists cannot date its emergence directly. Its location in the Society chain suggests that it formed near the time Moorea was forming, but the exact date is unknown.",
    evidence: "reconstruction",
    evidenceLabel: "Process established; timing reconstructed",
    fact: "Geophysical estimates put the submerged volcanic edifice at about 1,300 km³.",
    visualDescription:
      "Magma rises beneath the Pacific Plate and builds a submarine volcano whose summit emerges above sea level.",
  },
  {
    id: "drift",
    number: "02",
    era: "After the island forms",
    kicker: "Volcanism stops",
    title: "Plate movement shuts down the volcano.",
    summary:
      "The Pacific Plate carries the volcano northwest, away from the hotspot that supplied its magma. Once that connection is lost, eruptions stop.",
    detail:
      "The same movement created the age pattern across the Society Islands: younger volcanoes lie toward the active southeast, while older islands and atolls lie farther northwest.",
    evidence: "established",
    evidenceLabel: "Widely established",
    fact: "The plate travels roughly 10 cm northwest each year.",
    visualDescription:
      "The Pacific Plate carries the volcanic island northwest and away from the hotspot below.",
  },
  {
    id: "reef",
    number: "03",
    era: "As the volcano ages",
    kicker: "Land shrinks; reef grows",
    title: "The volcano gets lower while the reef grows upward.",
    summary:
      "Rain, waves and gravity erode the volcanic island. As the plate carries it away from the elevated hotspot region, the seafloor slowly subsides. Living coral around the shore continues to grow near sunlight and sea level.",
    detail:
      "The volcanic land becomes smaller, but the reef keeps building upward. The widening stretch of water between the land and the outer reef becomes a lagoon.",
    evidence: "established",
    evidenceLabel: "Widely established",
    fact: "Living coral communities continue to renew the reef's ocean-facing edge.",
    visualDescription:
      "The volcanic island erodes and subsides as a coral reef grows upward around it, opening a shallow lagoon between land and reef.",
  },
  {
    id: "flexure",
    number: "04",
    era: "As Tahiti grows",
    kicker: "The plate bends",
    title: "Tahiti's weight may have pushed Tetiaroa lower.",
    summary:
      "The available evidence suggests that Tahiti grew after Tetiaroa and became a much larger volcano. Its weight bent the oceanic plate into a broad depression that includes Tetiaroa.",
    detail:
      "Geophysical measurements show regional bending under the Society Islands. They do not reveal exactly how much Tetiaroa sank because of Tahiti rather than normal volcanic subsidence. Tahiti's contribution is therefore a well-supported reconstruction, not a direct measurement at Tetiaroa.",
    evidence: "reconstruction",
    evidenceLabel: "Evidence-based reconstruction",
    fact: "Geophysical estimates put Tahiti's volcanic volume at roughly ten times Tetiaroa's.",
    visualDescription:
      "Tahiti's volcanic mass bends the oceanic plate downward, with Tetiaroa located inside the broad flexural depression.",
  },
  {
    id: "motu",
    number: "05",
    era: "As volcanic land disappears",
    kicker: "Motu form",
    title: "Waves turn broken reef into islands.",
    summary:
      "Large waves, especially during cyclones, carry coral boulders, rubble and sand over the reef crest and deposit them on the shallow reef flat.",
    detail:
      "These deposits build up, cement together and support vegetation, forming motu. After the volcanic summit sinks below sea level, the reef encloses a lagoon and the motu sit on its rim: Tetiaroa is now an atoll. The twelve motu seen today are younger and continue to change.",
    evidence: "established",
    evidenceLabel: "Widely established",
    fact: "Motu are made mainly from reef-derived carbonate material, not exposed volcanic rock.",
    visualDescription:
      "The volcanic mountain disappears below sea level while waves deposit coral rubble and sand to form low motu on the reef rim.",
  },
  {
    id: "lowstand",
    number: "06",
    era: "About 20,500 years ago",
    kicker: "Sea level falls",
    title: "Ice-age sea-level fall exposes the reef platform.",
    summary:
      "At the Last Glacial Maximum, so much water is stored in continental ice that global mean sea level falls by about 125–130 metres. Tetiaroa's reef platform is left above the sea.",
    detail:
      "Rainwater dissolves the exposed carbonate rock. Holes and caverns enlarge, leaving limestone ridges and pinnacles between them. This eroded terrain is called karst.",
    evidence: "established",
    evidenceLabel: "Measured globally; reconstructed locally",
    fact: "The lowest global mean sea level occurred around 20,500 years ago.",
    visualDescription:
      "Sea level lies far below the exposed reef platform, where rainwater dissolves limestone into caverns, ridges and pinnacles.",
  },
  {
    id: "lagoon",
    number: "07",
    era: "From about 19,000 years ago",
    kicker: "The lagoon returns",
    title: "Rising seas flood the karst and restore the lagoon.",
    summary:
      "As the ice sheets melt, global sea level rises. Seawater floods Tetiaroa's eroded reef platform, and coral begins growing again on the reef margin and on high points inside the lagoon.",
    detail:
      "Some of the old limestone ridges and pinnacles remain just below the surface. They can be mapped and seen today, and they still affect where boats can travel through the lagoon.",
    evidence: "measured",
    evidenceLabel: "Observed today; origin interpreted",
    fact: "Modern coral growth caps parts of the submerged relief inside the lagoon.",
    visualDescription:
      "Rising seawater covers the karst landscape and restores the lagoon, leaving a modern atoll with a living reef rim, twelve motu and submerged limestone relief below the water.",
  },
];

const frenchStages: GeologyStage[] = [
  {
    id: "hotspot",
    number: "01",
    era: "Date inconnue",
    kicker: "Le volcan se forme",
    title: "Tetiaroa naît sous la forme d'un volcan.",
    summary:
      "Au-dessus du point chaud de la Société, le magma traverse la plaque Pacifique. Les éruptions successives bâtissent un volcan depuis le fond de l'océan, jusqu'à ce que son sommet émerge et forme une île.",
    detail:
      "La fondation volcanique de Tetiaroa est aujourd'hui entièrement immergée. Les scientifiques ne peuvent donc pas dater directement son émergence. Sa position dans l'archipel de la Société suggère qu'elle s'est formée vers la même époque que Moorea, mais sa date exacte reste inconnue.",
    evidence: "reconstruction",
    evidenceLabel: "Processus établi ; datation reconstituée",
    fact: "Les estimations géophysiques évaluent l'édifice volcanique immergé à environ 1 300 km³.",
    visualDescription:
      "Le magma remonte sous la plaque Pacifique et bâtit un volcan sous-marin dont le sommet émerge au-dessus de la mer.",
  },
  {
    id: "drift",
    number: "02",
    era: "Après la formation de l'île",
    kicker: "Le volcanisme cesse",
    title: "Le mouvement de la plaque éteint le volcan.",
    summary:
      "La plaque Pacifique emporte le volcan vers le nord-ouest, loin du point chaud qui alimentait ses éruptions. Une fois cette connexion rompue, le volcanisme cesse.",
    detail:
      "Ce même mouvement explique la répartition des âges dans l'archipel de la Société : les volcans les plus jeunes se trouvent vers le sud-est actif ; les îles et atolls plus anciens, plus au nord-ouest.",
    evidence: "established",
    evidenceLabel: "Largement établi",
    fact: "La plaque avance d'environ 10 cm par an vers le nord-ouest.",
    visualDescription:
      "La plaque Pacifique emporte l'île volcanique vers le nord-ouest, loin du point chaud situé en dessous.",
  },
  {
    id: "reef",
    number: "03",
    era: "À mesure que le volcan vieillit",
    kicker: "La terre diminue ; le récif grandit",
    title: "Le volcan s'abaisse tandis que le récif monte.",
    summary:
      "La pluie, les vagues et la gravité érodent l'île volcanique. Dans le même temps, le plancher océanique s'affaisse lentement, tandis que le corail vivant continue de croître autour du rivage, près de la lumière et de la surface.",
    detail:
      "La terre volcanique rétrécit, mais le récif continue de monter. L'étendue d'eau qui s'élargit entre la terre et le récif externe devient un lagon.",
    evidence: "established",
    evidenceLabel: "Largement établi",
    fact: "Les communautés coralliennes vivantes continuent de renouveler la bordure océanique du récif.",
    visualDescription:
      "L'île volcanique s'érode et s'affaisse tandis qu'un récif corallien grandit autour d'elle, ouvrant un lagon peu profond entre la terre et le récif.",
  },
  {
    id: "flexure",
    number: "04",
    era: "À mesure que Tahiti grandit",
    kicker: "La plaque se courbe",
    title: "Le poids de Tahiti a pu accentuer l'enfoncement de Tetiaroa.",
    summary:
      "Les données disponibles suggèrent que Tahiti s'est formée après Tetiaroa et est devenue un volcan beaucoup plus volumineux. Son poids a courbé la plaque océanique et créé une vaste dépression qui englobe Tetiaroa.",
    detail:
      "Les mesures géophysiques montrent une flexion régionale sous les îles de la Société. Elles ne permettent pas de savoir quelle part de l'enfoncement de Tetiaroa vient du poids de Tahiti plutôt que de la subsidence normale d'un volcan. Le rôle de Tahiti est donc une reconstitution solidement étayée, pas une mesure directe à Tetiaroa.",
    evidence: "reconstruction",
    evidenceLabel: "Reconstitution fondée sur les données",
    fact: "Les estimations géophysiques donnent à Tahiti un volume volcanique environ dix fois supérieur à celui de Tetiaroa.",
    visualDescription:
      "La masse volcanique de Tahiti courbe la plaque océanique vers le bas ; Tetiaroa se trouve dans la vaste dépression flexurale.",
  },
  {
    id: "motu",
    number: "05",
    era: "À mesure que la terre volcanique disparaît",
    kicker: "Les motu se forment",
    title: "Les vagues transforment les débris du récif en îlots.",
    summary:
      "Les fortes vagues, en particulier pendant les cyclones, transportent blocs de corail, débris et sable par-dessus la crête récifale et les déposent sur le platier peu profond.",
    detail:
      "Ces dépôts s'accumulent, se cimentent et accueillent la végétation : ils forment les motu. Une fois le sommet volcanique immergé, le récif entoure un lagon et les motu reposent sur sa bordure : Tetiaroa est devenu un atoll. Les douze motu actuels sont plus jeunes et continuent d'évoluer.",
    evidence: "established",
    evidenceLabel: "Largement établi",
    fact: "Les motu sont surtout constitués de matériaux carbonatés issus du récif, non de roche volcanique affleurante.",
    visualDescription:
      "La montagne volcanique disparaît sous la mer tandis que les vagues déposent débris coralliens et sable pour former de bas motu sur la couronne récifale.",
  },
  {
    id: "lowstand",
    number: "06",
    era: "Il y a environ 20 500 ans",
    kicker: "Le niveau marin baisse",
    title: "La baisse du niveau marin expose la plateforme récifale.",
    summary:
      "Au Dernier Maximum Glaciaire, une telle quantité d'eau est retenue dans les glaces continentales que le niveau marin moyen mondial baisse d'environ 125 à 130 mètres. La plateforme récifale de Tetiaroa se retrouve hors de l'eau.",
    detail:
      "L'eau de pluie dissout la roche carbonatée exposée. Les trous et les cavernes s'agrandissent, laissant entre eux des crêtes et des pinacles calcaires. Ce type de relief érodé s'appelle un karst.",
    evidence: "established",
    evidenceLabel: "Mesuré globalement, reconstitué localement",
    fact: "Le minimum marin mondial date d'environ 20 500 ans.",
    visualDescription:
      "La mer se trouve bien sous la plateforme récifale exposée, où l'eau de pluie dissout le calcaire et forme cavernes, crêtes et pinacles.",
  },
  {
    id: "lagoon",
    number: "07",
    era: "Depuis environ 19 000 ans",
    kicker: "Le lagon revient",
    title: "La montée des eaux submerge le karst et rétablit le lagon.",
    summary:
      "À mesure que les calottes glaciaires fondent, le niveau marin mondial remonte. L'eau de mer recouvre la plateforme récifale érodée de Tetiaroa, et le corail recommence à croître sur la bordure du récif et sur les points hauts du lagon.",
    detail:
      "Certaines anciennes crêtes et certains pinacles calcaires restent juste sous la surface. Ils sont aujourd'hui visibles et cartographiés, et continuent de déterminer les passages empruntés par les bateaux dans le lagon.",
    evidence: "measured",
    evidenceLabel: "Observé aujourd'hui ; origine interprétée",
    fact: "Des coraux récents coiffent une partie du relief submergé dans le lagon.",
    visualDescription:
      "La montée des eaux recouvre le relief karstique et rétablit le lagon, laissant un atoll moderne avec un récif vivant, douze motu et un relief calcaire immergé.",
  },
];

const sharedMotu = [
  "Onetahi",
  "Honuea",
  "Tiaraunu",
  "Tauini",
  "Auroa",
  "Hira Anae",
  "Oroatera",
  "Motu ‘Ā‘ie",
  "Tahuna Iti",
  "Tahuna Rahi",
  "Reiono",
  "Rimatu‘u",
];

export const geologyCopies: Record<GeologyLocale, GeologyCopy> = {
  en: {
    locale: "en",
    path: ENGLISH_GEOLOGY_PATH,
    url: ENGLISH_GEOLOGY_URL,
    languageHref: FRENCH_GEOLOGY_PATH,
    metadata: {
      title: "How Tetiaroa Became an Atoll | Tetiaroa Society",
      description:
        "See how a volcano, a growing coral reef, sinking seafloor and ice-age sea-level change formed Tetiaroa's atoll and lagoon.",
    },
    hero: {
      eyebrow: "From volcano to atoll · Interactive geology",
      titleLead: "Tetiaroa began",
      titleAccent: "as a volcano.",
      description:
        "The volcano stopped erupting, eroded and sank below the sea. Coral kept growing around it. Ice-age sea-level change later exposed and dissolved the reef platform before flooding it again, restoring the lagoon we see today.",
      coordinates: "17° 00′ 18″ S / 149° 34′ 13″ W",
      place: "53 km north of Tahiti",
      begin: "Follow the formation story",
      pause: "Pause background film",
      play: "Play background film",
      videoLabel: "Aerial film of Tetiaroa Atoll",
      posterAlt:
        "Illustrative aerial view of a coral atoll with its volcanic foundation visible beneath deep water.",
      videoWebmSrc: "/atoll.webm",
      videoSrc: "/atoll.mp4",
      posterSrc: "/geology/atoll-foundation-poster.webp",
    },
    legend: {
      measured: "Directly observed or measured",
      established: "Established geological process",
      reconstruction: "Tetiaroa-specific reconstruction",
    },
    story: {
      eyebrow: "Seven stages",
      title: "From volcano to atoll, one change leads to the next.",
      intro:
        "Scroll or choose a stage to see what changed and why. The cross-section is simplified and not to scale; it explains the sequence of events rather than the exact shape of Tetiaroa below the water.",
      instructions: "Choose a geological stage",
      stageLabel: "Stage",
      factLabel: "What the evidence says",
      ariaLabel: "Animated cross-section of Tetiaroa's formation",
      visualTitle: "Tetiaroa through geologic time",
      visualSummary:
        "The sequence shows a volcano emerging and moving away from its hotspot; the volcano then erodes and subsides while a reef and motu form around it. Ice-age sea-level fall exposes and dissolves the reef platform before rising seas flood it to form the modern lagoon.",
    },
    stages: englishStages,
    flexure: {
      eyebrow: "Test the Tahiti hypothesis",
      title: "Compare the plate with and without Tahiti's full weight.",
      intro:
        "This diagram compares two simplified plate shapes. Turn Tahiti's full volcanic load off and on to see how its weight creates a broad depression around the island. The comparison shows a physical process, not Tetiaroa's measured depth through time.",
      unloadedLabel: "Without full load",
      loadedLabel: "With full load",
      controlLabel: "Compare the modelled plate shape",
      boundaryLabel: "What this model can show",
      tahiti: "Tahiti",
      tetiaroa: "Tetiaroa",
      moat: "Flexural moat",
      oceanicPlate: "Oceanic plate",
      descriptionUnloaded:
        "Without Tahiti's full volcanic load, the comparison shows the oceanic plate nearly level.",
      descriptionLoaded:
        "With Tahiti's full volcanic load, the plate bends into a broad depression called a flexural moat. Tetiaroa lies inside that modelled depression.",
      caveat:
        "Geophysical measurements support regional flexure beneath the Society Islands. Because Tetiaroa's volcanic foundation is submerged and undated, this diagram cannot tell us exactly how far or when Tetiaroa moved downward.",
    },
    seaLevel: {
      eyebrow: "Four sea-level snapshots",
      title: "Lower the sea to reveal the old reef platform.",
      intro:
        "Move the control through four moments. Watch the reef platform emerge as global sea level falls, then disappear beneath the modern lagoon as the sea rises again. The landform is simplified and the water levels are shown relative to today.",
      controlLabel: "Choose one of four sea-level snapshots",
      metresLabel: "global sea level relative to today",
      periods: [
        {
          value: 0,
          short: "Warm seas",
          date: "About 125,000 years ago",
          title: "Sea level near today's height",
          body: "Tetiaroa was probably already an atoll. Its motu were likely arranged differently, and its lagoon was probably shallower because sediment had accumulated inside it.",
        },
        {
          value: -128,
          short: "Ice age",
          date: "About 20,500 years ago",
          title: "The reef platform exposed",
          body: "Near the Last Glacial Maximum, global mean sea level was roughly 125–130 metres lower than today. Rainwater dissolved the exposed carbonate platform, forming holes, caverns, ridges and pinnacles.",
        },
        {
          value: -55,
          short: "Seas return",
          date: "About 12,000 years ago",
          title: "Seawater returns",
          body: "As the ice sheets melted, rising seawater spread across the eroded platform. Lower areas flooded first, and coral began growing again along the reef margin and on high points.",
        },
        {
          value: 0,
          short: "Today",
          date: "Today",
          title: "The modern lagoon",
          body: "Seawater now covers the karst surface. Sediment is accumulating inside the lagoon, and coral caps some high points that remain habitats and navigation hazards just below the surface.",
        },
      ],
      reef: "reef platform",
      sea: "ocean",
      karst: "dissolved limestone",
      visualDescription:
        "An interactive cross-section shows four sea levels relative to today, revealing how falling seas exposed the reef platform to karst erosion and rising seas flooded it again.",
    },
    map: {
      eyebrow: "The atoll today",
      title: "Each part of Tetiaroa records a different stage of its formation.",
      intro:
        "Choose a marker to see how the visible reef, motu and lagoon relate to the volcanic and limestone structures below the water.",
      imageAlt:
        "Labeled aerial map of Tetiaroa showing the lagoon and its twelve motu.",
      instructions: "Choose a feature on the atoll map",
      detailLabel: "About this feature",
      closeLabel: "Close feature detail",
      hotspots: [
        {
          id: "reef",
          x: 79,
          y: 43,
          label: "Reef crest",
          title: "Coral keeps the reef near sea level",
          description:
            "Living coral grows on the ocean-facing edge of the reef. Reef growth and reef-derived sediment maintain the atoll near sea level even while its foundation moves slowly below.",
          evidenceLabel: "Observed today",
        },
        {
          id: "motu",
          x: 27,
          y: 65,
          label: "Motu",
          title: "Low islands built from reef material",
          description:
            "Waves deposited coral rubble and sand on the reef flat. The material cemented together and vegetation took root, forming the low islands called motu.",
          evidenceLabel: "Observed today",
        },
        {
          id: "lagoon",
          x: 54,
          y: 48,
          label: "Lagoon",
          title: "The flooded space inside the reef",
          description:
            "The lagoon occupies the space inside the reef and above the submerged volcanic foundation. After the ice-age reflooding, carbonate sediment began accumulating there again.",
          evidenceLabel: "Observed today",
        },
        {
          id: "pinnacles",
          x: 52,
          y: 61,
          label: "Pinnacles",
          title: "Remains of the exposed reef platform",
          description:
            "Ridges and high points just below the surface are interpreted as remnants of the reef platform that rainwater dissolved during the last ice age. Younger coral now grows on some of them.",
          evidenceLabel: "Observed and interpreted",
        },
        {
          id: "foundation",
          x: 46,
          y: 83,
          label: "Volcanic foundation",
          title: "The original volcano, now underwater",
          description:
            "The entire reef system rests on a large extinct volcano. Its original summit has eroded and subsided below sea level; no volcanic rock now rises above the surface.",
          evidenceLabel: "Measured geophysically",
        },
      ],
      motuTitle: "The twelve motu of Tetiaroa",
      motu: sharedMotu,
    },
    fieldNote: {
      eyebrow: "Field note",
      title: "The old landscape still shapes life and travel.",
      body:
        "The reef flat provides habitat and supports the motu. Ridges and pinnacles inside the lagoon create habitat too, but they also limit where boats can pass and where field teams can work safely.",
      imageAlt:
        "People walking along exposed reef rock on the ocean-facing shore of Tetiaroa.",
    },
    sources: {
      eyebrow: "Evidence and sources",
      title: "Some parts are measured. Others must be reconstructed.",
      intro:
        "The modern reef and lagoon can be observed directly, and regional plate flexure and global sea-level change have been measured. Tetiaroa's submerged volcano has not been dated, so its age and exact history of subsidence remain reconstructions.",
      labels: {
        society: "Tetiaroa Society · Geologic history",
        lithosphere: "Geophysical Journal International · Society Islands flexure",
        moorea: "Journal of Volcanology and Geothermal Research · Moorea chronology",
        seaLevel: "Nature · Last Glacial Maximum sea level",
      },
    },
    cta: {
      eyebrow: "Tetiaroa is still changing",
      title: "Follow the science of a living atoll.",
      body:
        "Coral growth, storms, sediment and sea-level change continue to reshape Tetiaroa. Explore the research that tracks those changes and supports the atoll's future.",
      researchLabel: "Explore the Impact Feed",
      researchHref: "/impact",
      gisLabel: "Open the Tetiaroa GIS observatory",
      donateLabel: "Fund the Work",
      donateHref: "/donate",
    },
  },
  fr: {
    locale: "fr",
    path: FRENCH_GEOLOGY_PATH,
    url: FRENCH_GEOLOGY_URL,
    languageHref: ENGLISH_GEOLOGY_PATH,
    metadata: {
      title: "Comment Tetiaroa est devenu un atoll | Tetiaroa Society",
      description:
        "Découvrez comment un volcan, un récif en croissance, la subsidence et les variations glaciaires du niveau marin ont formé l'atoll et le lagon de Tetiaroa.",
    },
    hero: {
      eyebrow: "Du volcan à l'atoll · Géologie interactive",
      titleLead: "Tetiaroa était d'abord",
      titleAccent: "un volcan.",
      description:
        "Le volcan s'est éteint, érodé, puis enfoncé sous la mer. Autour de lui, le corail a continué de croître. Plus tard, les variations glaciaires du niveau marin ont exposé, dissous puis submergé la plateforme récifale, formant le lagon actuel.",
      coordinates: "17° 00′ 18″ S / 149° 34′ 13″ O",
      place: "À 53 km au nord de Tahiti",
      begin: "Suivre la formation de l'atoll",
      pause: "Mettre le film en pause",
      play: "Lire le film d'arrière-plan",
      videoLabel: "Film aérien de l'atoll de Tetiaroa",
      posterAlt:
        "Vue aérienne illustrée d'un atoll corallien avec sa fondation volcanique visible sous l'eau profonde.",
      videoWebmSrc: "/atoll.webm",
      videoSrc: "/atoll.mp4",
      posterSrc: "/geology/atoll-foundation-poster.webp",
    },
    legend: {
      measured: "Observé ou mesuré directement",
      established: "Processus géologique établi",
      reconstruction: "Reconstitution propre à Tetiaroa",
    },
    story: {
      eyebrow: "Sept étapes",
      title: "Du volcan à l'atoll : chaque changement entraîne le suivant.",
      intro:
        "Faites défiler le récit ou choisissez une étape pour comprendre ce qui change et pourquoi. La coupe est simplifiée et n'est pas à l'échelle : elle explique l'enchaînement des événements, pas la forme exacte de Tetiaroa sous l'eau.",
      instructions: "Choisir une étape géologique",
      stageLabel: "Étape",
      factLabel: "Ce que montrent les données",
      ariaLabel: "Coupe animée de la formation de Tetiaroa",
      visualTitle: "Tetiaroa à travers le temps géologique",
      visualSummary:
        "La séquence montre un volcan émerger puis s'éloigner de son point chaud ; il s'érode et s'enfonce pendant qu'un récif et des motu se forment autour de lui. La baisse du niveau marin pendant la glaciation expose et dissout la plateforme récifale, avant que la remontée des eaux ne la submerge et ne rétablisse le lagon.",
    },
    stages: frenchStages,
    flexure: {
      eyebrow: "Tester l'hypothèse de Tahiti",
      title: "Comparez la plaque avec et sans le poids complet de Tahiti.",
      intro:
        "Ce schéma compare deux formes simplifiées de la plaque. Retirez puis ajoutez la charge volcanique complète de Tahiti pour voir comment son poids crée une vaste dépression autour de l'île. Cette comparaison illustre un processus physique ; elle ne mesure pas la profondeur de Tetiaroa au fil du temps.",
      unloadedLabel: "Sans la pleine charge",
      loadedLabel: "Avec la pleine charge",
      controlLabel: "Comparer la forme modélisée de la plaque",
      boundaryLabel: "Ce que montre le modèle",
      tahiti: "Tahiti",
      tetiaroa: "Tetiaroa",
      moat: "Dépression flexurale",
      oceanicPlate: "Plaque océanique",
      descriptionUnloaded:
        "Sans la charge volcanique complète de Tahiti, la comparaison montre une plaque océanique presque horizontale.",
      descriptionLoaded:
        "Avec la charge volcanique complète de Tahiti, la plaque se courbe en une vaste dépression appelée fosse flexurale. Tetiaroa se trouve dans cette dépression modélisée.",
      caveat:
        "Les mesures géophysiques confirment la flexion régionale sous les îles de la Société. La fondation volcanique de Tetiaroa étant immergée et non datée, ce schéma ne peut indiquer ni la date ni l'ampleur exacte de son enfoncement.",
    },
    seaLevel: {
      eyebrow: "Quatre niveaux marins",
      title: "Abaissez la mer pour révéler l'ancienne plateforme récifale.",
      intro:
        "Parcourez quatre moments. Regardez la plateforme récifale émerger lorsque le niveau marin mondial baisse, puis disparaître sous le lagon actuel lorsque la mer remonte. Le relief est simplifié et les niveaux sont indiqués par rapport à aujourd'hui.",
      controlLabel: "Choisir l'un des quatre niveaux marins",
      metresLabel: "niveau marin mondial par rapport à aujourd'hui",
      periods: [
        {
          value: 0,
          short: "Mer haute",
          date: "Il y a environ 125 000 ans",
          title: "Un niveau proche de l'actuel",
          body: "Tetiaroa était probablement déjà un atoll. Ses motu étaient sans doute disposés autrement, et son lagon probablement moins profond en raison des sédiments qui s'y étaient accumulés.",
        },
        {
          value: -128,
          short: "Ère glaciaire",
          date: "Il y a environ 20 500 ans",
          title: "La plateforme récifale exposée",
          body: "Près du Dernier Maximum Glaciaire, le niveau marin moyen mondial se trouvait environ 125 à 130 mètres plus bas qu'aujourd'hui. L'eau de pluie a dissous la plateforme carbonatée exposée, formant trous, cavernes, crêtes et pinacles.",
        },
        {
          value: -55,
          short: "Retour de la mer",
          date: "Il y a environ 12 000 ans",
          title: "Le retour de la mer",
          body: "Avec la fonte des calottes glaciaires, la mer est remontée sur la plateforme érodée. Les zones basses ont été submergées en premier, et le corail a recommencé à croître sur la bordure du récif et sur les points hauts.",
        },
        {
          value: 0,
          short: "Aujourd'hui",
          date: "Aujourd'hui",
          title: "Le lagon actuel",
          body: "La mer recouvre aujourd'hui la surface karstique. Les sédiments s'accumulent dans le lagon et le corail coiffe certains points hauts, qui restent des habitats et des dangers pour la navigation juste sous la surface.",
        },
      ],
      reef: "plateforme récifale",
      sea: "océan",
      karst: "calcaire dissous",
      visualDescription:
        "Une coupe interactive montre quatre niveaux marins par rapport à aujourd'hui : la baisse de la mer expose la plateforme à l'érosion karstique, puis sa remontée la submerge de nouveau.",
    },
    map: {
      eyebrow: "L'atoll aujourd'hui",
      title: "Chaque partie de Tetiaroa conserve une étape de sa formation.",
      intro:
        "Choisissez un repère pour relier le récif, les motu et le lagon visibles aux structures volcaniques et calcaires cachées sous l'eau.",
      imageAlt:
        "Carte aérienne légendée de Tetiaroa montrant le lagon et ses douze motu.",
      instructions: "Choisir un élément sur la carte de l'atoll",
      detailLabel: "À propos de cet élément",
      closeLabel: "Fermer le détail",
      hotspots: [
        {
          id: "reef",
          x: 79,
          y: 43,
          label: "Crête récifale",
          title: "Le corail maintient le récif près de la surface",
          description:
            "Le corail vivant se développe sur la bordure du récif face à l'océan. Sa croissance et les sédiments issus du récif maintiennent l'atoll près du niveau marin malgré les lents mouvements de sa fondation.",
          evidenceLabel: "Observé aujourd'hui",
        },
        {
          id: "motu",
          x: 27,
          y: 65,
          label: "Motu",
          title: "Des îlots bas formés de matériaux récifaux",
          description:
            "Les vagues ont déposé débris coralliens et sable sur le platier. Ces matériaux se sont cimentés et la végétation s'y est installée, formant les îlots appelés motu.",
          evidenceLabel: "Observé aujourd'hui",
        },
        {
          id: "lagoon",
          x: 54,
          y: 48,
          label: "Lagon",
          title: "L'espace submergé à l'intérieur du récif",
          description:
            "Le lagon occupe l'espace intérieur du récif où se dressait autrefois la terre volcanique. Depuis la remontée postglaciaire des eaux, les sédiments carbonatés s'y accumulent de nouveau.",
          evidenceLabel: "Observé aujourd'hui",
        },
        {
          id: "pinnacles",
          x: 52,
          y: 61,
          label: "Pinacles",
          title: "Les vestiges de la plateforme récifale exposée",
          description:
            "Les crêtes et points hauts proches de la surface sont interprétés comme les vestiges de la plateforme récifale dissoute par la pluie pendant la dernière glaciation. Du corail plus jeune pousse aujourd'hui sur certains d'entre eux.",
          evidenceLabel: "Observé et interprété",
        },
        {
          id: "foundation",
          x: 46,
          y: 83,
          label: "Fondation volcanique",
          title: "Le volcan d'origine, aujourd'hui immergé",
          description:
            "Tout le système récifal repose sur un vaste volcan éteint. Son sommet originel s'est érodé et enfoncé sous la mer ; aucune roche volcanique n'émerge aujourd'hui.",
          evidenceLabel: "Mesuré par la géophysique",
        },
      ],
      motuTitle: "Les douze motu de Tetiaroa",
      motu: sharedMotu,
    },
    fieldNote: {
      eyebrow: "Note de terrain",
      title: "L'ancien relief façonne encore la vie et les déplacements.",
      body:
        "Le platier abrite de nombreuses espèces et porte les motu. Les crêtes et pinacles du lagon offrent eux aussi des habitats, mais limitent les passages des bateaux et les zones où les équipes peuvent travailler en sécurité.",
      imageAlt:
        "Des personnes marchent sur la roche récifale exposée du rivage océanique de Tetiaroa.",
    },
    sources: {
      eyebrow: "Données et sources",
      title: "Certains éléments sont mesurés. D'autres doivent être reconstitués.",
      intro:
        "Le récif et le lagon actuels sont directement observables ; la flexion régionale de la plaque et les variations mondiales du niveau marin sont mesurées. Le volcan immergé de Tetiaroa n'a pas été daté : son âge et l'histoire précise de son enfoncement restent donc des reconstitutions.",
      labels: {
        society: "Tetiaroa Society · Histoire géologique",
        lithosphere: "Geophysical Journal International · Flexion des îles de la Société",
        moorea: "Journal of Volcanology and Geothermal Research · Chronologie de Moorea",
        seaLevel: "Nature · Niveau marin du Dernier Maximum Glaciaire",
      },
    },
    cta: {
      eyebrow: "Tetiaroa continue de changer",
      title: "Suivez la science d'un atoll vivant.",
      body:
        "La croissance du corail, les tempêtes, les sédiments et le niveau marin continuent de remodeler Tetiaroa. Découvrez les recherches qui suivent ces changements et contribuent à l'avenir de l'atoll.",
      researchLabel: "Explorer le fil d'impact",
      researchHref: "/fr/impact",
      gisLabel: "Ouvrir l'observatoire SIG de Tetiaroa",
      donateLabel: "Financer l'action",
      donateHref: "/fr/donate",
    },
  },
};

export function clampStageIndex(
  index: number,
  stageCount: number = geologyStageIds.length,
) {
  if (!Number.isFinite(index) || stageCount <= 0) {
    return 0;
  }

  return Math.min(Math.max(Math.round(index), 0), stageCount - 1);
}

export function getStageIndex(
  stageId: string | null | undefined,
  stages: Pick<GeologyStage, "id">[] = englishStages,
) {
  const index = stages.findIndex((stage) => stage.id === stageId);
  return index === -1 ? 0 : index;
}

export function getMissingStageIds(
  reference: Pick<GeologyStage, "id">[],
  candidate: Pick<GeologyStage, "id">[],
) {
  const candidateIds = new Set(candidate.map((stage) => stage.id));
  return reference
    .map((stage) => stage.id)
    .filter((stageId) => !candidateIds.has(stageId));
}

export function resolveMediaSource(
  source: string | null | undefined,
  fallback: string,
) {
  return typeof source === "string" && source.trim() ? source : fallback;
}
