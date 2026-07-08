"use client";

import { useRouter } from "next/navigation";
import {
  ENGLISH_DONATE_PATH,
  FRENCH_DONATE_PATH,
} from "./language-links";
import {
  LanternDonate,
  type LanternDonateLabels,
  type LanternTier,
} from "./lantern-donate";

type HomeLanternLocale = "en" | "fr";

export function HomeLanternDonate({
  tiers,
  labels,
  locale = "en",
}: {
  tiers: LanternTier[];
  labels: LanternDonateLabels;
  locale?: HomeLanternLocale;
}) {
  const router = useRouter();
  const donatePath =
    locale === "fr" ? FRENCH_DONATE_PATH : ENGLISH_DONATE_PATH;

  return (
    <LanternDonate
      tiers={tiers}
      labels={labels}
      onDonate={(amount) => router.push(`${donatePath}?amount=${amount}`)}
    />
  );
}
