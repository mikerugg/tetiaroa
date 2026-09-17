export const honuCopy = {
  metadata: {
    title: "Honu | A whole ocean to discover | Tetiaroa Society",
    description:
      "Meet the Honu submersibles and explore a coral reef. Pilot HONU, use its lights and sonar, and learn about the animals you find.",
  },
  hero: {
    eyebrow: "Tetiaroa Society · Ocean exploration",
    name: "HONU",
    title: "A little sub.",
    accent: "A whole new world.",
    body: "The ocean keeps going long after the sunlight runs out. Meet the submersibles built to take us there, and share what we find.",
    dive: "Start your dive",
    explore: "Meet the sub",
    caption: "Honu · DOER Marine",
    note: "Honu means sea turtle in Tahitian. This one has thrusters.",
  },
  intro: {
    eyebrow: "One pilot. Two passengers.",
    title: "What’s down there?",
    body: "A reef no diver has visited? An animal we don’t have a name for yet? Those questions deserve a closer look. Built by DOER Marine in partnership with Tetiaroa Society, Honu will carry scientists into the deep and share that world with young explorers through film and XR.",
  },
  anatomy: {
    eyebrow: "01 / Meet your vessel",
    title: "A window. And a whole lot more.",
    body: "That big dome is just the beginning. Tap the markers to discover how Honu moves, sees in the dark, and lends scientists a hand.",
    hint: "Choose a numbered part to look closer",
  },
  xr: {
    eyebrow: "03 / Bring the ocean with you",
    title: "A window seat.",
    accent: "For the rest of us.",
    body: "Honu has three seats. With 360° film, the view can travel from the ocean to a classroom. Look around our ocean film and see what catches your eye.",
    cta: "Open the 360° ocean film",
    note: "Drag to look around. No headset needed.",
    caption: "Three seats. One extraordinary view. · Inside Honu",
  },
  support: {
    eyebrow: "04 / Be part of the crew",
    title: "Support ocean",
    accent: "research.",
    body: "A dive can begin with a scientist’s question and end with a child asking ten more. Help make room for both: the research that tells us what’s down there, and the films that let more people see it.",
    closing:
      "Give to Tetiaroa Society, or talk with our team about supporting Honu.",
    donate: "Support Tetiaroa Society",
    contact: "Talk to us about Honu",
    paths: [
      {
        number: "01",
        title: "Go and see",
        body: "Get scientists close enough to study deep reefs and the animals that live there.",
      },
      {
        number: "02",
        title: "Bring back the evidence",
        body: "A sample, a photograph, an unfamiliar sound. Each dive can give researchers something new to investigate.",
      },
      {
        number: "03",
        title: "Make room for the next explorer",
        body: "Help a child discover that the ocean is full of questions they could grow up to answer.",
      },
    ],
  },
};

export const honuParts = [
  {
    id: "dome",
    number: "01",
    label: "The dome",
    title: "Your front-row seat to the ocean.",
    body: "Honu’s clear acrylic dome gives the pilot and two passengers a wide view outside. Everyone can watch together, compare what they notice, and decide where to look next.",
    question: "You’ve got a window seat. What would you look for first?",
    x: 59,
    y: 51,
  },
  {
    id: "thrusters",
    number: "02",
    label: "The thrusters",
    title: "Small moves. Close looks.",
    body: "Thrusters help the pilot move and position Honu underwater. Sometimes the most useful move is a tiny one: getting into place, then staying to watch.",
    question:
      "Imagine trying to hover beside one tiny animal while the water keeps moving.",
    x: 23,
    y: 49,
  },
  {
    id: "arms",
    number: "03",
    label: "The arms",
    title: "A scientist’s hands, underwater.",
    body: "The crew can’t reach through the dome. Robotic arms do the reaching for them. Fitted with sampling tools, they collect material for researchers to examine back at the surface.",
    question:
      "What could you learn from a sample that you couldn’t learn from a photograph?",
    x: 90,
    y: 77,
  },
  {
    id: "lights",
    number: "04",
    label: "The lights",
    title: "A little light goes a long way.",
    body: "Far below the surface, sunlight gives way to darkness. Honu’s lights reveal what’s nearby so the crew can observe it and the cameras can bring back a clear view.",
    question:
      "Try the lamps on your dive. What changes when you turn them off?",
    x: 80,
    y: 20,
  },
] as const;
