export type SproutVideoSource = {
  embedUrl: string;
  title: string;
};

export const homeVideoSources = {
  hero: {
    embedUrl:
      "https://videos.sproutvideo.com/embed/489ad3b4141ae3c7c2/093bcd00f6a0db0d",
    title: "Tetiaroa Society homepage film",
  },
  sanctuary: {
    embedUrl:
      "https://videos.sproutvideo.com/embed/aa9ad3b41319e4c720/b71040ae92412507",
    title: "Sea turtle and lemon shark sanctuary at Tetiaroa",
  },
  societyFilm: {
    embedUrl:
      "https://videos.sproutvideo.com/embed/729adab61f1fefc9f8/f4bfbfcb9a151af2",
    title: "Tetiaroa Society film",
  },
  vrClip: {
    embedUrl:
      "https://videos.sproutvideo.com/embed/109adcb11f1ee7c29a/fbc480b9c9885643",
    title: "Honu XR deep-water film",
  },
  turtleClip: {
    embedUrl:
      "https://videos.sproutvideo.com/embed/8c9adcb11f1ee0cb06/fcac44e653d24c4c",
    title: "Sea turtle swimming at Tetiaroa",
  },
  turtleCare: {
    embedUrl:
      "https://videos.sproutvideo.com/embed/5a9adcb11f1ee1cbd0/3e26b86df604ff7a",
    title: "Sea turtle care at Tetiaroa",
  },
  atoll: {
    embedUrl:
      "https://videos.sproutvideo.com/embed/5a9adcb11f1eefc5d0/b32ffb8e71a8f8ac",
    title: "Aerial film of Tetiaroa atoll",
  },
  lemonShark: {
    embedUrl:
      "https://videos.sproutvideo.com/embed/dc9adcb11f1eeecd56/2e40006e75751c4e",
    title: "Juvenile lemon shark in the Tetiaroa lagoon",
  },
} satisfies Record<string, SproutVideoSource>;
