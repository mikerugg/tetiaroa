export const tarpCopy = {
  en: {
    eyebrow: "Tetiaroa Atoll Restoration Program",
    title: "Help the island recover.",
    intro:
      "A crab beneath the leaves. A chick high in the branches. Remove the rats and yellow crazy ants, and see who returns to this motu.",
    startTitle: "Look closely at the motu.",
    startBody:
      "Look among the trees and along the sand. Tap the rats and yellow crazy ants to remove them, then watch the island change.",
    start: "Explore the island",
    loading: "Finding our way to the motu…",
    error: "The island couldn’t load. Let’s try again.",
    retry: "Try again",
    sceneLabel:
      "A Tetiaroa island. Remove rats and yellow crazy ant colonies to reveal native plants, hermit crabs, and white terns.",
    progressLabel: "Removed",
    reset: "Start over",
    pause: "Pause exploration",
    resume: "Resume exploration",
    pauseHint: "Take a moment. The island will wait.",
    panHint: "Drag to look around the island.",
    panLeft: "Look left across the island",
    panRight: "Look right across the island",
    firstHint: "Tap a rat or a cluster of yellow ants.",
    ratRemoved: "One less rat. Keep looking among the leaves.",
    antsRemoved: "This patch is clear of ants. Keep exploring.",
    seedlingsHint: "New leaves are opening. Tap a seedling to look closer.",
    crabsHint: "A red crab is back on the sand. Tap it to meet your new neighbor.",
    ternsHint: "White wings above the trees. Tap a tern to meet it.",
    completeTitle: "Look who’s back.",
    completeBody:
      "Stay a while with the new arrivals. Out on Tetiaroa, the TARP team keeps watching: checking for invaders, protecting nests, and following each sign of recovery.",
    explore: "Meet the island’s wildlife",
    close: "Back to the island",
    guideLabel: "In our species guide",
    removeRat: "Remove rat",
    removeAnts: "Remove yellow crazy ant colony",
    ratsLabel: "Rats removed",
    antsLabel: "Colonies removed",
    returningLabel: "Life returning",
    replay: "Explore again",
    learnMore: "Follow TARP’s work",
  },
  fr: {
    eyebrow: "Programme de restauration de l’atoll de Tetiaroa",
    title: "Aidez le motu à revivre.",
    intro:
      "Un crabe sous les feuilles. Un poussin dans les branches. Retirez les rats et les fourmis folles jaunes, puis découvrez qui revient sur ce motu.",
    startTitle: "Regardez le motu de plus près.",
    startBody:
      "Cherchez entre les arbres et sur le sable. Touchez les rats et les fourmis folles jaunes pour les retirer, puis regardez le motu changer.",
    start: "Explorer le motu",
    loading: "En route vers le motu…",
    error: "Le motu n’a pas pu s’afficher. Réessayons.",
    retry: "Réessayer",
    sceneLabel:
      "Un motu de Tetiaroa. Retirez les rats et les colonies de fourmis folles jaunes pour voir revenir plantes indigènes, bernard-l’ermite et gygis blanches.",
    progressLabel: "Retirés",
    reset: "Recommencer",
    pause: "Mettre l’exploration en pause",
    resume: "Reprendre l’exploration",
    pauseHint: "Prenez votre temps. Le motu vous attend.",
    panHint: "Faites glisser la vue pour explorer le motu.",
    panLeft: "Regarder vers la gauche du motu",
    panRight: "Regarder vers la droite du motu",
    firstHint: "Touchez un rat ou un groupe de fourmis jaunes.",
    ratRemoved: "Un rat de moins. Cherchez encore entre les feuilles.",
    antsRemoved: "Les fourmis ont quitté ce coin. Poursuivez l’exploration.",
    seedlingsHint: "De nouvelles feuilles s’ouvrent. Touchez une jeune pousse pour l’observer.",
    crabsHint: "Un crabe rouge est de retour sur le sable. Touchez-le pour faire sa connaissance.",
    ternsHint: "Des ailes blanches au-dessus des arbres. Touchez une gygis pour la découvrir.",
    completeTitle: "Regardez qui est revenu.",
    completeBody:
      "Restez un moment avec les nouveaux arrivants. Sur Tetiaroa, l’équipe du TARP poursuit son travail : guetter le retour des espèces invasives, protéger les nids et suivre chaque signe de reprise.",
    explore: "Rencontrer les habitants du motu",
    close: "Retour au motu",
    guideLabel: "Dans notre guide des espèces",
    removeRat: "Retirer le rat",
    removeAnts: "Retirer la colonie de fourmis folles jaunes",
    ratsLabel: "Rats retirés",
    antsLabel: "Colonies retirées",
    returningLabel: "La vie revient",
    replay: "Explorer à nouveau",
    learnMore: "Suivre le travail du TARP",
  },
} as const;

export const nativeLife = [
  {
    id: "seedling",
    image: "native-seedling.png",
    en: {
      name: "Native seedlings",
      title: "A forest starts close to the ground.",
      body:
        "A new shoot is easy to miss. Rats eat seeds and young plants; removing them gives native vegetation a chance to grow. Those leaves can become shelter for the island’s next generation of seabirds.",
      guideHref: "/island/plants",
      discoverLabel: "Discover the native seedlings",
    },
    fr: {
      name: "Jeunes plantes indigènes",
      title: "La forêt commence au ras du sol.",
      body:
        "Une jeune pousse passe facilement inaperçue. Les rats mangent graines et plantules ; leur retrait permet à la végétation indigène de grandir. Ces feuilles pourront un jour abriter une nouvelle génération d’oiseaux marins.",
      guideHref: "/fr/island/plants",
      discoverLabel: "Découvrir les jeunes plantes indigènes",
    },
  },
  {
    id: "crab",
    image: "hermit-crab.png",
    en: {
      name: "Strawberry hermit crab",
      title: "That shell is going somewhere.",
      body:
        "Look for the bright red legs below that borrowed shell. Strawberry hermit crabs eat fallen leaves and other remains along the shore. When invasive ants disappear, native crabs have room to return.",
      guideHref: "/island/invertebrates/strawberry-hermit-crab",
      discoverLabel: "Meet the strawberry hermit crab",
    },
    fr: {
      name: "Bernard-l’ermite fraise",
      title: "Une coquille qui se promène.",
      body:
        "Repérez les pattes rouge vif sous la coquille. Le bernard-l’ermite fraise se nourrit de feuilles mortes et d’autres débris sur le rivage. Quand les fourmis invasives disparaissent, les crabes indigènes peuvent revenir.",
      guideHref: "/fr/island/invertebrates/strawberry-hermit-crab",
      discoverLabel: "Rencontrer le bernard-l’ermite fraise",
    },
  },
  {
    id: "tern",
    image: "white-tern.png",
    en: {
      name: "White tern",
      title: "An egg out in the open.",
      body:
        "White terns lay a single egg right on a branch, without building a nest. With rats gone, more eggs can hatch—and more chicks get the chance to take flight.",
      guideHref: "/island/birds/white-common-tern",
      discoverLabel: "Meet the white tern",
    },
    fr: {
      name: "Gygis blanche",
      title: "Un œuf à découvert.",
      body:
        "La gygis blanche pond un seul œuf directement sur une branche, sans construire de nid. Sans les rats, davantage d’œufs peuvent éclore et davantage de poussins ont la chance de prendre leur envol.",
      guideHref: "/fr/island/birds/white-common-tern",
      discoverLabel: "Rencontrer la gygis blanche",
    },
  },
] as const;

export type NativeLifeId = (typeof nativeLife)[number]["id"];
