"use client";

import { homeCopies } from "../home-copy";
import { ENGLISH_DONATE_PATH } from "../language-links";
import { LanternExperience } from "../lantern-experience";

// Prototype wrapper — renders the shared production lantern experience with
// English copy so it can be compared against the other CTA concepts.
export function ConceptLantern() {
  const copy = homeCopies.en;

  return (
    <LanternExperience
      night={copy.night}
      tiers={copy.lantern.tiers}
      labels={copy.lantern.labels}
      donatePath={ENGLISH_DONATE_PATH}
    />
  );
}
